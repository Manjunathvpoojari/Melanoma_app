# 🩺 Melanoma Detection Application

## 📌 Project Overview
This project is a **collaborative final-year capstone project** focused on the **early detection of melanoma** using deep learning–based image classification techniques.  
Multiple convolutional neural network (CNN) models were trained and evaluated on **combined dermoscopic image datasets**, then deployed as both **web and mobile applications** to ensure real-world accessibility.

---

## 📊 Datasets Used
To improve model robustness and generalization, two well-established dermoscopic datasets were combined:

- **ISIC Dataset** (International Skin Imaging Collaboration)
- **HAM10000 Dataset** (Human Against Machine with 10,000 training images)

The datasets were preprocessed, balanced, and augmented prior to training.

---

## 🧠 Deep Learning Models
The project leverages **transfer learning** using the following architectures:

- **EfficientNet** – High accuracy with optimized parameter efficiency  
- **MobileNet** – Lightweight and suitable for mobile deployment  
- **ResNet** – Deep residual learning for robust feature extraction  

Each model was fine-tuned and evaluated to identify the best-performing architecture.

---

## ⚙️ Model Training Pipeline
- Image resizing and normalization  
- Data augmentation (rotation, flipping, zooming)  
- Binary classification (Melanoma vs. Benign)  
- Loss Function: Binary Cross-Entropy  
- Optimizer: Adam  
- Evaluation Metrics: Accuracy, Precision, Recall, F1-Score  

---

## 🌐 Deployment Architecture

### Web Deployment
- Models deployed using **Streamlit**
- Interactive web interface for image upload and prediction
- Hosted on **Streamlit Cloud**

### Mobile Application
- Web application extended into a **cross-platform mobile application**
- Compatible with **Android and iOS**
- Supports real-time image upload and melanoma prediction

---

## 🖥️ Application Features
- Upload dermoscopic skin images  
- Real-time melanoma prediction  
- Model confidence score display  
- Responsive interface for web and mobile platforms  

---

## 🛠️ Technologies Used
- Python  
- TensorFlow / Keras  
- Streamlit  
- Deep Learning (CNN, Transfer Learning)  
- Cloud Deployment  
- Cross-Platform App Development  

---

## 🎯 Objective
To develop an **accurate, accessible, and scalable melanoma detection system** that assists in **early diagnosis** and increases awareness through AI-powered medical imaging.

---

## 🚀 Future Enhancements
- Multi-class skin lesion classification  
- Explainable AI using Grad-CAM visualizations  
- On-device inference optimization  
- Clinical validation with dermatologist feedback  

---

## 👥 Team Contribution
This project was developed as a **collaborative effort**, with responsibilities distributed across:
- Dataset preprocessing and augmentation  
- Model training and evaluation  
- Web deployment using Streamlit  
- Cross-platform mobile application development  

---

## 📌 Conclusion
The Melanoma Detection Application demonstrates the effective use of **deep learning and transfer learning** in medical image analysis, providing a practical and scalable solution for early melanoma detection across web and mobile platforms.
