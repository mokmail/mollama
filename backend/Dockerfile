# Use the latest Python image as the base
FROM python:latest

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .
RUN apt-get update && apt-get install -y vim



# Install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the application code to the container
COPY . .

# Expose the application port
EXPOSE 5000

# Define the command to run the application
# CMD ["python", "app.py"]
