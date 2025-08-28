from flask import Flask, request, jsonify
import pandas as pd
import joblib
import os
import sqlite3
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "predictions.db")

HEART_MODEL_PATH = os.path.join(BASE_DIR,"xgb_heart_model.joblib")
DIABETES_MODEL_PATH = os.path.join(BASE_DIR,"rf_diabetes_model.joblib")  

heart_model = joblib.load(HEART_MODEL_PATH)
diabetes_model = joblib.load(DIABETES_MODEL_PATH)
print("Heart model loaded from:", HEART_MODEL_PATH)
print("Diabetes model loaded from:", DIABETES_MODEL_PATH)


def init_db():
    os.makedirs(BASE_DIR, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS health_predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                heart_prob REAL,
                heart_risk TEXT,
                diabetes_prob REAL,
                diabetes_risk TEXT
            )
        """)
        conn.commit()

# Initialize DB
init_db()


def classify_risk(prob, disease_type):
    if prob < 0.33:
        return "Low", f"Your {disease_type} risk is low. Maintain a healthy lifestyle."
    elif prob < 0.66:
        return "Moderate", f"Your {disease_type} risk is moderate. Regular check-ups are advised."
    else:
        return "High", f"Your {disease_type} risk is high. Please consult a doctor immediately."

def validate_heart_input(data):
    required = ["Age","Sex","ChestPainType","RestingBP","Cholesterol","FastingBS","RestingECG","MaxHR","ExerciseAngina","Oldpeak","ST_Slope"]
    for field in required:
        if field not in data:
            return False, f"Missing heart field: {field}"
    return True, ""

def validate_diabetes_input(data):
    required = ["Pregnancies","Glucose","BloodPressure","SkinThickness","Insulin","BMI","DiabetesPedigreeFunction","Age"]
    for field in required:
        if field not in data:
            return False, f"Missing diabetes field: {field}"
    return True, ""


def save_prediction(heart_prob, heart_risk, diabetes_prob, diabetes_risk):
    try:
        heart_prob = float(heart_prob) if heart_prob is not None else None
    except (ValueError, TypeError):
        heart_prob = None

    try:
        diabetes_prob = float(diabetes_prob) if diabetes_prob is not None else None
    except (ValueError, TypeError):
        diabetes_prob = None

    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("""
            INSERT INTO health_predictions (timestamp, heart_prob, heart_risk, diabetes_prob, diabetes_risk)
            VALUES (?, ?, ?, ?, ?)
        """, (datetime.now().isoformat(), heart_prob, heart_risk, diabetes_prob, diabetes_risk))
        conn.commit()


@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    try:
        data = request.get_json()
        from hash_wrapper import hash_patient_info

        hashed_data=hash_patient_info({
            "age": data["Age"],
            "sex": data["Sex"],
            "cp": data["ChestPainType"],
            "restbp": data["RestingBP"],
            "chol": data["Cholesterol"],
            "fbs": data["FastingBS"],
            "restecg": data["RestingECG"],
            "thalach": data["MaxHR"],
            "exang": data["ExerciseAngina"],
            "oldpeak": data["Oldpeak"],
            "ST slope": data["ST_Slope"]
        })

        print("Hashed patient data:",hashed_data)
        hashed_data_str = {k: str(v) for k, v in hashed_data.items()}
        
        print(data)
        valid, msg = validate_heart_input(data)
        if not valid:
            return jsonify({"error": msg}), 400

        heart_df = pd.DataFrame([{
            "age": data["Age"],
            "sex": data["Sex"],
            "cp": data["ChestPainType"],
            "restbp": data["RestingBP"],
            "chol": data["Cholesterol"],
            "fbs": data["FastingBS"],
            "restecg": data["RestingECG"],
            "thalach": data["MaxHR"],
            "exang": data["ExerciseAngina"],
            "oldpeak": data["Oldpeak"],
            "ST slope": data["ST_Slope"]
        }])
        print(heart_df)
        heart_prob = heart_model.predict_proba(heart_df)[0][1]
        heart_risk, heart_reco = classify_risk(heart_prob, "heart")
    
        save_prediction(heart_prob, heart_risk, None, None)

        return jsonify({
            "hashed_patient_data": hashed_data_str,
            "probability": float(heart_prob),
            "risk_score": heart_risk,
            "recommendation": heart_reco
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    try:
        data = request.get_json()

        from hash_wrapper import hash_patient_info
        hashed_data=hash_patient_info({
            "Pregnancies": data["Pregnancies"],
            "Glucose": data["Glucose"],
            "BloodPressure": data["BloodPressure"],
            "SkinThickness": data["SkinThickness"],
            "Insulin": data["Insulin"],
            "BMI": data["BMI"],
            "DiabetesPedigreeFunction": data["DiabetesPedigreeFunction"],
            "Age": data["Age"]
        })
        print("Hashed diabetes patient data:", hashed_data)

        valid, msg = validate_diabetes_input(data)
        if not valid:
            return jsonify({"error": msg}), 400

        diabetes_df = pd.DataFrame([{
            "Pregnancies": data["Pregnancies"],
            "Glucose": data["Glucose"],
            "BloodPressure": data["BloodPressure"],
            "SkinThickness": data["SkinThickness"],
            "Insulin": data["Insulin"],
            "BMI": data["BMI"],
            "DiabetesPedigreeFunction": data["DiabetesPedigreeFunction"],
            "Age": data["Age"]
        }])

        diabetes_prob = diabetes_model.predict_proba(diabetes_df)[0][1]
        diabetes_risk, diabetes_reco = classify_risk(diabetes_prob, "diabetes")

        save_prediction(None, None, diabetes_prob, diabetes_risk)

        return jsonify({
            "probability": float(diabetes_prob),
            "risk_score": diabetes_risk,
            "recommendation": diabetes_reco
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict/both', methods=['POST'])
def predict_both():
    try:
        data = request.get_json()
        from hash_wrapper import hash_patient_info
        
        hashed_data=hash_patient_info=({
            "age": data["Age"],
            "sex": data["Sex"],
            "cp": data["ChestPainType"],
            "restbp": data["RestingBP"],
            "chol": data["Cholesterol"],
            "fbs": data["FastingBS"],
            "restecg": data["RestingECG"],
            "thalach": data["MaxHR"],
            "exang": data["ExerciseAngina"],
            "oldpeak": data["Oldpeak"],
            "ST slope": data["ST Slope"],
            "Pregnancies": data["Pregnancies"],
            "Glucose": data["Glucose"],
            "BloodPressure": data["BloodPressure"],
            "SkinThickness": data["SkinThickness"],
            "Insulin": data["Insulin"],
            "BMI": data["BMI"],
            "DiabetesPedigreeFunction": data["DiabetesPedigreeFunction"],
            "Age": data["Age"]
        })

        print("Hashed heart patient data:", hashed_data)
        
        valid_heart, msg = validate_heart_input(data)
        if not valid_heart:
            return jsonify({"error": msg}), 400
        valid_diab, msg = validate_diabetes_input(data)
        if not valid_diab:
            return jsonify({"error": msg}), 400

        
        heart_df = pd.DataFrame([{
            "age": data["Age"],
            "sex": data["Sex"],
            "cp": data["ChestPainType"],
            "restbp": data["RestingBP"],
            "chol": data["Cholesterol"],
            "fbs": data["FastingBS"],
            "restecg": data["RestingECG"],
            "thalach": data["MaxHR"],
            "exang": data["ExerciseAngina"],
            "oldpeak": data["Oldpeak"],
            "ST slope": data["ST Slope"]
        }])

       
        diabetes_df = pd.DataFrame([{
            "Pregnancies": data["Pregnancies"],
            "Glucose": data["Glucose"],
            "BloodPressure": data["BloodPressure"],
            "SkinThickness": data["SkinThickness"],
            "Insulin": data["Insulin"],
            "BMI": data["BMI"],
            "DiabetesPedigreeFunction": data["DiabetesPedigreeFunction"],
            "Age": data["Age"]
        }])

       
        heart_prob = heart_model.predict_proba(heart_df)[0][1]
        heart_risk, heart_reco = classify_risk(heart_prob, "heart")

        diabetes_prob = diabetes_model.predict_proba(diabetes_df)[0][1]
        diabetes_risk, diabetes_reco = classify_risk(diabetes_prob, "diabetes")

        save_prediction(heart_prob, heart_risk, diabetes_prob, diabetes_risk)

        return jsonify({
            "heart": {"probability": float(heart_prob), "risk_score": heart_risk, "recommendation": heart_reco},
            "diabetes": {"probability": float(diabetes_prob), "risk_score": diabetes_risk, "recommendation": diabetes_reco}
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/dashboard', methods=['GET'])
def dashboard():
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("""
            SELECT timestamp, heart_prob, heart_risk, diabetes_prob, diabetes_risk 
            FROM health_predictions 
            ORDER BY timestamp DESC
        """)
        rows = c.fetchall()

    data = []
    for r in rows:
        data.append({
            "timestamp": r[0],
            "heart_prob": float(r[1]) if r[1] is not None else None,
            "heart_risk": r[2],
            "diabetes_prob": float(r[3]) if r[3] is not None else None,
            "diabetes_risk": r[4]
        })

    return jsonify({"history": data})


@app.route("/", methods=['GET'])
def root():
    return jsonify({
        "message": "Chronic Disease Management Backend 🚀",
        "available_endpoints": {
            "predict_heart": "/predict/heart",
            "predict_diabetes": "/predict/diabetes",
            "predict_both": "/predict/both",
            "dashboard": "/dashboard"
        }
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)