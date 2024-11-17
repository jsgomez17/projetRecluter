import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SNOWFLAKE_USER: str
    SNOWFLAKE_PASSWORD: str
    SNOWFLAKE_ACCOUNT: str
    SNOWFLAKE_DATABASE: str
    SNOWFLAKE_SCHEMA: str
    SNOWFLAKE_WAREHOUSE: str

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), ".env")  # Cambiar la ruta al .env

settings = Settings()
print(settings.dict())
