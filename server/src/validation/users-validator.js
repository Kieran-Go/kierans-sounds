import { body, param } from 'express-validator';
import validateRequest from './validateRequest.js';

const validateUserId = [
    param('id')
        .isInt({gt: 0}).withMessage('ID must be a positive integer'),

    validateRequest
];

const validateUsername = [
    param('username')
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 50 }).withMessage("Username must be 3–50 characters long")
        .isAlphanumeric().withMessage("Username must contain only letters and numbers"),

    validateRequest
]

const validateCreateUser = [
  body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 50 }).withMessage("Username must be 3–50 characters long")
        .isAlphanumeric().withMessage("Username must contain only letters and numbers"),

  body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8, max: 100 }).withMessage("Password must be 8-100 characters long"),

  validateRequest
];

const validateEditUser = [
  body("username")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("Username must be 3–50 characters long"),

  
  body("password")
        .optional({ checkFalsy: true })
        .isLength({ min: 8, max: 100 }).withMessage("Password must be 8–100 characters long"),

    validateRequest
];


export default {
    validateUserId,
    validateUsername,
    validateCreateUser,
    validateEditUser,
}