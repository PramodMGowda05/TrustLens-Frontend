-- This file contains the SQL schema for the TrustLens application.
-- You should run this in your local MySQL client to set up the database.

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS trustlens_db;

-- Use the created database
USE trustlens_db;

-- Table for storing user information
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing review analysis data
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  review_text TEXT NOT NULL,
  product_or_service VARCHAR(255),
  platform VARCHAR(255),
  language VARCHAR(50),
  trust_score DECIMAL(5, 4) NOT NULL,
  predicted_label VARCHAR(50) NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table for storing user feedback on predictions
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  review_id INT NOT NULL,
  user_id INT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  feedback_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for admin moderation actions
CREATE TABLE IF NOT EXISTS moderation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  review_id INT NOT NULL,
  moderator_id INT NOT NULL,
  action ENUM('approved', 'rejected') NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (moderator_id) REFERENCES users(id) ON DELETE CASCADE
);
