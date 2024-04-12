#!/usr/bin/env bash
docker-compose down -v
docker image rm -f my-filesystem-portal
docker-compose build --no-cache && docker-compose up -d
