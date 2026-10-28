# Movie Data Analytics

A full-stack movie data analytics platform powered by **PySpark**, **FastAPI**, and a **React + TypeScript + Vite** dashboard, analyzing the MovieLens 25M dataset.

## Architecture

- **PySpark Data Engine**: Distributed big data processing and ALS collaborative filtering recommendation algorithms on 25M+ movie ratings.
- **FastAPI Backend**: High-performance REST API serving aggregate analytics, genre breakdowns, rating distributions, and recommendation predictions.
- **Frontend Dashboard**: Interactive data visualizations with React, TypeScript, Tailwind CSS, and Recharts.
- **Jupyter / Colab Notebook**: `Simple_Movie_Analysis_25M_PySpark_Colab.ipynb` for standalone exploratory data analysis.

## Project Structure

```
MovieDataAnnalytics/
├── Simple_Movie_Analysis_25M_PySpark_Colab.ipynb # PySpark Analysis Notebook
├── backend/                                      # FastAPI & PySpark Service
│   ├── main.py                                   # API routes and server
│   ├── spark_service.py                          # Spark session & queries
│   ├── requirements.txt                          # Python dependencies
│   └── data/                                     # MovieLens dataset folder
├── movie-analytics-dashboard/                    # React + Vite Dashboard
│   ├── src/                                      # UI components & pages
│   ├── package.json
│   └── vite.config.ts
├── package.json                                  # Root scripts (concurrent runner)
└── README.md
```

## Getting Started

### 1. Dataset Setup
Download the [MovieLens 25M dataset](https://grouplens.org/datasets/movielens/25m/) and extract it into `backend/data/ml-25m/` so that `movies.csv` and `ratings.csv` are present.

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py
```

### 3. Frontend Setup
```bash
cd movie-analytics-dashboard
npm install
npm run dev
```

### 4. Running Concurrently (Root)
From the root directory:
```bash
npm install
npm run dev
```
