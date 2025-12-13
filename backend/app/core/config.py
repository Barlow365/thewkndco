from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = Field(
        default="postgresql+psycopg2://postgres:postgres@localhost:5432/partywknd",
        env="DATABASE_URL",
    )
    api_prefix: str = Field(default="/api", env="API_PREFIX")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
