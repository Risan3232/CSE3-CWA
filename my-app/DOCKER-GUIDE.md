# Docker Setup and API Testing Guide

## 🐳 Docker Setup - Week 6

This guide covers the Docker implementation for the Court Room Challenge application, including API integration and testing procedures.

---

## 📋 Prerequisites

- **Docker Desktop** installed and running
- Node.js application tested locally with `npm run dev`
- All Week 5 API routes implemented and functional

---

## 🏗️ Docker Files Created

### 1. **Dockerfile** (Multi-Stage Build)

Located at: `/my-app/Dockerfile`

**Key Features:**
- ✅ Node.js 20 Alpine (lightweight base image ~200-500MB)
- ✅ Multi-stage build (builder + runner stages)
- ✅ Security: Runs as non-root user (`nextjs`)
- ✅ Includes public assets (court images, icons)
- ✅ Production-optimized build

**Stages:**
1. **Base**: Sets up Node.js 20 Alpine environment
2. **Builder**: Installs dependencies and builds the Next.js app
3. **Runner**: Creates production-ready image with minimal footprint

### 2. **.dockerignore**

Located at: `/my-app/.dockerignore`

**Purpose:** Excludes unnecessary files from the Docker build context for faster builds.

**Excluded:**
- `node_modules` (reinstalled in container)
- `.next`, `.git`, cache files
- Documentation files (*.md)
- Environment files (.env)

---

## 🚀 Build and Run Instructions

### Step 1: Build the Docker Image

```bash
cd /Users/risan-xtha/Downloads/CSE3-CWA/my-app
docker build -t court-room-app .
```

**Expected Output:**
- Build process takes 1-5 minutes
- Look for "Successfully built" and "exporting to image" messages
- Final image size: ~200-500MB

**Verify Build:**
```bash
docker images
```
You should see `court-room-app` listed.

---

### Step 2: Run the Docker Container

**Option A: Foreground Mode (for debugging)**
```bash
docker run -p 3000:3000 court-room-app
```
Press `Ctrl+C` to stop.

**Option B: Detached Mode (background)**
```bash
docker run -d -p 3000:3000 --name court-room-container court-room-app
```

**Flags Explained:**
- `-d`: Detached mode (runs in background)
- `-p 3000:3000`: Maps container port 3000 to host port 3000
- `--name court-room-container`: Assigns a name to the container

**Verify Container is Running:**
```bash
docker ps
```

**Check Logs:**
```bash
docker logs court-room-container
```

Expected output:
```
▲ Next.js 15.5.2
- Local:        http://localhost:3000
✓ Ready in 166ms
```

---

## 🧪 API Testing in Docker

### Test Environment
- Container running at: `http://localhost:3000`
- API endpoint: `http://localhost:3000/api/game`

### 1. POST - Create New Session

**Command:**
```bash
curl -X POST http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -d '{
    "timer": 30,
    "messages": ["From boss: Done with sprint?"],
    "stage": 1,
    "output": "<p>Debugged code</p>"
  }'
```

**Expected Response:**
```json
{
  "id": 1761012725764,
  "timer": 30,
  "messages": ["From boss: Done with sprint?"],
  "stage": 1,
  "output": "<p>Debugged code</p>",
  "createdAt": "2025-10-21T02:12:05.764Z"
}
```

---

### 2. GET - Retrieve All Sessions

**Command:**
```bash
curl http://localhost:3000/api/game
```

**Expected Response:**
```json
[
  {
    "id": 1761012725764,
    "timer": 30,
    "messages": ["From boss: Done with sprint?"],
    "stage": 1,
    "output": "<p>Debugged code</p>",
    "createdAt": "2025-10-21T02:12:05.764Z"
  }
]
```

---

### 3. PUT - Update Existing Session

**Command:**
```bash
curl -X PUT http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1761012725764,
    "stage": 2,
    "messages": ["From boss: Done with sprint?", "Family interruption!"]
  }'
```

**Expected Response:**
```json
{
  "id": 1761012725764,
  "timer": 30,
  "messages": ["From boss: Done with sprint?", "Family interruption!"],
  "stage": 2,
  "output": "<p>Debugged code</p>",
  "createdAt": "2025-10-21T02:12:05.764Z"
}
```

---

### 4. DELETE - Remove Session

**Command:**
```bash
curl -X DELETE http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -d '{"id": 1761012725764}'
```

**Expected Response:**
```json
{"message": "Session deleted"}
```

**Verify Deletion:**
```bash
curl http://localhost:3000/api/game
# Should return: []
```

---

## 🌐 Browser Testing

### Access the Court Room App
Open in browser: `http://localhost:3000/court-room`

