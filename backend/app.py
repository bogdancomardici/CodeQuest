import logging
from fastapi import FastAPI, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from models import Base, engine, SessionLocal, User, Badge, Challange, Friend, Resource, UserBadge, UserChallange
from schemas import UserCreate, UserRead, BadgeCreate, BadgeRead, ChallangeCreate, ChallangeRead
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
logger.info(f"DATABASE_URL: {DATABASE_URL}")

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"Hello": "CodeQuest"}


@app.post("/users/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(username=user.username, email=user.email,
                   password=user.password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/", response_model=List[UserRead])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@app.get("/users/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.delete("/users/{user_id}", response_model=UserRead)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return user


@app.post("/badges/", response_model=BadgeRead)
def create_badge(badge: BadgeCreate, db: Session = Depends(get_db)):
    db_badge = Badge(title=badge.title, description=badge.description)
    db.add(db_badge)
    db.commit()
    db.refresh(db_badge)
    return db_badge


@app.get("/badges/", response_model=List[BadgeRead])
def read_badges(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    badges = db.query(Badge).offset(skip).limit(limit).all()
    return badges


@app.get("/badges/{badge_id}", response_model=BadgeRead)
def read_badge(badge_id: int, db: Session = Depends(get_db)):
    badge = db.query(Badge).filter(Badge.id == badge_id).first()
    if badge is None:
        raise HTTPException(status_code=404, detail="Badge not found")
    return badge


@app.delete("/badges/{badge_id}", response_model=BadgeRead)
def delete_badge(badge_id: int, db: Session = Depends(get_db)):
    badge = db.query(Badge).filter(Badge.id == badge_id).first()
    if badge is None:
        raise HTTPException(status_code=404, detail="Badge not found")
    db.delete(badge)
    db.commit()
    return badge


@app.post("/challanges/", response_model=ChallangeRead)
def create_challange(challange: ChallangeCreate, db: Session = Depends(get_db)):
    db_challange = Challange(title=challange.title, description=challange.description,
                             output=challange.output, difficulty=challange.difficulty, language=challange.language)
    db.add(db_challange)
    db.commit()
    db.refresh(db_challange)
    return db_challange


@app.get("/challanges/", response_model=List[ChallangeRead])
def read_challanges(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    challanges = db.query(Challange).offset(skip).limit(limit).all()
    return challanges


@app.get("/challanges/{challange_id}", response_model=ChallangeRead)
def read_challange(challange_id: int, db: Session = Depends(get_db)):
    challange = db.query(Challange).filter(
        Challange.id == challange_id).first()
    if challange is None:
        raise HTTPException(status_code=404, detail="Challange not found")
    return challange


@app.delete("/challanges/{challange_id}", response_model=ChallangeRead)
def delete_challange(challange_id: int, db: Session = Depends(get_db)):
    challange = db.query(Challange).filter(
        Challange.id == challange_id).first()
    if challange is None:
        raise HTTPException(status_code=404, detail="Challange not found")
    db.delete(challange)
    db.commit()
    return challange
