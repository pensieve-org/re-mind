from fastapi import HTTPException, FastAPI, Depends
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal
from utils import mysql_connection
import requests
from schemas import (
    AppleLoginRequest,
    LoginRequest,
    RegisterRequest,
    EventResponse,
    EventsCategory,
    ImageResponse,
    UserDetails
)
import pymysql

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get('/testsql')
async def test():
    conn = mysql_connection()
    if conn is not None:
        try:
            with conn.cursor() as cursor:
                # Fetch all users
                cursor.execute("SELECT * FROM users;")
                users = cursor.fetchall()
                print(
                    f"Successfully connected to MySQL Database. Users: {users}")

            return users
        except pymysql.MySQLError as e:
            print(f"Error executing query on the MySQL Database: {e}")
            return str(e)
        finally:
            conn.close()
    else:
        return "Failed to connect to MySQL Database."


@app.post("/login", response_model=UserDetails)
async def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    '''
    Endpoint that takes an email address and password, and returns user details if valid
    and raises an HTTPException otherwise.
    '''

    try:
        response = requests.post("https://reqres.in/api/login", data={
            'email': login_request.email,
            'password': login_request.password,
        })

        response = response.json()

        if 'token' in response:
            # Fetch user details from your database here
            # user_details = fetch_user_details(login_request.email)

            response1 = requests.get('https://reqres.in/api/users?page=1')
            response2 = requests.get('https://reqres.in/api/users?page=2')

            users_page_1 = response1.json()['data']
            users_page_2 = response2.json()['data']

            all_users = users_page_1 + users_page_2

            for user in all_users:
                if user['email'] == login_request.email:
                    return UserDetails(
                        first_name=user['first_name'],
                        last_name=user['last_name'],
                        email=user['email'],
                        profile_picture_url=user['avatar'],
                        username=user['first_name'] + user['last_name'],
                        id=user['id'])
        else:
            raise HTTPException(status_code=400, detail="Invalid credentials")
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/apple_login", response_model=UserDetails)
async def apple_login(login_request: AppleLoginRequest, db: Session = Depends(get_db)):
    '''
    Endpoint that takes an apple login credential, checks if an account exists, makes one if not, then returns the user
    '''
    # # Check if a user with the given Apple ID exists in the database
    # user = db.query(User).filter(User.apple_id == login_request.user).first()

    # # If the user doesn't exist, create a new user
    # if not user:
    #     user = User(
    #         apple_id=login_request.user,
    #         email=login_request.email,
    #         full_name=login_request.fullName,
    #         real_user_status=login_request.realUserStatus,
    #         state=login_request.state,
    #         authorization_code=login_request.authorizationCode,
    #         identity_token=login_request.identityToken,
    #     )
    #     db.add(user)
    #     db.commit()
    #     db.refresh(user)

    # # Convert the user object to a UserDetails object
    # user_details = UserDetails(
    #     id=user.id,
    #     apple_id=user.apple_id,
    #     email=user.email,
    #     full_name=user.full_name,
    #     real_user_status=user.real_user_status,
    #     state=user.state,
    # )
    print(login_request)

    # TODO: apple login only gives a name, email etc once. Need to create a user with that infor once then use the user or the identityToken field to fetch it

    return UserDetails(
        id=5,
        apple_id=login_request.user,
        username='testusername',
        email=login_request.email,
        first_name=login_request.fullName.givenName,
        last_name=login_request.fullName.familyName,
        profile_picture_url='https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/2020-Chevrolet-Corvette-Stingray/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&width=960'
    )


@app.get("/get_user/{user_id}", response_model=UserDetails)
async def get_user_details(user_id: int, db: Session = Depends(get_db)):
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
                id=user['id'])

    raise HTTPException(status_code=404, detail="User not found")


@app.post("/register")
async def register(register_request: RegisterRequest, db: Session = Depends(get_db)):
    '''
    Endpoint that takes a username, email, and password and updates the relevant SQL tables
    if valid and not already taken. Returns true if successful and false if not.
    '''
    # Add your logic to insert a new user into the database
    return {"registered": True or False}


@app.get("/get_all_user_events/{user_id}", response_model=EventsCategory)
async def get_all_user_events(user_id: int, db: Session = Depends(get_db)):
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
async def get_event(event_id: int, db: Session = Depends(get_db)):
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

# Additional endpoints you may consider adding:
# - Update user profile
# - Change password
# - Join/Leave event
# - Add/Remove friend
# - Upload/Delete image
