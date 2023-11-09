from fastapi import FastAPI, Depends
from typing import List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import LoginRequest, RegisterRequest, EventsCategory, ImageResponse, UserDetails
from utils import postgres_connection

app = FastAPI()

# Dependency to get the database session


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


@app.get("/get_events/{user_id}", response_model=EventsCategory)
async def get_events(user_id: int, db: Session = Depends(get_db)):
    '''
    Endpoint that takes a user id, and returns an events object from SQL
    of every event that user is associated with.

    Input:
        user_id: int

    Output:
        {
            ongoing: [
                {
                    event_id: int
                    start_time: timestamp
                    end_time: timestamp
                    thumbnail: image_url
                    event_name: string
                },
                ...
            ],
            past: [
                {
                    event_id: int
                    start_time: timestamp
                    end_time: timestamp
                    thumbnail: image_url
                    event_name: string
                },
                ...
            ]
        }
    '''
    # Add your logic to fetch events from the database
    return {"ongoing": [user_id], "past": [user_id]}


@app.get("/get_event_images/{event_id}", response_model=List[ImageResponse])
async def get_event_images(event_id: int, db: Session = Depends(get_db)):
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
    # Add your logic to fetch event images from the database
    return []

# Additional endpoints you may consider adding:
# - Update user profile
# - Change password
# - Join/Leave event
# - Add/Remove friend
# - Upload/Delete image
