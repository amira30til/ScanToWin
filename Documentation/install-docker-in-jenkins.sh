#!/bin/bash

# Install Docker CLI in Jenkins Container

echo "Installing Docker CLI in Jenkins container..."

docker exec -u root jenkins bash -c "
    apt-get update && \
    apt-get install -y docker.io && \
    docker --version
"

echo ""
echo "Testing Docker..."
docker exec jenkins docker ps

echo ""
echo "✅ Docker CLI installed successfully!"
echo "Now you can run your Jenkins pipeline again."
