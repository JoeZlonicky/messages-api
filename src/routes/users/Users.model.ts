import { prisma } from '../../prisma/prisma';
import type { ExposedUser } from '../../types/ExposedUser';

async function getAll() {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      displayName: true,
    },
  });

  return result;
}

async function getById(id: number) {
  const result: ExposedUser[] = await prisma.user.findMany({
    select: {
      id: true,
      displayName: true,
    },
    where: { id },
  });

  return result;
}

async function create(username: string, displayName: string, password: string) {
  const result = await prisma.user.create({
    data: {
      username,
      displayName,
      password,
    },
    select: {
      id: true,
      displayName: true,
    },
  });

  return result;
}

async function update(id: number, displayName: string) {
  const result = await prisma.user.update({
    select: {
      id: true,
      displayName: true,
    },
    data: {
      displayName,
    },
    where: {
      id,
    },
  });

  return result;
}

export const UsersModel = { getAll, getById, create, update };
