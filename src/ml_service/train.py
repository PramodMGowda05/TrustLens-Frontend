import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
import torch
import joblib

# Custom Dataset class for BERT
class ReviewDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

def train_xgboost():
    print("Training XGBoost model...")
    df = pd.read_csv('src/ml_service/dataset.csv')

    # Label encode the target variable
    df['label_encoded'] = df['label'].apply(lambda x: 1 if x == 'genuine' else 0)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(df['text'], df['label_encoded'], test_size=0.2, random_state=42)

    # Vectorize text data
    vectorizer = TfidfVectorizer(max_features=5000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # Train XGBoost model
    model = xgb.XGBClassifier(objective='binary:logistic', eval_metric='logloss', use_label_encoder=False)
    model.fit(X_train_tfidf, y_train)

    # Evaluate
    preds = model.predict(X_test_tfidf)
    print("XGBoost Accuracy:", accuracy_score(y_test, preds))
    print(classification_report(y_test, preds))

    # Save the model and vectorizer
    joblib.dump(model, 'src/ml_service/xgboost_model.pkl')
    joblib.dump(vectorizer, 'src/ml_service/tfidf_vectorizer.pkl')
    print("XGBoost model and vectorizer saved.")

def train_bert():
    print("\nTraining BERT model...")
    df = pd.read_csv('src/ml_service/dataset.csv')
    
    # Pre-trained model
    model_name = 'bert-base-multilingual-cased'
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = BertForSequenceClassification.from_pretrained(model_name, num_labels=2)
    
    # Label encode and split
    df['label_encoded'] = df['label'].apply(lambda x: 1 if x == 'genuine' else 0)
    train_texts, val_texts, train_labels, val_labels = train_test_split(df['text'].tolist(), df['label_encoded'].tolist(), test_size=0.2, random_state=42)

    # Tokenize
    train_encodings = tokenizer(train_texts, truncation=True, padding=True, max_length=128)
    val_encodings = tokenizer(val_texts, truncation=True, padding=True, max_length=128)

    train_dataset = ReviewDataset(train_encodings, train_labels)
    val_dataset = ReviewDataset(val_encodings, val_labels)

    # Training arguments
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=1, # Use more epochs for a real dataset
        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,
        warmup_steps=10,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=10,
        evaluation_strategy="epoch"
    )

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset
    )

    # Train
    trainer.train()
    
    # Save model
    model.save_pretrained('src/ml_service/bert_model')
    tokenizer.save_pretrained('src/ml_service/bert_model')
    print("BERT model and tokenizer saved.")

if __name__ == '__main__':
    train_xgboost()
    train_bert()
