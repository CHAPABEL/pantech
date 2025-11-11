
FROM python:3.12-slim

WORKDIR /app


COPY requirements.txt .


RUN pip install --no-cache-dir -r requirements.txt

COPY . .


ARG FASTAPI_PORT=8000
ENV FASTAPI_PORT=${FASTAPI_PORT}

ARG FASTAPI_HOST=0.0.0.0
ENV FASTAPI_HOST=${FASTAPI_HOST}

CMD ["sh", "-c", "uvicorn main:app --host ${FASTAPI_HOST} --port ${FASTAPI_PORT} --reload"]