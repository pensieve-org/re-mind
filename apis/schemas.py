from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum


class LoginRequest(BaseModel):
    identifier: str
    password: str


class AppleAuthenticationFullName(BaseModel):
    givenName: Optional[str] = None
    familyName: Optional[str] = None
    middleName: Optional[str] = None
    namePrefix: Optional[str] = None
    nameSuffix: Optional[str] = None
    nickname: Optional[str] = None


class AppleAuthenticationUserDetectionStatus(Enum):
    UNSUPPORTED = 0
    UNKNOWN = 1
    LIKELY_REAL = 2


class AppleLoginRequest(BaseModel):
    user: str
    fullName: Optional[AppleAuthenticationFullName] = None
    email: Optional[str] = None
    realUserStatus: AppleAuthenticationUserDetectionStatus
    state: Optional[str] = None
    authorizationCode: Optional[str] = None
    identityToken: Optional[str] = None


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str


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
    user_id: int  # make uuid?
    apple_id: Optional[str] = None
    first_name: str
    last_name: str
    username: Optional[str] = None
    email: str
    profile_picture_url: Optional[str] = None
