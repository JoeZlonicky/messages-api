import bcrypt from 'bcryptjs';

const saltLength = 10;

async function hashPassword(password: string) {
  const hashed = await bcrypt.hash(password, saltLength);
  return hashed;
}

export { hashPassword };
