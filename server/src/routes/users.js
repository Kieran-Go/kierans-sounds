import { Router } from "express";
import controller from "../controllers/users-controller.js";
import validator from "../validation/users-validator.js";

// Initialize router
const router = Router();

// ----- GET -----
// Get all users
router.get('/', async (req, res, next) => {
    try{
        const users = await controller.getAllUsers();
        res.json(users);
    }
    catch(err) {
        next(err);
    }
});

// Get user by id
router.get('/id/:id', validator.validateUserId, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const user = await controller.getUserById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    }
    catch(err) {
        next(err);
    }
})

// Get user by username
router.get('/username/:username', validator.validateUsername, async (req, res, next) => {
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

// ----- POST -----
// Create a new user
router.post('/', validator.validateCreateUser, async (req, res, next) => {
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
router.put('/:id', validator.validateEditUser, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
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
router.delete('/:id', validator.validateUserId, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const user = await controller.deleteUser(id);
        res.json(user);
    }
    catch (err) {
        next(err);
    }
});

export default router;