from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    company_id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False, unique=True)
    country = Column(String(100), nullable=True)
    currency = Column(String(20), nullable=True)

    users = relationship("User", back_populates="company", cascade="all, delete")
    expenses = relationship("Expense", back_populates="company", cascade="all, delete")


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)  # plain text for hackathon demo
    role = Column(String(50), nullable=False)  # employee / manager / admin

    company_id = Column(Integer, ForeignKey("companies.company_id"), nullable=False)

    company = relationship("Company", back_populates="users")
    reporting_manager_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    submitted_expenses = relationship(
        "Expense",
        foreign_keys="Expense.employee_id",
        back_populates="employee"
    )

    reviewed_expenses = relationship(
        "Expense",
        foreign_keys="Expense.manager_id",
        back_populates="manager"
    )


class Expense(Base):
    __tablename__ = "expenses"

    expense_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    receipt_path = Column(String(500), nullable=True)

    status = Column(String(50), nullable=False, default="pending")  # pending/approved/rejected

    employee_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.company_id"), nullable=False)
    manager_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)

    manager_comment = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    manager_comment = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    employee = relationship(
        "User",
        foreign_keys=[employee_id],
        back_populates="submitted_expenses"
    )

    manager = relationship(
        "User",
        foreign_keys=[manager_id],
        back_populates="reviewed_expenses"
    )

    company = relationship("Company", back_populates="expenses")