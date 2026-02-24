export const sanitizePage = (page: number) => (page < 0 ? 0 : page);
export const sanitizeSize = (size: number) => {
  if (size < 1) return 10;
  if (size > 100) return 100;
  return size;
};