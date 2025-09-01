const prisma = require('../../db/pool');
const bcrypt = require('bcrypt');
require('dotenv/config');

const SALT = parseInt(process.env.SALT_ROUNDS) || 10;

module.exports = {
    getLoginRequest: async (username, password) => {
        // Find user by username
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) return null;

        // Compare hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) return null;

        return user;
    },

    signUpUser: async (username, password) => {
        // Check that a user with this username doesn't already exist
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });
        if(existingUser) throw new Error("A user with this name already exists");

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT);

        // Create and return the new user
        const user = await prisma.user.create({
            data: { username, password: hashedPassword }
        });
        return { id: user.id, username: user.username };
    }
}