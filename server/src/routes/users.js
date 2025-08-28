import { Router } from "express";
import controller from "../controllers/users-controller.js";
import validator from "../validation/users-validator.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";

// Initialize router
const router = Router();

// ----- GET -----
// Get all users (admin only)
router.get('/admin', verifyAdmin, async (req, res, next) => {
    try{
        const users = await controller.getAllUsers();
        res.json(users);
    }
    catch(err) {
        next(err);
    }
});

// Get user by id (admin only)
router.get('/admin/id/:id', verifyAdmin, validator.validateUserId, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const user = await controller.getUserById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    }
    catch(err) {
        next(err);
    }
});

// Get user by username (admin only)
router.get('/admin/username/:username', verifyAdmin, validator.validateUsername, async (req, res, next) => {
    try {
        const username = req.params.username;
        const user = await controller.getUserByUsername(username);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    }
    catch(err) {
        next(err);
    }
});

// Get user by id
router.get('/', verifyToken, async (req, res, next) => {
    try{
        const id = req.user.id;
        const user = await controller.getUserById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    }
    catch(err) {
        next(err);
    }
});

// ----- POST -----
// Create a new user (admin only)
router.post('/admin', verifyAdmin, validator.validateCreateUser, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await controller.createUser(username, password);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// ----- PUT -----
// Edit existing user with optional username and password 
router.put('/', verifyToken, validator.validateEditUser, async (req, res, next) => {
    try{
        const id = req.user.id;
        const { username, password } = req.body;
        const user = await controller.editUser(id, username, password);
        res.json(user);
    }
    catch (err) {
        next(err);
    }
});

// ----- DELETE -----
// Delete existing user
router.delete('/', verifyToken, async (req, res, next) => {
    try{
        const id = req.user.id;
        const user = await controller.deleteUser(id);
        res.json(user);
    }
    catch (err) {
        next(err);
    }
});

export default router;