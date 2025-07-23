import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import sujetRoutes from './routes/sujetRoutes';
import memoireRoutes from './routes/memoireRoutes';
import sessionRoutes from './routes/sessionRoutes';
import juryRoutes from './routes/juryRoutes';
import paiementRoutes from './routes/paiementRoutes';
import notificationRoutes from './routes/notificationRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

// Initialize environment variables
dotenv.config();

const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'], // Frontend URLs (Vite dev & prod)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser le JSON et les cookies
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sujets', sujetRoutes);
app.use('/api/memoires', memoireRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/jurys', juryRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Gestion Memoire API' });
});

// Routes will be imported here
// app.use('/api/auth', authRoutes);
// app.use('/api/memoires', memoireRoutes);
// app.use('/api/users', userRoutes);
// etc...

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 