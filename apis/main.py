import os
import uuid
from fastapi import FastAPI, Depends
from typing import List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal
from utils import postgres_connection
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

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/login")
async def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    '''
    Endpoint that takes an email address and password, and returns true if valid
    and false if invalid based on SQL credentials.
    '''
    # Add your logic to verify credentials from the database
    return {"valid": True or False}


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
async def get_user_details(user_request: LoginRequest, db: Session = Depends(get_db)):
    '''
    Endpoint that takes user_id, and returns all the details about that user
    '''
    # Add your logic to verify credentials from the database
    return {"valid": True or False}


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
