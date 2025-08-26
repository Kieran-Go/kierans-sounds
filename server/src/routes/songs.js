import { Router } from "express";
import controller from "../controllers/songs-controller.js";
import validator from "../validation/songs-validator.js";

// Initialize router
const router = Router();

// ----- GET -----
// Get song by id
router.get('/id/:id', validator.validateSongId, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const song = await controller.getSongById(id);
        if(!song) return res.status(404).json({ error: "Song not found" });
        res.json(song);
    } catch(err) { next(err) }
});

// Get user's songs by userId
router.get('/user/:userId', validator.validateUserId, async (req, res, next) => {
    try{
        const userId = parseInt(req.params.userId, 10);
        const songs = await controller.getSongsByUser(userId);
        res.json(songs);
    } catch(err) { next(err) }
});

// ----- POST -----
router.post('/', validator.validateCreateSong, async (req, res, next) => {
    try{
        const { userId, name, author, url } = req.body;
        const song = await controller.createSong(userId, name, author, url);
        res.json(song);
    } catch(err) { next(err) }
});

// ----- PUT -----
router.put('/:id', validator.validateEditSong, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const { name, author, url } = req.body;
        const song = await controller.editSong(id, name, author, url);
        res.json(song);
    } catch(err) { next(err) }
});

// ----- DELETE -----
router.delete("/:id", validator.validateSongId, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const song = await controller.deleteSong(id);
        res.json(song);
    } catch(err) { next(err) }
});

export default router;