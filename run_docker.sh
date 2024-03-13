#!/usr/bin/env bash
docker image rm -f my-filesystem-portal
docker-compose down -v && docker-compose build --no-cache && docker-compose up -d
