from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.email_router import router as email_router
from config import settings


app = FastAPI()

origins = [
    "http://localhost:3000",  
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origin,
    allow_credentials=True,
    allow_methods=["*"],     
    allow_headers=["*"],   
)

app.include_router(email_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)