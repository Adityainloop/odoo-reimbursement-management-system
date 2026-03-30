from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, expenses, companies, admin, manager

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Reimbursement Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(companies.router)
app.include_router(expenses.router)
app.include_router(admin.router)
app.include_router(manager.router)


@app.get("/")
def root():
    return {"message": "Backend is running"}