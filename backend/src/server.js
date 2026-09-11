// Load environment variables immediately before any other module imports
require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');
const blocksRoutes = require('./routes/blocks.routes');
const trainRoutes = require('./routes/trainRoutes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// ─── Socket.io Setup ────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Attach io to app so controllers can access it via req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Join the timeline room for block planning updates
  socket.on('join:timeline', () => {
    socket.join('timeline');
    console.log(`[Socket.io] Client ${socket.id} joined timeline room`);
    socket.emit('timeline:joined', { message: 'Connected to live timeline', socketId: socket.id });
  });

  // Client-side booking event relay
  socket.on('book:block', (data) => {
    socket.broadcast.emit('block:booked', data);
  });

  // Client-side delete event relay
  socket.on('delete:block', (data) => {
    socket.broadcast.emit('block:deleted', data);
  });

  socket.on('disconnect', (reason) => {
    console.log(`[Socket.io] Client disconnected: ${socket.id} (${reason})`);
  });

  socket.on('error', (err) => {
    console.error('[Socket.io] Socket error:', err);
  });
});

// Connect to MongoDB
connectDB();

// ─── Middleware ──────────────────────────────────────────────────────────────
// Normalize URL path to prevent 404 on double slashes (e.g. //api/auth/login -> /api/auth/login)
app.use((req, res, next) => {
  if (req.url && req.url.startsWith('//')) {
    req.url = req.url.replace(/^\/+/, '/');
  }
  next();
});

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'role'],
    credentials: true,
  })
);
app.options('*', cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ─────────────────────────────────────────────────────────────────

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    project: 'Setu Sutra — SIH Indian Railways Maintenance Block Planning System',
    service: 'Backend API v2.0',
    status: 'online',
    socketIo: 'enabled',
    healthCheck: '/api/health',
    blockPlanningApi: '/api/blocks',
  });
});

// Blocks API (new mission-spec routes)
app.use('/api/blocks', blocksRoutes);

// Train Telemetry & Live Tracking Routes (RailRadar Provider)
app.use('/api/trains', trainRoutes);

// Legacy API Routes
app.use('/api', apiRoutes);

// ─── 404 & Error Handlers ────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error('[Backend Server Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚆 Setu Sutra Block Planning Backend — Port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧱 Blocks API: http://localhost:${PORT}/api/blocks`);
  console.log(`⚡ Socket.io: enabled (ws://localhost:${PORT})`);
  console.log(`====================================================`);
});

module.exports = { app, server, io };
