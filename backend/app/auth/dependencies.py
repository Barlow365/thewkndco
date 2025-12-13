from typing import Optional

from fastapi import Depends, Header, HTTPException, status

from app.auth.supabase_jwt import AuthError, decode_supabase_jwt, extract_user_ctx
from app.core.config import settings


def get_authorization_token(authorization: Optional[str] = Header(default=None)) -> str:
    if not authorization:
        raise AuthError("Missing Authorization header")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise AuthError("Invalid authorization scheme")
    return token


async def get_current_user(
    token: str = Depends(get_authorization_token),
) -> dict:
    # Allow opt-out for local dev only
    if settings.allow_no_auth and not settings.supabase_jwt_secret:
        return {"id": "dev-user", "email": None, "role": "admin"}
    claims = decode_supabase_jwt(token)
    return extract_user_ctx(claims)


def require_role(role: str):
    def checker(user=Depends(get_current_user)):
        if settings.allow_no_auth:
            return user
        if user.get("role") == role:
            return user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"{role.capitalize()} role missing in JWT; add a custom claim like {{'role': '{role}'}}",
        )

    return checker
