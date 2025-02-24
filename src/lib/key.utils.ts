export const generateApiKey = (): string => {
  return crypto
    .randomUUID()
    .replace(/^(.{5})-(.{4})-(.{4})-(.{4})-(.{12})$/, "$1-$2-$3-$4-$5");
};
