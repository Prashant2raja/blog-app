import os
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, desc
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel

# ⚠️ Replace this with your actual Neon connection string
# Neon requires 'postgresql://' or 'postgresql+psycopg2://'
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_T8xBzZKWyC4u@ep-super-poetry-av89v0un-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Model
class BlogPost(Base):
    __tablename__ = "blog_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables in Neon automatically
Base.metadata.create_all(bind=engine)

# Pydantic Schemas for validation
class BlogBase(BaseModel):
    title: str
    content: str

class BlogResponse(BlogBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

app = FastAPI(title="Simple CRUD Blog API")

# Enable CORS for React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---

@app.post("/api/blogs", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
def create_blog(blog: BlogBase, db: Session = Depends(get_db)):
    db_blog = BlogPost(title=blog.title, content=blog.content)
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

@app.get("/api/blogs")
def get_blogs(skip: int = 0, limit: int = 4, db: Session = Depends(get_db)):
    # Sorting date-wise descending (newest first)
    blogs = db.query(BlogPost).order_by(desc(BlogPost.created_at)).offset(skip).limit(limit).all()
    total = db.query(BlogPost).count()
    return {"total": total, "blogs": blogs}

@app.put("/api/blogs/{blog_id}", response_model=BlogResponse)
def update_blog(blog_id: int, blog: BlogBase, db: Session = Depends(get_db)):
    db_blog = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog entry not found")
    
    db_blog.title = blog.title
    db_blog.content = blog.content
    db.commit()
    db.refresh(db_blog)
    return db_blog

@app.delete("/api/blogs/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(blog_id: int, db: Session = Depends(get_db)):
    db_blog = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog entry not found")
    
    db.delete(db_blog)
    db.commit()
    return None