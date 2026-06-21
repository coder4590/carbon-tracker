from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ----- Base & Shared -----
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


# ----- Request Schemas -----
class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ----- Response Schemas -----
class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None