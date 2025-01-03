# # Use the existing image as the base
# FROM ollama/ollama

# # Set environment variables for LLaMA2
# #ENV OLLAMA_MODEL=llama2
# ENV OLLAMA_HOST=http://0.0.0.0:11438

# # Expose the new port
# ENV MODEL_NAME llama3


# EXPOSE 11438
# RUN [ "ollama",  "serve" ]
# # Optional: Add custom commands to preload or set up the LLaMA2 model
# # Uncomment the following line if you need to preload the model
# # RUN ollama model install llama2

# # Entry point to start the service

# Use the Ollama base image
FROM ollama/ollama:latest

# Set a working directory
WORKDIR /app

# Copy your application files into the container
COPY . /app
ENV OLLAMA_HOST=http://0.0.0.0:11438

#ENTRYPOINT [ "ollama" ]
# Install additional dependencies if needed
# RUN apt-get update && apt-get install -y some-dependency
# COPY start.sh ./app/start.sh
# RUN chmod +x ./app/start.sh
# Expose any necessary ports
EXPOSE 11438
# RUN [ "ollama",  "run" , "llama3" ]
# CMD ["bash", "start.sh"] 



# Specify the command to run your application
# CMD ["ollama", "run", "--config", "config.yaml"]
