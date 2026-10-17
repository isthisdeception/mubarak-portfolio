
# Use Python 3.11 to match the existing project's Python environment
FROM python:3.11-slim

# Keep Python output visible in Docker logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies first for better layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy Django application code
COPY . .

EXPOSE 8000

# Run Django using Gunicorn, not the development server
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
