import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import products from './routes/product.routes'; 
import categories from './routes/category.routes';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // o usa proxy (ver abajo)
app.use(express.json());
app.use('/api/categories', categories);
app.use('/api/products', products);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`API ready on http://localhost:${port}`));