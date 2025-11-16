from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "WraithNet Core API is running"}
