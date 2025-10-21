from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)


model = joblib.load('models/model.pkl')

@app.route("/")
def greet():
    return jsonify({"message": "Backend is running"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        features = np.array(data['features']).reshape(1, -1)
        prediction = model.predict(features)[0]
        result = "Survived" if prediction == 1 else "Did not survive"

        return jsonify({
            "prediction": int(prediction),
            "result": result
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
