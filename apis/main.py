from fastapi import HTTPException, FastAPI, Depends, status
from datetime import datetime, timedelta
from utils import mysql_connection
import requests
import pymysql
from schemas import (
    AppleLoginRequest,
    LoginRequest,
    RegisterRequest,
    EventResponse,
    EventsCategory,
    ImageResponse,
    UserDetails
)

app = FastAPI()


@app.get('/testsql')
async def test():
    conn = mysql_connection()
    if conn is not None:
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users';")
                column_types = cursor.fetchall()

                # cursor.execute(
                #     "DELETE FROM users WHERE user_id = 8;"
                # )
                # conn.commit()

                cursor.execute("SELECT * FROM users;")
                users = cursor.fetchall()
                print(
                    f"Successfully connected to MySQL Database. Users: {users}")

            return users, column_types
        except pymysql.MySQLError as e:
            print(f"Error executing query on the MySQL Database: {e}")
            return str(e)
        finally:
            conn.close()
    else:
        return "Failed to connect to MySQL Database."


@app.post("/login", response_model=UserDetails)
async def login(login_request: LoginRequest):
    '''
    Endpoint that takes an email address and password, and returns user details if valid
    and raises an HTTPException otherwise.
    '''

    conn = mysql_connection()
    if conn is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database."
        )

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM users WHERE email = %s OR username = %s
            """, (login_request.identifier, login_request.identifier))
            user = cursor.fetchone()

            if user:
                if user['password'] == login_request.password:
                    return UserDetails(**user)
                else:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid password"
                    )
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="user not found"
                )

    except pymysql.MySQLError as e:
        print(f"Error executing query on the MySQL Database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="database error."
        )
    finally:
        conn.close()


@app.post("/register", response_model=UserDetails)
async def register(register_request: RegisterRequest):
    '''
    Endpoint that takes an email address and password, and returns user details if valid
    and raises an HTTPException otherwise.
    '''

    conn = mysql_connection()
    if conn is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database."
        )

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM users WHERE email = %s OR username = %s
            """, (register_request.email, register_request.username))
            user = cursor.fetchone()

            if user:
                if user['email'] == register_request.email:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="email already registered, try logging in"
                    )
                elif user['username'] == register_request.username:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="username already taken"
                    )
            else:
                cursor.execute(
                    """
                    INSERT INTO users (email, username, password, first_name, last_name)
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    (register_request.email, register_request.username, register_request.password,
                     register_request.first_name, register_request.last_name)
                )
                conn.commit()
                return UserDetails(
                    user_id=cursor.lastrowid,
                    email=register_request.email,
                    username=register_request.username,
                    first_name=register_request.first_name,
                    last_name=register_request.last_name,
                    profile_picture_url=''
                )

    except pymysql.MySQLError as e:
        print(f"Error executing query on the MySQL Database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="database error."
        )
    finally:
        conn.close()


@app.post("/apple_login", response_model=UserDetails)
async def apple_login(login_request: AppleLoginRequest):
    '''
    Endpoint that takes an apple login credential, checks if an account exists, if so returns the user
    else returns an HTTP exception
    '''
    print(login_request)

    conn = mysql_connection()
    if conn is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to MySQL Database."
        )

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM users WHERE apple_id = %s OR email = %s
            """, (login_request.user, login_request.email))
            user = cursor.fetchone()

            if user:
                if user['apple_id'] != login_request.user:
                    cursor.execute("""
                        UPDATE users SET apple_id = %s WHERE email = %s
                    """, (login_request.user, login_request.email))
                    conn.commit()
                    user['apple_id'] = login_request.user

                return UserDetails(**user)
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found."
                )

    except pymysql.MySQLError as e:
        print(f"Error executing query on the MySQL Database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="database error."
        )
    finally:
        conn.close()


@app.post("/apple_new_user", response_model=UserDetails)
async def apple_new_user(login_request: AppleLoginRequest, username: str):
    '''
    returns none if username taken, otherwise adds new user and returns user details
    '''
    conn = mysql_connection()
    if conn is None:
        return "Failed to connect to MySQL Database."

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM users WHERE username = %s
            """, (username))
            user = cursor.fetchone()

            if user:
                # Username already taken
                raise HTTPException(
                    status_code=400, detail="username already taken")
            else:
                cursor.execute("""
                    INSERT INTO users (apple_id, username, email, first_name, last_name, profile_picture_url)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (login_request.user, username, login_request.email, login_request.fullName.givenName, login_request.fullName.familyName, None))
                conn.commit()

                return UserDetails(
                    user_id=cursor.lastrowid,
                    apple_id=login_request.user,
                    username=username,
                    email=login_request.email,
                    first_name=login_request.fullName.givenName,
                    last_name=login_request.fullName.familyName,
                    profile_picture_url=''
                )

    except pymysql.MySQLError as e:
        print(f"Error executing query on the MySQL Database: {e}")
        raise HTTPException(
            status_code=500, detail="failed to create new user")
    finally:
        conn.close()


