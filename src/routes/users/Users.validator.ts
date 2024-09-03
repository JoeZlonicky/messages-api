import { authRoute } from '../../middleware/authRoute';
import { validateRequest } from '../../middleware/validateRequest';
import { prisma } from '../../prisma/prisma';
import type { Request } from 'express';
import { body, param } from 'express-validator';

const get = [authRoute];

const getById = [authRoute];

const create = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('username missing')
    .bail()
    .isAlphanumeric()
    .withMessage('username not alphanumeric')
    .custom(async (value: string) => {
      const existingUser = await prisma.user.findUnique({
        where: { username: value },
      });
      if (existingUser) {
        throw new Error('username already in use');
      }
    }),
  body('displayName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('displayName missing')
    .bail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password must be more than 8 characters'),
  body('confirmPassword')
    .isLength({ min: 1 })
    .withMessage('confirmPassword missing')
    .bail()
    .custom((value, { req }) => {
      return (req.body as { password: string }).password === value;
    })
    .withMessage('passwords do not match'),
  validateRequest,
];

const update = [
  authRoute,
  param('id')
    .custom((value, { req }) => {
      return parseInt(value as string) === (req as Request).user!.id;
    })
    .withMessage('id does not match authenticated user')
    .bail({ level: 'request' }),
  body('displayName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('displayName missing'),
  validateRequest,
];

export const UsersValidator = { get, getById, create, update };
