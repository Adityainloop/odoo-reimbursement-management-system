from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from datetime import datetime

router = APIRouter(prefix="/manager", tags=["Manager"])


@router.get("/expenses/{manager_id}", response_model=list[schemas.ExpenseResponse])
def get_manager_expenses(manager_id: int, db: Session = Depends(get_db)):
    # check if manager exists
    manager = db.query(models.User).filter(models.User.id == manager_id).first()
    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found")

    if manager.role != "manager":
        raise HTTPException(status_code=400, detail="User is not a manager")

    # get all employees under this manager
    employee_ids = (
        db.query(models.User.id)
        .filter(models.User.reporting_manager_id == manager_id)
        .all()
    )

    employee_ids = [emp[0] for emp in employee_ids]

    if not employee_ids:
        return []

    expenses = (
        db.query(models.Expense)
        .filter(models.Expense.employee_id.in_(employee_ids))
        .order_by(models.Expense.created_at.desc())
        .all()
    )

    return expenses


@router.put("/expenses/{expense_id}/review", response_model=schemas.ExpenseResponse)
def review_expense(expense_id: int, review_data: schemas.ExpenseReview, db: Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    if review_data.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Status must be 'approved' or 'rejected'")

    expense.status = review_data.status
    expense.manager_comment = review_data.manager_comment
    expense.reviewed_at = datetime.utcnow()

    db.commit()
    db.refresh(expense)

    return expense