### Test Features:
1. ✅ **Timer**: Set timer, start/stop/reset
2. ✅ **Messages**: Trigger escalating messages (boss → family → agile → court)
3. ✅ **Code Editor**: Write and submit code
4. ✅ **Save Session**: Click "💾 Save Session" button
5. ✅ **Load/Delete**: View saved sessions, load or delete them

### Verify API Integration:
- Open browser DevTools (F12) → Network tab
- Click "Save Session"
- Look for POST request to `/api/game` with status 200
- Saved sessions should appear in the list

---

## 🛠️ Docker Management Commands

### View Running Containers
```bash
docker ps
```

### View All Containers (including stopped)
```bash
docker ps -a
```

### Stop Container
```bash
docker stop court-room-container
```

### Start Stopped Container
```bash
docker start court-room-container
```

### Remove Container
```bash
docker rm court-room-container
# Or force remove if running:
docker rm -f court-room-container
```

### View Logs
```bash
# Real-time logs
docker logs -f court-room-container

# Last 50 lines
docker logs --tail 50 court-room-container
```

### Execute Command Inside Container
```bash
docker exec -it court-room-container sh
```

### Remove Image
```bash
docker rmi court-room-app
```

### Clean Up Everything (Use with caution!)
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused resources
docker system prune -a
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use
**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution:**
```bash
# Stop local dev server (npm run dev)
# OR use a different port:
docker run -d -p 3001:3000 --name court-room-container court-room-app
# Access at http://localhost:3001
```

### Issue: Container Won't Start
**Check logs:**
```bash
docker logs court-room-container
```

**Common causes:**
- Build errors (rebuild with `docker build`)
- Port conflicts
- Missing dependencies

### Issue: API Returns 500 Errors
**Check:**
1. Container logs for errors
2. API route code for bugs
3. Request format (JSON headers, body structure)

### Issue: Cannot Access Container
**Verify container is running:**
```bash
docker ps
```

**Verify port mapping:**
```bash
docker port court-room-container
```

---

## 📊 Performance Optimization

### Image Size
- Current: ~200-500MB
- If too large, check for bloated `node_modules`

### Build Speed
- Use `.dockerignore` to exclude unnecessary files
- Cache layers by ordering Dockerfile commands properly
- Use `docker build --no-cache` if caching issues occur

### Runtime Performance
- Container uses minimal resources (~50-100MB RAM)
- Next.js production mode is optimized for performance

---

## 🔐 Security Best Practices

✅ **Implemented:**
- Non-root user (`nextjs`) runs the application
- Alpine Linux base image (minimal attack surface)
- Production dependencies only in final image
- No sensitive data in environment variables (yet)

⚠️ **For Production (Week 7+):**
- Add `.env` file for secrets (database, API keys)
- Use Docker secrets or volumes for sensitive data
- Implement HTTPS/TLS
- Regular security updates

---

## 📝 Week 7 Notes: Database Integration

**Current:** In-memory storage (data resets on container restart)

**Next Steps:**
1. Add Prisma ORM
2. Connect to PostgreSQL/MySQL database
3. Use Docker volumes for data persistence:
   ```bash
   docker run -d -p 3000:3000 \
     -v $(pwd)/data:/app/data \
     --name court-room-container court-room-app
   ```

---

## ✅ Verification Checklist

- [x] Dockerfile created with multi-stage build
- [x] .dockerignore configured
- [x] Image builds successfully (<5 minutes)
- [x] Container runs on port 3000
- [x] Court Room page accessible at `/court-room`
- [x] POST `/api/game` creates sessions (201 status)
- [x] GET `/api/game` retrieves sessions (200 status)
- [x] PUT `/api/game` updates sessions (200 status)
- [x] DELETE `/api/game` removes sessions (200 status)
- [x] Save button in Court Room triggers API
- [x] Sessions display in UI
- [x] Load/Delete buttons work

---

## 🎯 Rubric Alignment

✅ **Week 6 Requirements:**
- Docker container created and running
- APIs work inside Docker
- Save button functional (POST to `/api/game`)
- Multiple game options (load saved sessions)

✅ **Integration with Week 5:**
- All CRUD operations functional
- Court Room escalating logic intact
- Timer, messages, stages working

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Build | `docker build -t court-room-app .` |
| Run | `docker run -d -p 3000:3000 --name court-room-container court-room-app` |
| Stop | `docker stop court-room-container` |
| Start | `docker start court-room-container` |
| Logs | `docker logs court-room-container` |
| Remove | `docker rm -f court-room-container` |
| Test API | `curl http://localhost:3000/api/game` |
| Browser | `http://localhost:3000/court-room` |

---

**Last Updated:** October 21, 2025  
**Version:** Docker Week 6 Implementation  
**Status:** ✅ All tests passing