@app.get("/get_user/{user_id}", response_model=UserDetails)
async def get_user_details(user_id: int):
    '''
    Endpoint that takes user_id, and returns all the details about that user
    '''

    response1 = requests.get('https://reqres.in/api/users?page=1')
    response2 = requests.get('https://reqres.in/api/users?page=2')

    users_page_1 = response1.json()['data']
    users_page_2 = response2.json()['data']

    all_users = users_page_1 + users_page_2

    for user in all_users:
        if user['id'] == user_id:
            return UserDetails(
                first_name=user['first_name'],
                last_name=user['last_name'],
                email=user['email'],
                profile_picture_url=user['avatar'],
                username=user['first_name'] + user['last_name'],
                user_id=user['id'])

    raise HTTPException(status_code=404, detail="user not found")


@app.post("/register")
async def register(register_request: RegisterRequest):
    '''
    Endpoint that takes a username, email, and password and updates the relevant SQL tables
    if valid and not already taken. Returns true if successful and false if not.
    '''
    # Add your logic to insert a new user into the database
    return {"registered": True or False}


@app.get("/get_all_user_events/{user_id}", response_model=EventsCategory)
async def get_all_user_events(user_id: int):
    try:
        # Fetch image URLs
        response = requests.get("https://api.unsplash.com/photos/random", params={
            'count': 6,
            'client_id': 'z8VmrXJoH1PlbOdhoL2vyzV1AD1C_xdxPrz4IA7N2lM',
        })
        response.raise_for_status()
        image_urls = [image['urls']['regular'] for image in response.json()]

        events = [EventResponse(
            id=i,
            start_time=datetime.now() - timedelta(days=2*i),
            end_time=datetime.now() + timedelta(days=1) - timedelta(days=2*i),
            thumbnail=url,
            name=f"Event {i}",
            attendees=[],
            images=[]
        ) for i, url in enumerate(image_urls)]

        event_categories = EventsCategory(
            ongoing=[e for e in events if e.end_time >= datetime.now()],
            past=[e for e in events if e.end_time < datetime.now()]
        )

        return event_categories

    except requests.exceptions.HTTPError as errh:
        print("Http Error:", errh)
        raise
    except requests.exceptions.ConnectionError as errc:
        print("Error Connecting:", errc)
        raise
    except requests.exceptions.Timeout as errt:
        print("Timeout Error:", errt)
        raise
    except requests.exceptions.RequestException as err:
        print("Something went wrong with the request:", err)
        raise


@app.get("/get_event/{event_id}", response_model=EventResponse)
async def get_event(event_id: int):
    '''
    Endpoint that takes an event id, and returns all the images associated from SQL.

    Input:
     event_id: int

    Output:
        [
            {
                image_id: int
                url: string
                tagged: string
                queued: boolean
                timestamp: timestamp
            },
            ...
        ]
    '''

    try:
        response = requests.get("https://api.unsplash.com/photos/random", params={
            'count': 11,
            'client_id': 'z8VmrXJoH1PlbOdhoL2vyzV1AD1C_xdxPrz4IA7N2lM'
        })
        response.raise_for_status()
        image_urls = [image['urls']['regular'] for image in response.json()]

        images = []
        for i, url in enumerate(image_urls):
            image = ImageResponse(
                id=i,
                url=url,
                timestamp=datetime.now()
            )
            images.append(image)

        return EventResponse(
            id=event_id,
            name='test',
            start_time=datetime.now(),
            end_time=datetime.now(),
            images=images)

    except requests.exceptions.HTTPError as errh:
        print("Http Error:", errh)
        raise
    except requests.exceptions.ConnectionError as errc:
        print("Error Connecting:", errc)
        raise
    except requests.exceptions.Timeout as errt:
        print("Timeout Error:", errt)
        raise
    except requests.exceptions.RequestException as err:
        print("Something went wrong with the request:", err)
        raise
