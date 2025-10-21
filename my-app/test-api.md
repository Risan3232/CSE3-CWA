# Testing the Court Room API

## Prerequisites
Make sure your development server is running:
```bash
npm run dev
```

The API will be available at: `http://localhost:3000/api/game`

## Testing with Browser Console

### 1. Create a Session (POST)
```javascript
fetch('/api/game', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    timer: 30,
    messages: ["⚖️ Court is now in session!", "⏰ Time's up!"],
    stage: 2,
    output: "console.log('Debugged code')",
    inputTimer: 30
  })
})
  .then(res => res.json())
  .then(data => console.log('Created:', data));
```

### 2. Get All Sessions (GET)
```javascript
fetch('/api/game')
  .then(res => res.json())
  .then(data => console.log('All sessions:', data));
```

### 3. Update a Session (PUT)
```javascript
// Replace 'SESSION_ID' with an actual ID from GET response
fetch('/api/game', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: SESSION_ID,
    stage: 3,
    messages: ["Updated message"]
  })
})
  .then(res => res.json())
  .then(data => console.log('Updated:', data));
```

### 4. Delete a Session (DELETE)
```javascript
// Replace 'SESSION_ID' with an actual ID from GET response
fetch('/api/game', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: SESSION_ID })
})
  .then(res => res.json())
  .then(data => console.log('Deleted:', data));
```

## Testing with cURL

### Create Session
```bash
curl -X POST http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -d '{
    "timer": 30,
    "messages": ["Court session started"],
    "stage": 1,
    "output": "console.log(\"Hello\")",
    "inputTimer": 30
  }'
```

### Get All Sessions
```bash
curl http://localhost:3000/api/game
```

### Update Session
```bash
curl -X PUT http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1234567890,
    "stage": 4
  }'
```

### Delete Session
```bash
curl -X DELETE http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -d '{"id": 1234567890}'
```

## Testing in the Court Room Page

1. Go to http://localhost:3000/court-room
2. Play the game (set timer, submit code, trigger messages)
3. Click "💾 Save Session" to save your progress
4. The saved session will appear in the "Saved Sessions" section below
5. Use "📂 Load" to restore a previous session
6. Use "🗑️ Delete" to remove unwanted sessions
7. Start a "🎮 New Game" - it will auto-save your current session first

## Expected Behavior

- **Auto-save**: Sessions are automatically saved when:
  - You reach Stage 4 (game over)
  - You click "New Game" (if there are messages)
  
- **Manual save**: Click "💾 Save Session" anytime to save current state

- **Load**: Restores timer, messages, stage, and code from saved session

- **Delete**: Removes session from storage

- **Persistence**: Note that sessions are stored in-memory and will be lost when the server restarts (until database integration in Week 7)
