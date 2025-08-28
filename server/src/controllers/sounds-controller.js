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

    editSound: async (id, userId, name, url) => {
        const data = {};
        if (name) data.name = name;
        if (url) data.url = url;

        // Throw error if neither field is provided
        if (Object.keys(data).length === 0) {
            throw new Error("No fields to update");
        }

        // Check that the user owns this sound
        const sound = await prisma.sound.findUnique({
            where: { id }
        });
        if (!sound) throw new Error("Sound not found");
        if (sound.userId !== userId) throw new Error("Unauthorized");

        const editedSound = await prisma.sound.update({
            where: { id },
            data
        });
        return editedSound;
    },

    deleteSound: async (id, userId) => {
        // Check that the user owns this sound
        const sound = await prisma.sound.findUnique({
            where: { id }
        });
        if (!sound) throw new Error("Sound not found");
        if (sound.userId !== userId) throw new Error("Unauthorized");

        const deletedSound = await prisma.sound.delete({
            where: { id }
        });
        return deletedSound;
    }
}