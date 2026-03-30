export const createSlug = (name: string, model: string): string => {
  const base = `${name} ${model}`;

  const slug = base
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  const words = slug.split('-');
  return [...new Set(words)].join('-');
};
