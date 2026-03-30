from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users", response_model=list[schemas.UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    users = (
        db.query(models.User)
        .options(joinedload(models.User.reporting_manager))
        .all()
    )
    return users


@router.post("/users", response_model=schemas.UserResponse)
def create_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    # validate manager if given
    if user_data.reporting_manager_id is not None:
        manager = db.query(models.User).filter(models.User.id == user_data.reporting_manager_id).first()
        if not manager:
            raise HTTPException(status_code=404, detail="Reporting manager not found")
        if manager.role != "manager":
            raise HTTPException(status_code=400, detail="Assigned user is not a manager")

    # optional: prevent assigning manager to non-employee
    if user_data.role != "employee" and user_data.reporting_manager_id is not None:
        raise HTTPException(status_code=400, detail="Only employees can have reporting managers")

    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        role=user_data.role,
        company_id=user_data.company_id,
        reporting_manager_id=user_data.reporting_manager_id if user_data.role == "employee" else None
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # reload with reporting_manager relation
    new_user = (
        db.query(models.User)
        .options(joinedload(models.User.reporting_manager))
        .filter(models.User.id == new_user.id)
        .first()
    )

    return new_user


@router.put("/users/{user_id}/role", response_model=schemas.UserResponse)
def update_user_role(user_id: int, role_data: schemas.UserRoleUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = role_data.role

    # if user becomes manager/admin, clear reporting manager
    if user.role in ["manager", "admin"]:
        user.reporting_manager_id = None

    db.commit()
    db.refresh(user)

    user = (
        db.query(models.User)
        .options(joinedload(models.User.reporting_manager))
        .filter(models.User.id == user.id)
        .first()
    )

    return user


@router.put("/users/{user_id}/manager", response_model=schemas.UserResponse)
def update_reporting_manager(user_id: int, manager_data: schemas.UserManagerUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # only employees should have managers
    if user.role != "employee":
        raise HTTPException(status_code=400, detail="Only employees can have reporting managers")

    if manager_data.reporting_manager_id is None:
        user.reporting_manager_id = None
    else:
        manager = db.query(models.User).filter(models.User.id == manager_data.reporting_manager_id).first()

        if not manager:
            raise HTTPException(status_code=404, detail="Manager not found")

        if manager.role != "manager":
            raise HTTPException(status_code=400, detail="Selected user is not a manager")

        if manager.id == user.id:
            raise HTTPException(status_code=400, detail="User cannot be their own manager")

        user.reporting_manager_id = manager.id

    db.commit()
    db.refresh(user)

    user = (
        db.query(models.User)
        .options(joinedload(models.User.reporting_manager))
        .filter(models.User.id == user.id)
        .first()
    )

    return user