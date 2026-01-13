from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from models import CartItem

# NOTE:
# The import below is for local development (localhost execution).
# Use this when running the file directly.
# Commented-out relative import us used when running the app as a package.

# from .models import CartItem


def clean_old_guests(db: Session):
    expiration_date = datetime.now(timezone.utc) - timedelta(days=14)
    old_items = db.query(CartItem).filter(
        CartItem.guest_id.isnot(None),
        CartItem.updated_at < expiration_date
    )

    count = old_items.count()
    old_items.delete(synchronize_session=False)
    db.commit()
    return count