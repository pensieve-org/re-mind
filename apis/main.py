import os
from fastapi import FastAPI, Depends
from typing import List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import LoginRequest, RegisterRequest, EventResponse, EventsCategory, ImageResponse, UserDetails
from utils import postgres_connection
import requests

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
    try:
        # Fetch image URLs
        response = requests.get("https://api.unsplash.com/photos/random", params={
            'count': 6,
            'client_id': 'z8VmrXJoH1PlbOdhoL2vyzV1AD1C_xdxPrz4IA7N2lM',
        })
        response.raise_for_status()
        image_urls = [image['urls']['regular'] for image in response.json()]

        events = [EventResponse(
            event_id=i,
            start_time=datetime.now() - timedelta(days=2*i),
            end_time=datetime.now() + timedelta(days=1) - timedelta(days=2*i),
            thumbnail=url,
            event_name=f"Event {i}",
            attendees=[]
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


@app.get("/get_selected_event/{event_id}", response_model=List[ImageResponse])
async def get_selected_event(event_id: int, db: Session = Depends(get_db)):
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
            'count': event_id,
            'client_id': 'z8VmrXJoH1PlbOdhoL2vyzV1AD1C_xdxPrz4IA7N2lM'
        })
        response.raise_for_status()
        image_urls = [image['urls']['regular'] for image in response.json()]

        images = []
        for i, url in enumerate(image_urls):
            image = ImageResponse(
                image_id=i,
                event_id=event_id,
                url=url,
                timestamp=datetime.now()
            )
            images.append(image)

        return images

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
