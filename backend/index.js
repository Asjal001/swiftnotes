import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pino from 'pino'
import pinoHttp from 'pino-http';
import authRoutes from './routes/authRoutes.js'

dotenv.config();
const isDev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 5000;
const logger = pino(
  isDev ? {transport: {target: 'pino-pretty', options: {colorize: true}}}:{}
);
const app = express();
app.use(pinoHttp({logger}));
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.get('/api/health', (req, res)=>{
  res.sendStatus(200);
});
app.use((err,req,res,next)=>{
  const status = err.status || 500;
  req.log.error(err);
  res.status(status).json({message: err.message});
});
app.listen(PORT, ()=>{
  logger.info(`Server is listening on ${PORT}`);
});
process.on('unhandledRejection', (reason)=>{
  logger.error({reason},'Unhandled rejection');
  process.exit(1);
});