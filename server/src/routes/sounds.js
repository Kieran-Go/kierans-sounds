import { Router } from "express";
import controller from "../controllers/sounds-controller.js";
import validator from "../validation/sounds-validator.js";

// Initialize router
const router = Router();

// ----- GET -----
// Get sound by id
router.get('/id/:id', validator.validateSoundId, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const sound = await controller.getSoundById(id);
        if(!sound) return res.status(404).json({ error: "Sound not found" });
        res.json(sound);
    } catch(err) { next(err) }
});

// Get user's sounds by userId
router.get('/user/:userId', validator.validateUserId, async (req, res, next) => {
    try{
        const userId = parseInt(req.params.userId, 10);
        const sounds = await controller.getSoundsByUser(userId);
        res.json(sounds);
    } catch(err) { next(err) }
});

// ----- POST -----
router.post('/', validator.validateCreateSound, async (req, res, next) => {
    try{
        const { userId, name, url } = req.body;
        const sound = await controller.createSound(userId, name, url);
        res.json(sound);
    } catch(err) { next(err) }
});

// ----- PUT -----
router.put('/:id', validator.validateEditSound, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const { name, url } = req.body;
        const sound = await controller.editSound(id, name, url);
        res.json(sound);
    } catch(err) { next(err) }
});

// ----- DELETE -----
router.delete("/:id", validator.validateSoundId, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const sound = await controller.deleteSound(id);
        res.json(sound);
    } catch(err) { next(err) }
});

export default router;