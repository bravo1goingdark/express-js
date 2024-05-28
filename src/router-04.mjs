import express from 'express';
import userRouter from '../routers/user.mjs';
import productRouter from '../routers/product.mjs';
const app = express();
app.use(express.json());
app.use(userRouter);
app.use(productRouter);

app.listen(3000,() => {
    console.log(`Listening on http://localhost:${3000}`);
})