import express from 'express';

const router = express.Router();

router.get('/realtimeproducts2', (req, res) => {
    res.render("realtimeProducts.js");
})

export default router;