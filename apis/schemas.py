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


class ImageResponse(BaseModel):
    id: int
    url: str
    tagged: Optional[str] = None
    queued: Optional[bool] = False
    timestamp: datetime


class EventResponse(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime
    name: str
    attendees: Optional[List[int]] = []
    thumbnail: Optional[str] = None
    images: Optional[List[ImageResponse]] = []


class EventsCategory(BaseModel):
    ongoing: List[EventResponse]
    past: List[EventResponse]


class UserDetails(BaseModel):
    id: int
    username: str
    email: str
    password: str
    profile_picture_url: Optional[str] = None
