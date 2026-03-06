import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDb from './config/configDb.js';
import authRoutes from './routes/authRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import budgetRouter from './routes/budgetroutes.js';
// import 
import { globalLimiter } from './middlewares/rateLimiter.js';

configDotenv();
connectDb();

const app = express();
app.use(express.json());

app.set("trust proxy", 1);
app.use(globalLimiter);

app.use(cookieParser());

app.use(helmet());

// other site allowing
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/expensetracker/users',authRoutes);
app.use('/expensetracker/transactions/',transactionRouter);
app.use('/expensetracker/categories/',categoryRouter);
app.use('/expensetracker/budget/',budgetRouter);

app.get('/checkbackend',(req,res)=>{
    try {
        res.json('okk');
    } catch (error) {
        res.json(res.status('404'),error)
    }
});

app.listen(process.env.PORT,()=>{
    console.log(`runnning on http://localhost:${process.env.PORT}`);
});