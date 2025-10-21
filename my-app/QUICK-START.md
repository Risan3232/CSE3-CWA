# 🚀 Quick Start Guide - Docker Commands

## Start Here

### First Time Setup
```bash
# 1. Build the Docker image
docker build -t court-room-app .

# 2. Run the container
docker run -d -p 3000:3000 --name court-room-container court-room-app

# 3. Open in browser
open http://localhost:3000/court-room
```

---

## Daily Commands

### Start Your Work Session
```bash
# Check if container exists
docker ps -a

# If stopped, start it
docker start court-room-container

# View logs
docker logs -f court-room-container
```

### End Your Work Session
```bash
# Stop container (keeps data in memory until restart)
docker stop court-room-container
```

---

## Testing API Endpoints

### Quick Test All CRUD Operations
```bash
# POST - Create session
curl -X POST http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -d '{"timer":30,"messages":["Test"],"stage":1}'

# GET - List all sessions
curl http://localhost:3000/api/game

# PUT - Update (replace ID with one from GET)
curl -X PUT http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -d '{"id":YOUR_ID_HERE,"stage":2}'

# DELETE - Remove (replace ID)
curl -X DELETE http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -d '{"id":YOUR_ID_HERE}'
```

---

## Common Issues

### Port 3000 Already in Use
```bash
# Option 1: Stop local dev server
# Press Ctrl+C in terminal running `npm run dev`

# Option 2: Use different port
docker run -d -p 3001:3000 --name court-room-container court-room-app
# Access at http://localhost:3001
```

### Container Name Already Exists
```bash
# Remove old container
docker rm -f court-room-container

# Then run again
docker run -d -p 3000:3000 --name court-room-container court-room-app
```

### Need to Rebuild After Code Changes
```bash
# Stop and remove container
docker stop court-room-container
docker rm court-room-container

# Rebuild image
docker build -t court-room-app .

# Run new container
docker run -d -p 3000:3000 --name court-room-container court-room-app
```

---

## Cleanup

### Remove Everything and Start Fresh
```bash
# Stop and remove container
docker stop court-room-container
docker rm court-room-container

# Remove image
docker rmi court-room-app

# Clean up unused resources
docker system prune
```

---

## Access Points

| Resource | URL |
|----------|-----|
| Home Page | http://localhost:3000 |
| Court Room | http://localhost:3000/court-room |
| API Endpoint | http://localhost:3000/api/game |

---

## Status Check

```bash
# Is container running?
docker ps

# View logs (last 50 lines)
docker logs --tail 50 court-room-container

# Follow logs in real-time
docker logs -f court-room-container

# Execute shell inside container
docker exec -it court-room-container sh
```

---

**For detailed documentation, see `DOCKER-GUIDE.md`**
