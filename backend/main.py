from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.email_router import router as email_router
from config import settings


app = FastAPI()

origins = [
    "http://localhost",      # для доступа через nginx (порт 80)
    "http://localhost:80",   # для доступа через nginx (порт 80)
    "http://localhost:8080", # для прямого доступа к бэкенду (если порт проброшен)
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],     
    allow_headers=["*"],   
)

app.include_router(email_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
