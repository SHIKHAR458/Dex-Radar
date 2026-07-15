import express from "express";
import cors from "cors";
import healtRoutes from './routes/healthRoutes.js';
import tokenRouter from './routes/tokenRoutes.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use('/' , healtRoutes);
app.use('/api/tokens',tokenRouter)


export  default app;