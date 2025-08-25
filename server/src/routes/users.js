import { Router } from "express";

// Initialize router
const router = Router();

// GET
router.get('/', async (req, res, next) => {
    try{
        res.send("Hello, World!");
    }
    catch(err) {
        next(err);
    }
});

export default router;