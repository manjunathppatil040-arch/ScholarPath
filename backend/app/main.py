from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import get_settings
from app.database.base import Base
from app.database.session import engine
from app import models  # noqa: F401 - registers SQLAlchemy models with Base.metadata


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Phase 1 local bootstrap only. Production schema changes will use Alembic migrations.
    if get_settings().app_env == "development":
        Base.metadata.create_all(bind=engine)
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="ScholarPath API", version="0.1.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["GET"],
        allow_headers=["Content-Type"],
    )
    app.include_router(router)
    return app


app = create_app()
