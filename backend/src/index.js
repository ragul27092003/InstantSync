import express from 'express'
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRouter from './routes/auth.route.js';



dotenv.config();

const app=express();

const PORT=process.env.PORT || 5001;
app.use(express.json());
app.use('/api/auth',authRouter);

connectDB().then(()=>{
    app.listen(PORT,()=>{
       console.log(`Server is running on port : ${PORT}`);
    })})
.catch((error)=>{
    console.log("Error in DB connection",error);
    process.exit(1);
   })