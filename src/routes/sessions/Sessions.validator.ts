import { validateRequest } from '../../middleware/validateRequest';
import { prisma } from '../../prisma/prisma';
import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { body } from 'express-validator';

const create = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('username missing')
    .bail({ level: 'request' })
    .custom(async (value: string, { req }) => {
      const user = await prisma.user.findUnique({ where: { username: value } });
      if (!user) {
        throw new Error('Invalid username');
      }
      req.user = user;
    })
    .bail({ level: 'request' }),
  body('password')
    .isLength({ min: 1 })
    .withMessage('password missing')
    .bail()
    .custom(async (value: string, { req }) => {
      const user = (req as { user: User }).user;
      const match = await bcrypt.compare(value, user.password);
      if (!match) {
        throw new Error('Invalid password');
      }
    }),
  validateRequest,
];

export const SessionsValidator = { create };
