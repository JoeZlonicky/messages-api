import { validateRequest } from '../../middleware/validateRequest';
import { prisma } from '../../prisma/prisma';
import { body } from 'express-validator';

const create = [
  body('toUserId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('toUserId missing (use -1 to message server)')
    .bail()
    .isNumeric()
    .withMessage('toUserId not numeric')
    .bail()
    .custom(async (value) => {
      const id = parseInt(value as string);
      if (id === -1) return true;

      const result = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!result) {
        throw new Error(
          'toUserId does not match any user (use -1 to message server)',
        );
      }
    }),
  body('content').trim().isLength({ min: 1 }).withMessage('content missing'),
  validateRequest,
];

export const MessagesValidator = { create };
