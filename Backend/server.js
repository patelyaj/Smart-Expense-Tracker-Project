import { configDotenv } from 'dotenv';
import express from 'express';
import cors from 'cors';
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

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`running on http://localhost:${PORT}`);
    });
}

export default app;