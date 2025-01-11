FROM python:latest
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y vim
RUN pip install --upgrade pip &&     pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5050
