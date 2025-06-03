# Backend Dockerfile for Django
FROM python:3.11-slim
WORKDIR /app
COPY shipment_project/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY shipment_project/ /app/
ENV DJANGO_SETTINGS_MODULE=shipment_project.settings
ENV PYTHONUNBUFFERED=1
CMD ["gunicorn", "shipment_project.wsgi:application", "--bind", "0.0.0.0:8000"]