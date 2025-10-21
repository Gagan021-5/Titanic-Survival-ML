# Titanic Survival Prediction ⚓

Welcome to the Titanic Survival Prediction project — a compact ML + Flask example that predicts whether a Titanic passenger survived using a scikit-learn pipeline served by a Flask API.

Project Overview
----------------
This repository trains a DecisionTreeClassifier on the classic Titanic dataset and exposes the trained pipeline via a simple REST API. It’s useful for learning end-to-end model development, preprocessing pipelines, and basic model serving.

What’s included
---------------
- titanicmodel.ipynb — Jupyter notebook for data preprocessing, training, evaluation, and saving the model.
- app.py — Flask API that serves predictions.
- models/model.pkl — Serialized pipeline (preprocessing + model).
- titanic.csv — Titanic dataset (not included; download separately from Kaggle).
- README.md — This file.

Features
--------
- End-to-end preprocessing pipeline:
  - Impute missing values (Age: mean; Embarked: most frequent)
  - Encode categorical variables (Sex, Embarked)
  - Scale numeric features with MinMaxScaler
- DecisionTreeClassifier trained inside an sklearn Pipeline
- Flask API with a /predict endpoint that returns JSON predictions

Project structure
-----------------
├── titanicmodel.ipynb  
├── app.py  
├── models/  
│   └── model.pkl  
├── titanic.csv (download from Kaggle)  
└── README.md

Getting started
---------------
Prerequisites
- Python 3.8+
- Install required libraries:
```bash
pip install pandas numpy scikit-learn flask flask-cors joblib
```

Download dataset
- Download `titanic.csv` from Kaggle (Titanic: Machine Learning from Disaster) and place it in the project root.

Train the model (optional)
- Open `titanicmodel.ipynb` in Jupyter Notebook / JupyterLab.
- Run all cells to preprocess, train the model, evaluate it, and save the pipeline to `models/model.pkl`.
- If you already have `models/model.pkl`, you can skip training.

Run the Flask API
- Ensure `models/model.pkl` exists in `models/`.
- Start the Flask server:
```bash
python app.py
```
- The API will be available at: http://localhost:5000

API documentation
-----------------
GET /
- Health check
Response:
```json
{ "message": "Backend is running" }
```

POST /predict
- Predicts whether a passenger survived.
- Request body (JSON):
```json
{
  "features": [Pclass, "Sex", Age, SibSp, Parch, Fare, "Embarked"]
}
```
- Example:
```json
{
  "features": [3, "male", 22.0, 1, 0, 7.25, "S"]
}
```
- Response (example):
```json
{
  "prediction": 0,
  "result": "Did not survive"
}
```
or
```json
{
  "prediction": 1,
  "result": "Survived"
}
```

Example API requests
--------------------
curl:
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [3, "male", 22.0, 1, 0, 7.25, "S"]}'
```

Python (requests):
```python
import requests

data = {"features": [3, "male", 22.0, 1, 0, 7.25, "S"]}
response = requests.post("http://localhost:5000/predict", json=data)
print(response.json())
```

Feature details
---------------
- Pclass: Passenger class (1, 2, or 3)
- Sex: "male" or "female"
- Age: passenger age (float)
- SibSp: number of siblings / spouses aboard (int)
- Parch: number of parents / children aboard (int)
- Fare: ticket fare (float)
- Embarked: port of embarkation — "S", "C", or "Q"

Model details
-------------
- Dataset: Titanic dataset (features: Pclass, Sex, Age, SibSp, Parch, Fare, Embarked)
- Preprocessing:
  - Dropped: PassengerId, Name, Ticket, Cabin
  - Imputation: Age → mean; Embarked → most frequent
  - Encoding: One-hot encoding for Sex and Embarked
  - Scaling: MinMaxScaler for numeric features
- Model: DecisionTreeClassifier inside an sklearn Pipeline
- Saved model: `models/model.pkl`

Potential improvements
----------------------
- Try advanced models (Random Forest, XGBoost) and hyperparameter tuning (GridSearchCV)
- Add feature engineering (e.g., FamilySize = SibSp + Parch, title extraction from Name)
- Improve API input validation and support named-field JSON requests
- Serve with a production server (Gunicorn) and restrict CORS for security
- Add evaluation metrics (precision, recall, F1) and cross-validation

Contributing
------------
Contributions are welcome:
1. Fork the repo
2. Create a branch: git checkout -b feature/your-feature
3. Commit your changes: git commit -m "Add feature"
4. Push and open a pull request


Acknowledgments
---------------
- Kaggle (Titanic dataset)
- scikit-learn
- Flask

Happy predicting — may your models find the survivors! ⚓
