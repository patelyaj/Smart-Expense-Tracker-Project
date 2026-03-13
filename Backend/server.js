import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDb from './config/database.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import routes from './routes/index.js';
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
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

app.use('/api',routes);

app.get('/checkbackend',(req,res)=>{
    try {
        res.json('okk');
    } catch (error) {
        res.json(res.status('404'),error)
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`running on http://localhost:${process.env.PORT || 5000}`);
});

export default app;