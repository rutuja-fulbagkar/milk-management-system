import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from "./config/db.js";
import authRoute from './routes/authRoutes.js'


dotenv.config();
connectDB();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 

const allowedOrigins = [
  'http://localhost:5173',
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// app.use(cors({
//   origin: 'http://localhost:5173',  
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,  
// }));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoute);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => { 
    res.send('Hello, World!');
});
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});