from app.db.session import engine
from sqlalchemy import text

conn = engine.connect()
conn.execute(text("ALTER TABLE factories ADD COLUMN emission_limit FLOAT DEFAULT 0"))
conn.commit()
conn.close()
print("Done")