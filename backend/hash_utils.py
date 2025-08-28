import bcrypt

def hash_data(plain_text: str) -> str:
    """
    Hash any sensitive string using bcrypt.
    Returns a utf-8 encoded hashed string.
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_text.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_hash(plain_text: str, hashed_text: str) -> bool:
    """
    Verify if the plain_text matches the hashed_text.
    """
    return bcrypt.checkpw(plain_text.encode('utf-8'), hashed_text.encode('utf-8'))
