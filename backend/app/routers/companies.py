from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.get("/", response_model=list[schemas.CompanyResponse])
def get_companies(db: Session = Depends(get_db)):
    return db.query(models.Company).order_by(models.Company.company_id.asc()).all()


@router.get("/{company_id}", response_model=schemas.CompanyResponse)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(models.Company).filter(models.Company.company_id == company_id).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    return company