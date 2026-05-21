import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with fallback
let mongoConnected = false;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB Connected');
      mongoConnected = true;
    })
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.log('⚠️  Running in fallback mode (localStorage only)');
    });
} else {
  console.log('⚠️  No MongoDB URI configured - running in fallback mode');
}

// Voice Interaction Schema
const voiceInteractionSchema = new mongoose.Schema({
  id: String,
  timestamp: Number,
  language: String,
  detectedLanguage: String,
  query: String,
  crops: [String],
  response: String,
  duration: Number,
  userId: String,
  createdAt: { type: Date, default: Date.now }
});

const VoiceInteraction = mongoose.model('VoiceInteraction', voiceInteractionSchema);

// Farm Activity Schema
const farmActivitySchema = new mongoose.Schema({
  id: String,
  type: String,
  crop: String,
  date: Number,
  details: String,
  location: String,
  cost: Number,
  yield: Number,
  notes: String,
  images: [String],
  userId: String,
  createdAt: { type: Date, default: Date.now }
});

const FarmActivity = mongoose.model('FarmActivity', farmActivitySchema);

// Routes

// Save Voice Interaction
app.post('/api/voice-interactions', async (req, res) => {
  try {
    const interaction = new VoiceInteraction(req.body);
    await interaction.save();
    console.log('💾 Voice interaction saved:', interaction.id);
    res.json({ success: true, id: interaction._id });
  } catch (err) {
    console.error('Error saving voice interaction:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get All Voice Interactions
app.get('/api/voice-interactions', async (req, res) => {
  try {
    const interactions = await VoiceInteraction.find().sort({ timestamp: -1 });
    res.json(interactions);
  } catch (err) {
    console.error('Error fetching voice interactions:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get Voice Interactions by Language
app.get('/api/voice-interactions/language/:lang', async (req, res) => {
  try {
    const interactions = await VoiceInteraction.find({ language: req.params.lang }).sort({ timestamp: -1 });
    res.json(interactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Voice Interactions by Crop
app.get('/api/voice-interactions/crop/:crop', async (req, res) => {
  try {
    const interactions = await VoiceInteraction.find({ crops: req.params.crop }).sort({ timestamp: -1 });
    res.json(interactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Voice Statistics
app.get('/api/voice-statistics', async (req, res) => {
  try {
    const interactions = await VoiceInteraction.find();
    
    const languageCount = {};
    const cropCount = {};
    let totalDuration = 0;

    interactions.forEach(interaction => {
      languageCount[interaction.language] = (languageCount[interaction.language] || 0) + 1;
      interaction.crops.forEach(crop => {
        cropCount[crop] = (cropCount[crop] || 0) + 1;
      });
      if (interaction.duration) {
        totalDuration += interaction.duration;
      }
    });

    res.json({
      totalInteractions: interactions.length,
      byLanguage: languageCount,
      byCrop: cropCount,
      totalDurationSeconds: totalDuration,
      avgDurationSeconds: interactions.length > 0 ? Math.round(totalDuration / interactions.length) : 0,
      lastInteraction: interactions[interactions.length - 1] || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save Farm Activity
app.post('/api/farm-activities', async (req, res) => {
  try {
    const activity = new FarmActivity(req.body);
    await activity.save();
    console.log('🌾 Farm activity saved:', activity.id);
    res.json({ success: true, id: activity._id });
  } catch (err) {
    console.error('Error saving farm activity:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get All Farm Activities
app.get('/api/farm-activities', async (req, res) => {
  try {
    const activities = await FarmActivity.find().sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Voice Interaction
app.delete('/api/voice-interactions/:id', async (req, res) => {
  try {
    await VoiceInteraction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear All Voice Interactions
app.delete('/api/voice-interactions', async (req, res) => {
  try {
    await VoiceInteraction.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🚀 Kissan AI Backend Server running on port ${PORT}`);
});
