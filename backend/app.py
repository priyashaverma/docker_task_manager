from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Text # type: ignore
from sqlalchemy.orm import sessionmaker, declarative_base # type: ignore
from pgvector.sqlalchemy import Vector # type: ignore
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
load_dotenv()
import os

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
Base = declarative_base()
model = SentenceTransformer('all-MiniLM-L6-v2')

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(Text)
    status = Column(String)
    embedding = Column(Vector(384))

Base.metadata.create_all(engine)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    session = Session()
    tasks = session.query(Task).all()
    return jsonify([{
        'id': t.id, 'title': t.title,
        'description': t.description, 'status': t.status
    } for t in tasks])

@app.route('/api/tasks', methods=['POST'])
def add_task():
    session = Session()
    data = request.json
    embedding = model.encode(data['description']).tolist()
    task = Task(title=data['title'], description=data['description'], status=data['status'], embedding=embedding)
    session.add(task)
    session.commit()
    return jsonify({'message': 'Task added'})

@app.route('/api/search', methods=['POST'])
def search_tasks():
    session = Session()
    query = request.json['query']
    query_embedding = model.encode(query).tolist()
    results = session.execute(
        f"SELECT id, title, description, status FROM tasks ORDER BY embedding <-> :query LIMIT 3",
        {'query': query_embedding}
    ).fetchall()
    return jsonify([dict(row) for row in results])

if __name__ == '__main__':
    app.run(host='0.0.0.0')
