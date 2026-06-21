from app.db.session import SessionLocal
from app.db.base import Base

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
