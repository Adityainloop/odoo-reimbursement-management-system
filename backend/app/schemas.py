from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


# =========================
# COMPANY SCHEMAS
# =========================
class CompanyBase(BaseModel):
    name: str


class CompanyCreate(CompanyBase):
    pass


class CompanyResponse(CompanyBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# =========================
# USER SCHEMAS
# =========================
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    company_id: int


class UserCreate(UserBase):
    reporting_manager_id: Optional[int] = None


class UserRoleUpdate(BaseModel):
    role: str


class UserManagerUpdate(BaseModel):
    reporting_manager_id: Optional[int] = None


class ReportingManagerMini(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class UserResponse(UserBase):
    id: int
    reporting_manager_id: Optional[int] = None
    reporting_manager: Optional[ReportingManagerMini] = None

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: EmailStr


class LoginResponse(BaseModel):
    message: str
    user: UserResponse


# =========================
# EXPENSE SCHEMAS
# =========================
class ExpenseBase(BaseModel):
    title: str
    amount: float
    category: str
    description: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    employee_id: int


class ExpenseReview(BaseModel):
    status: str  # approved / rejected
    manager_comment: Optional[str] = None


class ExpenseResponse(ExpenseBase):
    id: int
    employee_id: int
    status: str
    manager_comment: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)