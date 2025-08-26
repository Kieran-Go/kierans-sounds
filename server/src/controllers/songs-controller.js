const prisma = require('../../db/pool');

module.exports = {
    getSongById: async (id) => {
        const song = await prisma.song.findUnique({
            where: { id }
        });
        return song;
    },

    getSongsByUser: async (userId) => {
        const songs = await prisma.song.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' }
        });
        return songs;
    },

    createSong: async (userId, name, author, url) => {
        const data = { userId, name, url }
        data.author = author ? author : null; // Author is optional
        const song = await prisma.song.create({
            data
        });
        return song;
    },

    editSong: async (id, name, author, url) => {
        const data = {};
        if (name) data.name = name;
        if (author) data.author = author;
        if (url) data.url = url;

        // Throw error if no field is provided
        if (Object.keys(data).length === 0) {
            throw new Error("No fields to update");
        }

        const song = await prisma.song.update({
            where: { id },
            data
        });
        return song;
    },

    deleteSong: async (id) => {
        const song = await prisma.song.delete({
            where: { id }
        });
        return song;
    }
}