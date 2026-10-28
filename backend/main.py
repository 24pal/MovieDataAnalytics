from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from spark_service import SparkDataService
import uvicorn
import threading

app = FastAPI(title="Movie Analytics Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

spark_service = None
# Use a threading lock to prevent PySpark from running multiple heavy aggregations concurrently,
# which causes local block manager timeouts (Connection reset by peer).
spark_lock = threading.Lock()

@app.on_event("startup")
async def startup_event():
    global spark_service
    print("Initializing Spark Data Service...")
    spark_service = SparkDataService()
    print("Spark Data Service Ready.")

@app.get("/api/kpis")
def get_kpis():
    with spark_lock:
        return spark_service.get_kpis()

@app.get("/api/top_movies")
def get_top_movies():
    with spark_lock:
        return spark_service.get_top_movies()

@app.get("/api/movies_by_genre")
def get_movies_by_genre():
    with spark_lock:
        return spark_service.get_movies_by_genre()

@app.get("/api/rating_distribution")
def get_rating_distribution():
    with spark_lock:
        return spark_service.get_rating_distribution()

@app.get("/api/movies_over_years")
def get_movies_over_years():
    with spark_lock:
        return spark_service.get_movies_over_years()

@app.get("/api/avg_rating_by_genre")
def get_avg_rating_by_genre():
    with spark_lock:
        return spark_service.get_avg_rating_by_genre()

@app.get("/api/search_movies")
def search_movies(q: str):
    with spark_lock:
        return spark_service.search_movies(q)

@app.get("/api/recommendations")
def get_recommendations(movie: str):
    with spark_lock:
        recs = spark_service.get_recommendations(movie)
        if not recs:
            raise HTTPException(status_code=404, detail="Movie not found or no recommendations available.")
        return recs

# ===== NEW ENDPOINTS FOR FULL PAGES =====

@app.get("/api/genres")
def get_genres():
    with spark_lock:
        return spark_service.get_all_genres()

@app.get("/api/movies")
def get_movies(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    genre: str = Query("All"),
    search: str = Query(""),
    sort_by: str = Query("popular")
):
    with spark_lock:
        return spark_service.get_movies_catalog(page=page, limit=limit, genre=genre, search=search, sort_by=sort_by)

@app.get("/api/genre_analytics")
def get_genre_analytics():
    with spark_lock:
        return spark_service.get_genre_analytics()

@app.get("/api/genre_top_movies")
def get_genre_top_movies(genre: str = Query(...), limit: int = Query(6, ge=1, le=20)):
    with spark_lock:
        return spark_service.get_top_movies_by_genre(genre=genre, limit=limit)

@app.get("/api/rating_analytics")
def get_rating_analytics():
    with spark_lock:
        return spark_service.get_detailed_rating_analytics()

@app.get("/api/user_analytics")
def get_user_analytics():
    with spark_lock:
        return spark_service.get_user_analytics()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
