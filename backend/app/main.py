from fastapi import FastAPI
from .database import engine
from . import models
from .auth import router as auth_router  # IMPORTANT

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router, prefix="/auth")  # IMPORTANT

@app.get("/")
def root():
    return {"message": "Localii backend restarted cleanly 🚀"}
