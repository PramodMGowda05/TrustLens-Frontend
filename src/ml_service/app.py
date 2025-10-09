from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import shap

app = Flask(__name__)

# Load models and vectorizer
# In a production environment, load these once at startup
try:
    xgb_model = joblib.load('src/ml_service/xgboost_model.pkl')
    vectorizer = joblib.load('src/ml_service/tfidf_vectorizer.pkl')
    bert_tokenizer = BertTokenizer.from_pretrained('src/ml_service/bert_model')
    bert_model = BertForSequenceClassification.from_pretrained('src/ml_service/bert_model')
    bert_model.eval() # Set model to evaluation mode
except FileNotFoundError:
    print("Models not found. Please run train.py first.")
    xgb_model = None
    vectorizer = None
    bert_tokenizer = None
    bert_model = None

@app.route('/predict', methods=['POST'])
def predict():
    if not request.json or 'text' not in request.json:
        return jsonify({'error': 'Request must be JSON and contain a "text" field.'}), 400

    if not all([xgb_model, vectorizer, bert_model, bert_tokenizer]):
         return jsonify({'error': 'Models are not loaded. Run training script.'}), 500

    review_text = request.json['text']

    # --- XGBoost Prediction ---
    text_vectorized = vectorizer.transform([review_text])
    xgb_prediction_proba = xgb_model.predict_proba(text_vectorized)[0]
    xgb_trust_score = float(xgb_prediction_proba[1]) # Probability of being 'genuine'
    xgb_label = 'genuine' if xgb_trust_score > 0.5 else 'fake'

    # --- BERT Prediction ---
    inputs = bert_tokenizer(review_text, return_tensors='pt', truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = bert_model(**inputs)
        logits = outputs.logits
    
    bert_probs = torch.nn.functional.softmax(logits, dim=-1)[0]
    bert_trust_score = float(bert_probs[1]) # Probability of being 'genuine'
    bert_label = 'genuine' if bert_trust_score > 0.5 else 'fake'

    # --- Ensemble/Final Decision ---
    # Simple averaging, but could be more complex
    final_trust_score = (xgb_trust_score + bert_trust_score) / 2
    final_label = 'genuine' if final_trust_score > 0.5 else 'fake'

    return jsonify({
        'predicted_label': final_label,
        'trust_score': final_trust_score,
        'model_outputs': {
            'xgboost': {'label': xgb_label, 'score': xgb_trust_score},
            'bert': {'label': bert_label, 'score': bert_trust_score}
        }
    })

@app.route('/explain', methods=['POST'])
def explain():
    if not request.json or 'text' not in request.json:
        return jsonify({'error': 'Request must be JSON and contain a "text" field.'}), 400
    
    if not all([xgb_model, vectorizer]):
        return jsonify({'error': 'XGBoost model not loaded.'}), 500

    review_text = request.json['text']
    
    # SHAP explanation for XGBoost
    # Note: SHAP with BERT is more complex and not shown here for brevity
    explainer = shap.TreeExplainer(xgb_model)
    text_vectorized = vectorizer.transform([review_text])
    
    # Convert to DataFrame for SHAP
    df = pd.DataFrame(text_vectorized.toarray(), columns=vectorizer.get_feature_names_out())

    shap_values = explainer.shap_values(df)

    # Get feature importance
    feature_names = vectorizer.get_feature_names_out()
    shap_values_flat = shap_values[0]

    # Map shap values to feature names and get top 5 positive and negative contributors
    feature_importances = {name: val for name, val in zip(feature_names, shap_values_flat) if val != 0}
    
    # Words contributing to 'genuine' prediction (positive SHAP value)
    positive_contributors = sorted(feature_importances.items(), key=lambda item: item[1], reverse=True)[:5]

    # Words contributing to 'fake' prediction (negative SHAP value)
    negative_contributors = sorted(feature_importances.items(), key=lambda item: item[1])[:5]

    return jsonify({
        'explanation': 'Feature importance based on SHAP values from the XGBoost model.',
        'positive_contributors (towards genuine)': dict(positive_contributors),
        'negative_contributors (towards fake)': dict(negative_contributors)
    })

if __name__ == '__main__':
    # For local development. For production, use a WSGI server like Gunicorn.
    app.run(port=5001, debug=True)
