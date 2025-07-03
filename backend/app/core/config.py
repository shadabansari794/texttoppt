from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "TextToPPT API"
    
    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEFAULT_MODEL: str = "gpt-3.5-turbo"
    TEMPERATURE: float = 0.7
    MAX_TOKENS: int = 2000
    
    # CORS settings
    CORS_ORIGINS: list = ["*"]
    
    # Define environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "dev")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
