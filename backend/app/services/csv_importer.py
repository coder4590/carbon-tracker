import csv
import io
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.emission_record import EmissionRecord
from app.models.emission_factor import EmissionFactor
from app.models.factory import Factory


def import_emissions_csv(db: Session, csv_content: str) -> dict:
    reader = csv.DictReader(io.StringIO(csv_content))
    created = 0
    errors = []
    
    for row_num, row in enumerate(reader, start=2):
        try:
            factory = db.query(Factory).filter(Factory.name.ilike(row['factory_name'].strip())).first()
            if not factory:
                errors.append(f"Row {row_num}: Factory '{row['factory_name']}' not found")
                continue
            
            factor = db.query(EmissionFactor).filter(EmissionFactor.name.ilike(row['emission_factor'].strip())).first()
            if not factor:
                errors.append(f"Row {row_num}: Factor '{row['emission_factor']}' not found")
                continue
            
            quantity = float(row['quantity'])
            record_date = datetime.strptime(row['date'].strip(), '%Y-%m-%d')
            total_emissions = quantity * factor.value
            
            record = EmissionRecord(
                factory_id=factory.id,
                emission_factor_id=factor.id,
                quantity=quantity,
                total_emissions=total_emissions,
                record_date=record_date,
                notes=row.get('notes', '')
            )
            db.add(record)
            created += 1
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")
    
    db.commit()
    return {"message": f"Imported {created} records", "created": created, "errors": errors if errors else None}