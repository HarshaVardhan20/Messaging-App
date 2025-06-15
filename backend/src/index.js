import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js'
import cookeParser from 'cookie-parser'
import messageRoutes from './routes/message.route.js'
import cors from 'cors'
import { app,server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: 'http://localhost:5173',   
    credentials: true
})) 

app.use(cookeParser());
app.use(express.json({ limit: '10mb' }));




 
app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes)

server.listen(PORT,()=>{
    console.log(`App is lisetening at http://localhost:${PORT}`)
    connectDB();
})