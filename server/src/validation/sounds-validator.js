import { body, param } from 'express-validator';
import validateRequest from './validateRequest.js';

const validateSoundId = [
    param('id')
        .isInt({ gt: 0 }).withMessage('Sound ID must be a positive integer'),
    validateRequest
];

const validateUserId = [
    param('userId')
        .isInt({ gt: 0 }).withMessage('User ID must be a positive integer'),
    validateRequest
];

const validateCreateSound = [
    body('name')
        .trim()
        .notEmpty().withMessage('Sound name is required')
        .isLength({ min: 3, max: 15 }).withMessage('Sound name must be 3-15 characters'),

    body('url')
        .notEmpty().withMessage('Sound URL is required')
        .isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Sound URL must be a valid URL'),

    validateRequest
];

const validateEditSound = [
    param('id')
        .isInt({ gt: 0 }).withMessage('Sound ID must be a positive integer'),

    body('name')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 15 }).withMessage('Sound name must be 3-15 characters'),

    body('url')
        .optional({ checkFalsy: true })
        .isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Sound URL must be a valid URL'),

    validateRequest
];

export default {
    validateSoundId,
    validateUserId,
    validateCreateSound,
    validateEditSound
};
