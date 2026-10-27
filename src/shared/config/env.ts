import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default(''),
});

const parseEnv = () => {
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) {
    const formattedErrors = z.treeifyError(result.error);
    console.error('Invalid environment variables:', formattedErrors);

    throw new Error('Invalid environment configuration');
  }
  return result.data;
};

export const env = parseEnv();
