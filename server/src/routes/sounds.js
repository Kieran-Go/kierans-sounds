import { Router } from "express";
import controller from "../controllers/sounds-controller.js";
import validator from "../validation/sounds-validator.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";

// Initialize router
const router = Router();

// ----- GET -----
// Get sound by id (admin only)
router.get('/admin/id/:id', verifyAdmin, validator.validateSoundId, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const sound = await controller.getSoundById(id);
        if(!sound) return res.status(404).json({ error: "Sound not found" });
        res.json(sound);
    } catch(err) { next(err) }
});

// Get user's sounds by userId
router.get('/user', verifyToken, async (req, res, next) => {
    try{
        const userId = req.user.id;
        const sounds = await controller.getSoundsByUser(userId);
        res.json(sounds);
    } catch(err) { next(err) }
});

// ----- POST -----
router.post('/', verifyToken, validator.validateCreateSound, async (req, res, next) => {
    try{
        const userId = req.user.id;
        const { name, url } = req.body;
        const sound = await controller.createSound(userId, name, url);
        res.json(sound);
    } catch(err) { next(err) }
});

// ----- PUT -----
router.put('/:id', verifyToken, validator.validateEditSound, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const { name, url } = req.body;
        const sound = await controller.editSound(id, userId, name, url);
        res.json(sound);
    } catch(err) { next(err) }
});

// ----- DELETE -----
router.delete("/:id", verifyToken, validator.validateSoundId, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const sound = await controller.deleteSound(id, userId);
        res.json(sound);
    } catch(err) { next(err) }
});

export default router;