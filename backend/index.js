import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pino from 'pino'
import pinoHttp from 'pino-http';
import authRoutes from './routes/authRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
dotenv.config();
if (!process.env.JWT_SECRET){
  console.error('JWT_SECRET is not set, exiting');
  process.exit(1);
}
const isDev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 5000;
const logger = pino(
  isDev ? {transport: {target: 'pino-pretty', options: {colorize: true}}}:{}
);
const app = express();
app.use(pinoHttp({logger}));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/notes',noteRoutes);
app.get('/api/health', (req, res)=>{
  res.sendStatus(200);
});
app.use((err,req,res,next)=>{
  const status = typeof err.status === 'number' && err.status < 500 ? err.status : 500;
  req.log.error(err);
  res.status(status).json({
    error: status === 500 ? 'Internal server error' : err.message
  });
});
app.listen(PORT, ()=>{
  logger.info(`Server is listening on ${PORT}`);
});
process.on('unhandledRejection', (reason)=>{
  logger.error({reason},'Unhandled rejection');
  process.exit(1);
});