import express from "express";
import db from "./config/db.js"
import authRoutes from "./routes/auth.route.js"
import customerRoutes from "./routes/customer.route.js"
import cors from "cors"




const port = 3000;
const app = express();

db();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth',authRoutes)
app.use('/customer',customerRoutes)
app.listen(port, ()=>{
    console.log(`Server is running on port http://localhost:${port}`);
})