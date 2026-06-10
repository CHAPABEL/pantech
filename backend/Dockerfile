FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/entrypoint.sh

ARG FASTAPI_PORT=8080
ENV FASTAPI_PORT=${FASTAPI_PORT}
ARG FASTAPI_HOST=0.0.0.0
ENV FASTAPI_HOST=${FASTAPI_HOST}

EXPOSE ${FASTAPI_PORT}

CMD ["/app/entrypoint.sh"]
