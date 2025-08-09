#!/bin/bash
set -e
cd "$(dirname "$0")"
PYTHON_BIN=python3

if [ ! -d "venv" ]; then
    echo "🔹 Creating virtual environment..."
    $PYTHON_BIN -m venv venv
    source venv/bin/activate
    echo "🔹 Installing dependencies..."
    pip install --upgrade pip --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host=files.pythonhosted.org fastapi uvicorn
    pip freeze > requirements.txt
else
    echo "✅ venv exists, activating..."
    source venv/bin/activate
fi

echo "🚀 Starting FastAPI app..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
