#!/usr/bin/env bash
docker-compose down -v && docker-compose build --no-cache && docker-compose up -d