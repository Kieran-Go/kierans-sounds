import { Router } from 'express';
import prisma from '../../db/pool.js';
import verifyToken from '../middleware/verifyToken.js';
import controller from "../controllers/auth-controller.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const router = Router();

router.get('/', verifyToken, async (req, res, next) => {
    try{
        // The verifyToken middleware adds the decoded JWT payload to req.user. The payload should contain the user's ID
        const { id } = req.user;

        // Find the user in the database using the ID from the token
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, username: true } 
        });

        // If the user doesn't exist (e.g., was deleted after token was issued), return an error
        if (!user) return res.status(404).json({ valid: false, message: 'User not found' });

        // User exists and token is valid - return the user's public info
        res.json({ valid: true, user });

    }catch(err) { next(err) }
});

router.post('/login', async (req, res, next) => {
    try{
        // User inputed name and password
        const { username, password } = req.body;

        // Check the database for user
        const user = await controller.getLoginRequest(username, password);
        
        // Verify user
        if(!user) return res.status(401).json({ message: "Incorrect username or password" });
        
        // Payload to encode in the JWT
        const payload = { id: user.id };

        // Sign the JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        // Send token and user as json. Omit password and other sensitive data
        res.json({ token, user: { id: user.id, username: user.username } });
    }catch(err) { next(err) }
});

router.post('/signup', async (req, res, next) => {
    try {
        // User inputed name and password
        const { username, password } = req.body;

        // Create new user
        const user = await controller.signUpUser(username, password);

        // Payload to encode in the JWT
        const payload = { id: user.id };

        // Sign the JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        // Send token and user as json. Omit password and other sensitive data
        res.json({ token, user: { id: user.id, username: user.username } });
    }catch(err) { next(err) }
});

export default router;