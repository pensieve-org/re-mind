from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class EventResponse(BaseModel):
    event_id: int
    start_time: datetime
    end_time: datetime
    thumbnail: str
    event_name: str
    attendees: List[int]


class EventsCategory(BaseModel):
    ongoing: List[EventResponse]
    past: List[EventResponse]


class ImageResponse(BaseModel):
    image_id: int
    event_id: int
    url: str
    tagged: Optional[str] = None
    queued: bool
    timestamp: datetime


class UserDetails(BaseModel):
    user_id: int
    username: str
    email: str
    password: str
    profile_picture_url: Optional[str] = None
