import { Router } from "express";

const router = Router();

router.get('/api/products', (request, response) => {
    response.send([
        {id:1 , productName: "Pizza", cost:499},
    ]);
});

export default router;