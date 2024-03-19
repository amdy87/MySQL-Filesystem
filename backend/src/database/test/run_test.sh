#!/bin/bash

docker compose down -v
docker image rm -f my-filesystem-portal
docker compose build --no-cache && docker compose up -d

# # Run tests inside the container
# docker exec db-test npm test

# Stop and remove the Docker container
# docker stop db-test
# docker rm db-test
