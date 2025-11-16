from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core_dashboard.schemas.user import UserCreate, UserLogin, Token
from core_dashboard.models.user import User
from core_dashboard.database import get_db
from core_dashboard.utils.security import (
    verify_password,
    create_access_token,
    get_password_hash
)
from datetime import timedelta

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

ACCESS_TOKEN_EXPIRE_MINUTES = 60


@router.post("/register", response_model=Token)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # generate JWT
    access_token = create_access_token({"sub": str(new_user.id)}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token({"sub": str(user.id)}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}
