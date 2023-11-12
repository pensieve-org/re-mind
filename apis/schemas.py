from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class AppleLoginRequest(BaseModel):
    user: str
    fullName: str
    email: str
    realUserStatus: int
    state: Optional[str] = None
    authorizationCode: str
    identityToken: str


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
    id: int  # make uuid?
    apple_id: Optional[str] = None
    first_name: str
    last_name: str
    username: str
    email: str
    profile_picture_url: Optional[str] = None
