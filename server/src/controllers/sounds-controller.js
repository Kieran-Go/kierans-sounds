const prisma = require('../../db/pool');

module.exports = {
    getSoundById: async (id) => {
        const sound = await prisma.sound.findUnique({
            where: { id }
        });
        return sound;
    },

    getSoundsByUser: async (userId) => {
        const sounds = await prisma.sound.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' }
        });
        return sounds;
    },

    createSound: async (userId, name, url) => {
        const sound = await prisma.sound.create({
            data: { userId, name, url }
        });
        return sound;
    },

    editSound: async (id, name, url) => {
        const data = {};
        if (name) data.name = name;
        if (url) data.url = url;

        // Throw error if neither field is provided
        if (Object.keys(data).length === 0) {
            throw new Error("No fields to update");
        }

        const sound = await prisma.sound.update({
            where: { id },
            data
        });
        return sound;
    },

    deleteSound: async (id) => {
        const sound = await prisma.sound.delete({
            where: { id }
        });
        return sound;
    }
}