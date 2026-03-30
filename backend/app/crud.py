from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from . import models, schemas


# ---------- AUTH ----------

def login_user(db: Session, email: str, password: str):
    return db.query(models.User).filter(
        models.User.email == email,
        models.User.password == password
    ).first()


# ---------- EXPENSES ----------

def create_expense(db: Session, expense: schemas.ExpenseCreate):
    new_expense = models.Expense(
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        description=expense.description,
        receipt_path=expense.receipt_path,
        status="pending",
        employee_id=expense.employee_id,
        company_id=expense.company_id
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense


def get_expenses_by_user(db: Session, user_id: int):
    return db.query(models.Expense).filter(
        models.Expense.employee_id == user_id
    ).all()


def get_pending_expenses(db: Session):
    return db.query(models.Expense).filter(
        models.Expense.status == "pending"
    ).all()


def get_all_expenses(db: Session):
    return db.query(models.Expense).all()


def get_expense_by_id(db: Session, expense_id: int):
    return db.query(models.Expense).filter(
        models.Expense.expense_id == expense_id
    ).first()


def approve_expense(db: Session, expense_id: int, comment: str = None):
    expense = get_expense_by_id(db, expense_id)
    if expense:
        expense.status = "approved"
        expense.manager_comment = comment
        expense.reviewed_at = func.now()
        db.commit()
        db.refresh(expense)
    return expense


def reject_expense(db: Session, expense_id: int, comment: str = None):
    expense = get_expense_by_id(db, expense_id)
    if expense:
        expense.status = "rejected"
        expense.manager_comment = comment
        expense.reviewed_at = func.now()
        db.commit()
        db.refresh(expense)
    return expense