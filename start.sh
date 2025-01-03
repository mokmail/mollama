
docker-compose down
# docker system prune -a -f
docker-compose up --build -d
docker exec -it  mollama ollama run llama3.2

