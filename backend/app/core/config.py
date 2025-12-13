from typing import List

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = Field(
        default="postgresql+psycopg2://postgres:postgres@localhost:5432/partywknd",
        env="DATABASE_URL",
    )
    api_prefix: str = Field(default="/api", env="API_PREFIX")

    # Supabase / Auth
    supabase_url: str | None = Field(default=None, env="SUPABASE_URL")
    supabase_anon_key: str | None = Field(default=None, env="SUPABASE_ANON_KEY")
    supabase_jwt_secret: str | None = Field(default=None, env="SUPABASE_JWT_SECRET")
    supabase_jwks_url: str | None = Field(default=None, env="SUPABASE_JWKS_URL")
    allow_no_auth: bool = Field(default=False, env="ALLOW_NO_AUTH")

    # Stripe
    stripe_secret_key: str | None = Field(default=None, env="STRIPE_SECRET_KEY")

    # CORS
    cors_allow_origins: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001",
        env="CORS_ALLOW_ORIGINS",
    )

    @computed_field
    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.cors_allow_origins.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
