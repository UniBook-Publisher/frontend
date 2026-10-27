import type { components } from '@/shared/api/schema';

export type Role = NonNullable<components['schemas']['AuthResponse']['role']>;
