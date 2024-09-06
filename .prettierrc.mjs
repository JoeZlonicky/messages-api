//@ts-check
/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-prisma', '@trivago/prettier-plugin-sort-imports'],
  singleQuote: true,
  trailingComma: 'all',
  importOrderSortSpecifiers: true,
};
