from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum


class UserDetails(BaseModel):
    user_id: int  # make uuid?
    apple_id: Optional[str] = None
    first_name: str
    last_name: str
    username: Optional[str] = None
    email: str
    profile_picture_url: Optional[str] = None
    firebase_id: str


class RegisterRequest(BaseModel):
    username: str
    email: str
    firebase_id: str
    first_name: str
    last_name: str


class ValidateUserRequest(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str


class ImageResponse(BaseModel):
    image_id: int
    url: str
    tagged: Optional[str] = None
    queued: Optional[bool] = False
    timestamp: datetime


class EventResponse(BaseModel):
    event_id: int
    start_time: datetime
    end_time: datetime
    name: str
    attendees: Optional[List[UserDetails]] = []
    thumbnail: Optional[str] = None
    images: Optional[List[ImageResponse]] = []


class EventsCategory(BaseModel):
    ongoing: List[EventResponse]
    past: List[EventResponse]
