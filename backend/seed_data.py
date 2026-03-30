from datetime import datetime

from app.database import SessionLocal, engine, Base
from app import models

# Ensure tables exist
Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()

    try:
        existing_company = db.query(models.Company).filter(
            models.Company.company_name == "Demo Corp"
        ).first()

        if existing_company:
            print("Seed data already exists. Skipping...")
            return

        company = models.Company(
            company_name="Demo Corp",
            country="India",
            currency="INR"
        )
        db.add(company)
        db.commit()
        db.refresh(company)

        admin = models.User(
            full_name="Admin User",
            email="admin@demo.com",
            password="admin123",
            role="admin",
            company_id=company.company_id
        )

        manager = models.User(
            full_name="Manager User",
            email="manager@demo.com",
            password="manager123",
            role="manager",
            company_id=company.company_id
        )

        employee = models.User(
            full_name="Employee User",
            email="employee@demo.com",
            password="employee123",
            role="employee",
            company_id=company.company_id
        )

        db.add_all([admin, manager, employee])
        db.commit()

        db.refresh(admin)
        db.refresh(manager)
        db.refresh(employee)

        expense1 = models.Expense(
            title="Taxi to client meeting",
            amount=450.0,
            category="Travel",
            description="Uber ride to client office",
            receipt_path="receipts/taxi1.jpg",
            status="pending",
            employee_id=employee.user_id,
            company_id=company.company_id
        )

        expense2 = models.Expense(
            title="Lunch with client",
            amount=1200.0,
            category="Meals",
            description="Business lunch reimbursement",
            receipt_path="receipts/lunch1.jpg",
            status="approved",
            employee_id=employee.user_id,
            company_id=company.company_id,
            manager_id=manager.user_id,
            manager_comment="Approved for business meeting",
            reviewed_at=datetime.utcnow()
        )

        db.add_all([expense1, expense2])
        db.commit()

        print("Seed data inserted successfully!")
        print("\nDemo Login Credentials:")
        print("Admin    -> admin@demo.com / admin123")
        print("Manager  -> manager@demo.com / manager123")
        print("Employee -> employee@demo.com / employee123")

    finally:
        db.close()


if __name__ == "__main__":
    seed()