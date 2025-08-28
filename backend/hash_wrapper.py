from hash_utils import hash_data

def hash_patient_info(data: dict) -> dict:
    """
    Hash all sensitive patient info fields.
    """
    hashed_data = {}
    for key, value in data.items():
        if value is not None:
            hashed_data[key] = hash_data(str(value))
        else:
            hashed_data[key] = None
    return hashed_data
