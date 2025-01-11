#!/bin/bash

composer="docker-compose.yaml"
# read -p "enter the name of ollama image:" ollama
# read -p "enter the name of ollama image:" flask
# read -p "enter the name of ollama image:" react
# read -p "enter the Ollama port number example 11436:" ollama_port
# read -p "enter the Flask port number example 5000:" flask_port
# read -p "enter the React port number example 3000:" react_port

ollama="ollama"
flask="flask"
react="react"
ollama_port=11438
flask_port=5050
react_port=3000

mkdir app
cd app
mkdir $ollama $flask $react

git clone https://github.com/mokmail/mollama download

mv download/mollama/* $ollama
mv download/backend/* $flask
mv download/frontend/* $react
rm -r -f download

cat <<EOL > $composer 
version: '3.9'
services:
  $ollama:
    build:
      context: ./$ollama
      dockerfile: Dockerfile
    environment:
      - OLLAMA_HOST=http://0.0.0.0:$ollama_port
    network_mode: "host"
    container_name: $ollama
    volumes:
      - $ollama:/app
  $flask:
    build:
      context: ./$flask
      dockerfile: Dockerfile
    network_mode: "host"
    command: python3 app.py
    container_name: $flask
    volumes:
      - $flask:/app
    depends_on:
      - $ollama
    command: python3 app.py

  $react:
    build:    
      context: ./$react
      dockerfile: Dockerfile
    network_mode: "host"

    volumes:
      - $react:/app

    container_name: $react
    depends_on:
      - $flask
      - $ollama
        
        
volumes:
  $ollama:
  $flask:
  $react:
    
EOL



##-- HIER BEGINNT OLLAMA
# creaeting dockerfile for ollama
cat <<EOL >"$ollama/Dockerfile"
FROM ollama/ollama:latest
WORKDIR /app
COPY . /app
ENV OLLAMA_HOST="http://0.0.0.0:$ollama_port"
EXPOSE $ollama_port
EOL


##-- HIER BEGINNT FLASK 
# creaeting dockerfile for flask 
cat <<EOL >"$flask/Dockerfile"
FROM python:latest
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y vim
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE $flask_port
EOL



##-- HIER BEGINNT REACT
# creaeting dockerfile for react
cat <<EOL >"$react/Dockerfile"
FROM node:16-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
EXPOSE $react_port
CMD ["npm", "start"]
EOL

cat <<EOL > "$react/.dockerignore"
node_modules
.env
EOL

docker-compose up --build  -d

docker exec -it  $ollama ollama run llama3.2 -d


URL="http://localhost:$react_port" -d

# Open the URL in the default browser
xdg-open "$URL"

## -- END --

