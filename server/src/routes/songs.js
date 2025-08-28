import { Router } from "express";
import controller from "../controllers/songs-controller.js";
import validator from "../validation/songs-validator.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";

// Initialize router
const router = Router();

// ----- GET -----
// Get song by id (admin only)
router.get('/admin/id/:id', verifyAdmin, validator.validateSongId, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const song = await controller.getSongById(id);
        if(!song) return res.status(404).json({ error: "Song not found" });
        res.json(song);
    } catch(err) { next(err) }
});

// Get user's songs by userId
router.get('/user', verifyToken, async (req, res, next) => {
    try{
        const userId = req.user.id;
        const songs = await controller.getSongsByUser(userId);
        res.json(songs);
    } catch(err) { next(err) }
});

// ----- POST -----
router.post('/', verifyToken, validator.validateCreateSong, async (req, res, next) => {
    try{
        const userId = req.user.id;
        const { name, author, url } = req.body;
        const song = await controller.createSong(userId, name, author, url);
        res.json(song);
    } catch(err) { next(err) }
});

// ----- PUT -----
router.put('/:id', verifyToken, validator.validateEditSong, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const { name, author, url } = req.body;
        const song = await controller.editSong(id, userId, name, author, url);
        res.json(song);
    } catch(err) { next(err) }
});

// ----- DELETE -----
router.delete("/:id", verifyToken, validator.validateSongId, async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const song = await controller.deleteSong(id, userId);
        res.json(song);
    } catch(err) { next(err) }
});

export default router;