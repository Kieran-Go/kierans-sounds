const prisma = require('../../db/pool');
const bcrypt = require('bcrypt');
require('dotenv/config');

const SALT = parseInt(process.env.SALT_ROUNDS) || 10;

module.exports = {
    getAllUsers: async () => {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
            }
        });
        return users;
    },

    getUserById: async (id) => {
        const user = await prisma.user.findUnique({
            where: { id },
             select: {
                id: true,
                username: true,
                songs: {
                    select: { id: true, name: true, author: true, url: true, createdAt: true },
                    orderBy: { createdAt: 'asc' }
                },
                sounds: {
                    select: { id: true, name: true, url: true, createdAt: true },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        return user;
    },

    getUserByUsername: async (username) => {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                songs: {
                    select: { id: true, name: true, author: true, url: true, createdAt: true },
                    orderBy: { createdAt: 'asc' }
                },
                sounds: {
                    select: { id: true, name: true, url: true, createdAt: true },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        return user;
    },

    createUser: async (username, password) => {
        const hashedPassword = await bcrypt.hash(password, SALT);
        const user = await prisma.user.create({
            data: { username, password: hashedPassword }
        });
        return { id: user.id, username: user.username };
    },

    editUser: async (id, username, password) => {
        const data = {};
        if (username) data.username = username;
        if (password) data.password = await bcrypt.hash(password, SALT);

        if (Object.keys(data).length === 0) {
            throw new Error("No fields to update");
        }

        const user = await prisma.user.update({
            where: { id },
            data
        });
        return { id: user.id, username: user.username };
    },

    deleteUser: async (id) => {
        const user = await prisma.user.delete({
            where: { id }
        });
        return { id: user.id, username: user.username };
    }
}