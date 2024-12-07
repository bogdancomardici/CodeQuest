from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str


class UserRead(BaseModel):
    id: int
    username: str
    email: str
    role: str
    score: int

    class Config:
        from_attributes = True


class BadgeCreate(BaseModel):
    title: str
    description: str


class BadgeRead(BaseModel):
    id: int
    title: str
    description: str

    class Config:
        from_attributes = True


class ChallangeCreate(BaseModel):
    title: str
    description: str
    output: str
    difficulty: str
    language: str


class ChallangeRead(BaseModel):
    id: int
    title: str
    description: str
    output: str
    difficulty: str
    language: str

    class Config:
        from_attributes = True
