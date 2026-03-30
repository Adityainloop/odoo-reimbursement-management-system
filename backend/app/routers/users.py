from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).order_by(models.User.user_id.asc()).all()


@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/company/{company_id}", response_model=list[schemas.UserResponse])
def get_users_by_company(company_id: int, db: Session = Depends(get_db)):
    users = (
        db.query(models.User)
        .filter(models.User.company_id == company_id)
        .order_by(models.User.user_id.asc())
        .all()
    )

    return users