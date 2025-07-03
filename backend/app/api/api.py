from fastapi import APIRouter
from app.api.routes import presentation

api_router = APIRouter()

api_router.include_router(
    presentation.router, 
    prefix="/presentation", 
    tags=["presentation"]
)
