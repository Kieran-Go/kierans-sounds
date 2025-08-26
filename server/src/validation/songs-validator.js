import { body, param } from 'express-validator';
import validateRequest from './validateRequest.js';

const validateSongId = [
    param('id')
        .isInt({ gt: 0 }).withMessage('Song ID must be a positive integer'),
    validateRequest
];

const validateUserId = [
    param('userId')
        .isInt({ gt: 0 }).withMessage('User ID must be a positive integer'),
    validateRequest
];

const validateCreateSong = [
    body('userId')
        .isInt({ gt: 0 }).withMessage('User ID must be a positive integer'),

    body('name')
        .trim()
        .notEmpty().withMessage('Song name is required')
        .isLength({ min: 3, max: 60 }).withMessage('Song name must be 3-60 characters'),

    body('author')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 60 }).withMessage('Author must be 60 characters or less'),

    body('url')
        .notEmpty().withMessage('Song URL is required')
        .isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Song URL must be a valid URL'),

    validateRequest
];

const validateEditSong = [
    param('id')
        .isInt({ gt: 0 }).withMessage('Song ID must be a positive integer'),

    body('name')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('Song name must be 3-60 characters'),

    body('author')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 60 }).withMessage('Author must be 60 characters or less'),

    body('url')
        .optional({ checkFalsy: true })
        .isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Song URL must be a valid URL'),

    validateRequest
];

export default {
    validateSongId,
    validateUserId,
    validateCreateSong,
    validateEditSong
};
