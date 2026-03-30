from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/", response_model=schemas.ExpenseResponse)
def create_expense(payload: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    # Validate employee exists
    employee = db.query(models.User).filter(models.User.user_id == payload.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    if employee.role.lower() != "employee":
        raise HTTPException(status_code=400, detail="Only employees can submit expenses")

    # Validate company exists
    company = db.query(models.Company).filter(models.Company.company_id == payload.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    expense = models.Expense(
        title=payload.title,
        amount=payload.amount,
        category=payload.category,
        description=payload.description,
        receipt_path=payload.receipt_path,
        status="pending",
        employee_id=payload.employee_id,
        company_id=payload.company_id,
        manager_id=None,
        manager_comment=None,
        reviewed_at=None
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense


@router.get("/user/{user_id}", response_model=list[schemas.ExpenseResponse])
def get_user_expenses(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    expenses = (
        db.query(models.Expense)
        .filter(models.Expense.employee_id == user_id)
        .order_by(models.Expense.expense_id.desc())
        .all()
    )

    return expenses


@router.get("/pending", response_model=list[schemas.ExpenseResponse])
def get_pending_expenses(db: Session = Depends(get_db)):
    expenses = (
        db.query(models.Expense)
        .filter(models.Expense.status == "pending")
        .order_by(models.Expense.expense_id.desc())
        .all()
    )

    return expenses


@router.put("/{expense_id}/approve", response_model=schemas.ExpenseResponse)
def approve_expense(
    expense_id: int,
    payload: schemas.ExpenseReview,
    db: Session = Depends(get_db)
):
    expense = db.query(models.Expense).filter(models.Expense.expense_id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    manager = db.query(models.User).filter(models.User.user_id == payload.manager_id).first()
    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found")

    if manager.role.lower() != "manager":
        raise HTTPException(status_code=400, detail="Only managers can approve expenses")

    if expense.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending expenses can be approved")

    expense.status = "approved"
    expense.manager_id = payload.manager_id
    expense.manager_comment = payload.comment
    expense.reviewed_at = datetime.utcnow()

    db.commit()
    db.refresh(expense)

    return expense


@router.put("/{expense_id}/reject", response_model=schemas.ExpenseResponse)
def reject_expense(
    expense_id: int,
    payload: schemas.ExpenseReview,
    db: Session = Depends(get_db)
):
    expense = db.query(models.Expense).filter(models.Expense.expense_id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    manager = db.query(models.User).filter(models.User.user_id == payload.manager_id).first()
    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found")

    if manager.role.lower() != "manager":
        raise HTTPException(status_code=400, detail="Only managers can reject expenses")

    if expense.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending expenses can be rejected")

    expense.status = "rejected"
    expense.manager_id = payload.manager_id
    expense.manager_comment = payload.comment
    expense.reviewed_at = datetime.utcnow()

    db.commit()
    db.refresh(expense)

    return expense