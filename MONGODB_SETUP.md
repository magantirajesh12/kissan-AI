# MongoDB Integration Setup

## Configuration

Your MongoDB connection string has been configured in `.env`:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/kissan-ai
```

**Database**: `kissan-ai`  
**User**: Your MongoDB Atlas username (stored in `.env`)

## Running the Application

### Option 1: Run Frontend + Backend Together
```bash
npm run dev:all
```

This starts:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3003 (Express + MongoDB)

### Option 2: Run Separately

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run dev:server
```

## Collections Created

### voice_interactions
Stores all voice queries and responses
- `id`: Unique identifier
- `timestamp`: When the interaction occurred
- `language`: User's selected language (en, te, hi)
- `detectedLanguage`: Auto-detected language
- `query`: Original voice input text
- `crops`: Detected crop names
- `response`: AI's response text
- `duration`: Interaction duration in seconds
- `createdAt`: MongoDB timestamp

### farm_activities
Stores farm activity logs
- `id`: Unique identifier
- `type`: Activity type (sowing, irrigation, etc.)
- `crop`: Crop name
- `date`: Activity date
- `details`: Activity details
- `cost`: Cost in rupees
- `yield`: Yield in kg
- `createdAt`: MongoDB timestamp

## API Endpoints

### Voice Interactions
- `POST /api/voice-interactions` - Save new interaction
- `GET /api/voice-interactions` - Get all interactions
- `GET /api/voice-interactions/language/:lang` - Get by language
- `GET /api/voice-interactions/crop/:crop` - Get by crop
- `GET /api/voice-statistics` - Get statistics
- `DELETE /api/voice-interactions/:id` - Delete specific interaction
- `DELETE /api/voice-interactions` - Clear all interactions

### Farm Activities
- `POST /api/farm-activities` - Save new activity
- `GET /api/farm-activities` - Get all activities

### Health Check
- `GET /api/health` - Server and MongoDB status

## Features

✅ **Automatic Fallback**: If MongoDB is unavailable, data saves to localStorage  
✅ **Multi-language Support**: Stores language preference with each interaction  
✅ **Crop Detection**: Automatically identifies mentioned crops  
✅ **Statistics**: Generate analytics from stored data  
✅ **RESTful API**: Easy integration with frontend  

## Troubleshooting

### MongoDB Connection Failed
1. Check MongoDB Atlas is running
2. Verify connection string in `.env`
3. Ensure IP whitelist includes your machine
4. Check username/password are correct

### Backend Not Starting
```bash
# Check Node.js version
node --version  # Should be v14+

# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### Frontend Can't Connect to Backend
1. Ensure backend is running on port 3003
2. Check `VITE_API_URL=http://localhost:3003` in `.env`
3. Clear browser cache and reload

## Testing

```bash
# Test server health
curl http://localhost:3003/api/health

# Save a voice interaction
curl -X POST http://localhost:3003/api/voice-interactions \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-1",
    "timestamp": 1704067200000,
    "language": "en",
    "detectedLanguage": "en",
    "query": "How to grow rice?",
    "crops": ["Rice"],
    "response": "Rice cultivation guide...",
    "duration": 15
  }'

# Get all interactions
curl http://localhost:3003/api/voice-interactions
```

## Data Persistence

- **Voice interactions**: Stored in MongoDB (with localStorage fallback)
- **Farm activities**: Stored in MongoDB
- **Settings**: Still stored in browser localStorage
- **User profile**: Browser localStorage

## Security Notes

⚠️ **Do NOT commit `.env` to Git**  
Your `.env` file contains sensitive credentials. It's already in `.gitignore` but verify before pushing to GitHub.

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure MongoDB (already done)
3. Start backend: `npm run dev:server`
4. Start frontend: `npm run dev`
5. Test MongoDB connection through app
6. Voice interactions will now persist to MongoDB!
