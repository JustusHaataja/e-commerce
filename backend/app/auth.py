from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
import os


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

key_value = os.getenv("JWT_SECRET")
if key_value is None:
    raise RuntimeError("SECRET_KEY")
SECRET_KEY = key_value

algorithm_value = os.getenv("JWT_ALGORITHM")
if algorithm_value is None:
    raise RuntimeError("ALGORITHM")
ALGORITHM = algorithm_value

expire_value = os.getenv("JWT_EXPIRE_MINUTES")
if expire_value is None:
    raise RuntimeError("ACCESS_TOKEN_EXPIRE")
ACCESS_TOKEN_EXPIRE_MINUTES = int(expire_value)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_jwt(user_id: int):
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return token


def verify_jwt(token: str) -> int | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            return None
        try:
            return int(sub)
        except (TypeError, ValueError):
            try:
                return int(str(sub))
            except (TypeError, ValueError):
                return None
    except JWTError:
        return None