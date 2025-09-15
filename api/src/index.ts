import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import products from "./routes/product.routes";
import categories from "./routes/category.routes";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS dinámico desde .env
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Rutas
app.use("/api/categories", categories);
app.use("/api/products", products);

// ✅ Conexión a Mongo y arranque del server
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");

    const port = Number(process.env.PORT) || 4000;
    app.listen(port, () => {
      console.log(`🚀 API ready on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error("❌ Error conectando a MongoDB:", err);
    process.exit(1);
  });
