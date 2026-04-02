const dotenv = require('dotenv');
const dns = require('dns');

// Force using Google DNS to bypass ISP SRV lookup failures
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load env vars FIRST
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const path = require('path');
const fs = require('fs');

// Disable Mongoose buffering — fail fast if DB not connected
mongoose.set('bufferCommands', false);

const app = express();

// Create uploads folder if not exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.send('API Running');
});

// API Routes
app.use('/api', studentRoutes);

// Error handler
app.use(errorHandler);

// START: Connect DB first, THEN listen
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Failed to start server:`);
    console.error(error);
    process.exit(1);
  }
};

startServer();
