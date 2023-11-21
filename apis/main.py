from typing import List
from fastapi import HTTPException, FastAPI, status, Response
from datetime import datetime, timedelta
from firebase_admin import storage
from utils import mysql_connection, firebase_connection
import pymysql
from schemas import (
    RegisterRequest,
    EventResponse,
    EventsCategory,
    UserDetails,
    ValidateUserRequest,
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


@app.post("/check_user", response_class=Response)
async def check_user(validate_user_request: ValidateUserRequest):
    conn = mysql_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database.",
        )

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM users WHERE email = %s OR username = %s",
                (
                    validate_user_request.email,
                    validate_user_request.username,
                ),
            )
            user = cursor.fetchone()

            if user:
                if user["email"] == validate_user_request.email:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Email already registered.",
                    )
                elif user["username"] == validate_user_request.username:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Username already taken.",
                    )

            return Response(status_code=200)

    except pymysql.MySQLError as e:
        print(f"Error executing query on the MySQL Database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error."
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


@app.post("/add_friend/{user_id}/{friend_username}", response_class=Response)
async def add_friend(user_id: int, friend_username: str):
    # TODO: change this to send friend request instead of automatically adding friend
    # TODO: add a friend requests table thta is structured the same as the friends table, except it only adds rows one way
    # TODO: add a new endpoint called accept friend request that updates this table
    conn = mysql_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database.",
        )

    try:
        with conn.cursor() as cursor:
            # Check if user exists
            cursor.execute(
                "SELECT * FROM users WHERE user_id = %s",
                (user_id,),
            )
            user = cursor.fetchone()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User {user_id} not found.",
                )

            # Check if friend exists
            cursor.execute(
                "SELECT * FROM users WHERE username = %s",
                (friend_username,),
            )
            friend = cursor.fetchone()

            if not friend:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User {friend_username} not found.",
                )

            # Check if they are already friends
            cursor.execute(
                """
                SELECT * FROM friends 
                WHERE (user_id = %s AND friend_user_id = %s) OR (user_id = %s AND friend_user_id = %s)
                """,
                (user_id, friend["user_id"], friend["user_id"], user_id),
            )
            existing_friendship = cursor.fetchone()

            if existing_friendship:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Users are already friends.",
                )

            # Add friend connection
            cursor.execute(
                "INSERT INTO friends (user_id, friend_user_id) VALUES (%s, %s), (%s, %s)",
                (user_id, friend["user_id"], friend["user_id"], user_id),
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


@app.post("/remove_friend/{user_id}/{friend_id}", response_class=Response)
async def add_friend(user_id: int, friend_id: int):
    conn = mysql_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database.",
        )

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT * FROM friends 
                WHERE (user_id = %s AND friend_user_id = %s) OR (user_id = %s AND friend_user_id = %s)
                """,
                (user_id, friend_id, friend_id, user_id),
            )
            existing_friendship = cursor.fetchone()

            if not existing_friendship:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Users are not friends.",
                )

            # Add friend connection
            cursor.execute(
                "DELETE FROM friends WHERE (user_id = %s AND friend_user_id = %s) OR (user_id = %s AND friend_user_id = %s)",
                (user_id, friend_id, friend_id, user_id),
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


@app.get("/get_friends/{user_id}", response_model=List[UserDetails])
async def get_friends(user_id: int):
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
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Event {user_id} not found.",
                )
            # Get friends
            cursor.execute(
                """
                SELECT * FROM users
                INNER JOIN friends ON users.user_id = friends.friend_user_id
                WHERE friends.user_id = %s
                """,
                (user_id),
            )
            friends = cursor.fetchall()

            return [UserDetails(**friend) for friend in friends]

    except pymysql.MySQLError as e:
        print(f"Error executing query on the MySQL Database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error."
        )
    finally:
        conn.close()


@app.post("/add_user_to_event/{user_id}/{event_id}", response_class=Response)
async def add_user_to_event(user_id: int, event_id: int):
    conn = mysql_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database.",
        )

    try:
        with conn.cursor() as cursor:
            # Check if the user and event exist
            for table, id in [("users", user_id), ("events", event_id)]:
                cursor.execute(
                    f"SELECT * FROM {table} WHERE {table[:-1]}_id = %s",
                    (id),
                )
                item = cursor.fetchone()

                if not item:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"{table[:-1].capitalize()} {id} not found.",
                    )

            # Add user to event
            cursor.execute(
                "INSERT INTO event_attendees (event_id, attendee_user_id) VALUES (%s, %s)",
                (event_id, user_id),
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


async def get_event_attendees(event_id: int):
    conn = mysql_connection()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database.",
        )

    try:
        with conn.cursor() as cursor:
            # Check if the event exists
            cursor.execute(
                "SELECT * FROM events WHERE event_id = %s",
                (event_id),
            )
            event = cursor.fetchone()

            if not event:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Event {event_id} not found.",
                )

            # Get attendee details
            cursor.execute(
                """
                SELECT * FROM users
                INNER JOIN event_attendees ON users.user_id = event_attendees.attendee_user_id
                WHERE event_attendees.event_id = %s
                """,
                (event_id,),
            )
            attendees = cursor.fetchall()

            return [UserDetails(**attendee) for attendee in attendees]

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

                    attendees = await get_event_attendees(event["event_id"])

                    # Construct EventResponse for each event
                    event_response = EventResponse(
                        event_id=event["event_id"],
                        name=event["name"],
                        start_time=event["start_time"],
                        end_time=event["end_time"],
                        thumbnail=event["thumbnail"],
                        attendees=attendees,
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

                attendees = await get_event_attendees(event_id)

                return EventResponse(
                    event_id=event["event_id"],
                    name=event["name"],
                    start_time=event["start_time"],
                    end_time=event["end_time"],
                    images=images,
                    attendees=attendees,
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
