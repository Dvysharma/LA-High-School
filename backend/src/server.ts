import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth';
import cmsRoutes from './routes/cms';
import * as path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://lahighschool.vercel.app'],
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload folder just in case
app.use('/uploads', express.static(path.resolve(__dirname, '../../../frontend/public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cms', cmsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
