from fastapi import HTTPException, FastAPI, Depends, status, Response
from datetime import datetime, timedelta

# from firebase_admin import auth, storage
from utils import mysql_connection, firebase_connection, sign_in_with_email_and_password
import requests
import pymysql
from schemas import (
    RegisterRequest,
    EventResponse,
    EventsCategory,
    ImageResponse,
    UserDetails,
)

app = FastAPI()


@app.on_event("startup")
def startup_event():
    firebase_connection()


@app.get("/testsql")
async def test():
    conn = mysql_connection()
    if conn is not None:
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users';"
                )
                column_types = cursor.fetchall()

                cursor.execute("SELECT * FROM users;")
                users = cursor.fetchall()
                print(f"Successfully connected to MySQL Database. Users: {users}")

            return users, column_types
        except pymysql.MySQLError as e:
            print(f"Error executing query on the MySQL Database: {e}")
            return str(e)
        finally:
            conn.close()
    else:
        return "Failed to connect to MySQL Database."


@app.get("/get_user/{firebase_id}", response_model=UserDetails)
async def get_user_details(firebase_id: str):
    """
    Endpoint that takes user_id, and returns all the details about that user
    """

    conn = mysql_connection()
    if conn is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database.",
        )

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT * FROM users WHERE firebase_id = %s
                """,
                (firebase_id),
            )
            user = cursor.fetchone()

            if user:
                return UserDetails(**user)

            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="user not found"
                )

    except pymysql.MySQLError as e:
        print(f"Error executing query on the MySQL Database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="database error."
        )
    finally:
        conn.close()


@app.post("/create_user", response_model=UserDetails)
async def create_user(register_request: RegisterRequest):
    conn = mysql_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database.",
        )

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM users WHERE email = %s OR username = %s OR firebase_id = %s",
                (
                    register_request.email,
                    register_request.username,
                    register_request.firebase_id,
                ),
            )
            user = cursor.fetchone()

            if user:
                if user["email"] == register_request.email:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Email already registered.",
                    )
                elif user["username"] == register_request.username:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Username already taken.",
                    )
                elif user["firebase_id"] == register_request.firebase_id:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Firebase ID already registered.",
                    )

            cursor.execute(
                "INSERT INTO users (email, username, first_name, last_name, firebase_id) VALUES (%s, %s, %s, %s, %s)",
                (
                    register_request.email,
                    register_request.username,
                    register_request.first_name,
                    register_request.last_name,
                    register_request.firebase_id,
                ),
            )
            conn.commit()

            return UserDetails(
                user_id=cursor.lastrowid,
                email=register_request.email,
                username=register_request.username,
                first_name=register_request.first_name,
                last_name=register_request.last_name,
                profile_picture_url="",
                firebase_id=register_request.firebase_id,
            )

    except pymysql.MySQLError as e:
        print(f"Error executing query on the MySQL Database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error."
        )
    finally:
        conn.close()


@app.get("/delete_user/{user_id}", response_class=Response)
async def delete_user(user_id: int):
    conn = mysql_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database.",
        )

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM users WHERE user_id = %s",
                (user_id),
            )
            user = cursor.fetchone()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
                )

            cursor.execute(
                "DELETE FROM users WHERE user_id = %s",
                (user_id),
            )
            conn.commit()

            return Response(status_code=200)

    except pymysql.MySQLError as e:
        print(f"Error executing query on the MySQL Database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error."
        )
    finally:
        conn.close()


@app.get("/get_all_user_events/{user_id}", response_model=EventsCategory)
async def get_all_user_events(user_id: int):
    conn = mysql_connection()
    if conn is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database.",
        )

    try:
        with conn.cursor() as cursor:
            # Fetch all events where the user is an attendee
            cursor.execute(
                """
                SELECT * FROM events
                INNER JOIN event_attendees ON events.event_id = event_attendees.event_id
                WHERE event_attendees.attendee_user_id = %s
                """,
                (user_id),
            )
            events = cursor.fetchall()

            if events:
                all_events = []
                for event in events:
                    # Fetch images for each event
                    cursor.execute(
                        """
                        SELECT * FROM images WHERE event_id = %s
                        """,
                        (event["event_id"]),
                    )
                    images = cursor.fetchall()

                    # Construct EventResponse for each event
                    event_response = EventResponse(
                        event_id=event["event_id"],
                        name=event["name"],
                        start_time=event["start_time"],
                        end_time=event["end_time"],
                        thumbnail=event.get(
                            "thumbnail", ""
                        ),  # Assuming thumbnail field can be optional
                        attendees=[],  # Assuming you need to fetch attendees separately if needed
                        images=images,
                    )
                    all_events.append(event_response)

                # Categorize events into ongoing and past
                event_categories = EventsCategory(
                    ongoing=[e for e in all_events if e.end_time >= datetime.now()],
                    past=[e for e in all_events if e.end_time < datetime.now()],
                )

                return event_categories

            else:
                return EventsCategory(ongoing=[], past=[])

    except pymysql.MySQLError as e:
        print(f"Error executing query on the MySQL Database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="database error."
        )
    finally:
        conn.close()


@app.get("/get_event/{event_id}", response_model=EventResponse)
async def get_event(event_id: int):
    """
    Endpoint that takes an event id, and returns all the images associated from SQL.
    """

    conn = mysql_connection()
    if conn is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database.",
        )

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT * FROM events WHERE event_id = %s
                """,
                (event_id),
            )
            event = cursor.fetchone()

            if event:
                cursor.execute(
                    """
                    SELECT * FROM images WHERE event_id = %s
                    """,
                    (event_id),
                )
                images = cursor.fetchall()

                return EventResponse(
                    event_id=event["event_id"],
                    name=event["name"],
                    start_time=event["start_time"],
                    end_time=event["end_time"],
                    images=images,
                )

            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="event not found"
                )

    except pymysql.MySQLError as e:
        print(f"Error executing query on the MySQL Database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="database error."
        )
    finally:
        conn.close()


@app.get("/image_test")
async def image_test():
    # TODO: need to get the permanent image url from the front end (client side) on upload
    # then pass that url to the backend and add it to the sql db
    # https://chat.openai.com/share/8552c102-bc3f-46fe-a0e3-16dbaba7d902

    def get_image_url(image_name: str):
        try:
            bucket = storage.bucket()
            blob = bucket.blob(image_name)
            url = blob.generate_signed_url(timedelta(seconds=300), method="GET")
            return url
        except Exception as e:
            print(f"Error getting image URL: {e}")

    return get_image_url("The Heavey's (134 of 566).jpeg")


@app.get("/password_reset_email")
async def password_reset_email():
    # TODO: send password reset email with firebase API (https://www.youtube.com/watch?v=w0P2v25Fwj4&ab_channel=CodewithMarcus)
    return
