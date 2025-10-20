import { z } from 'zod';

/**
 * Schema for validating flag keys
 * Rules:
 * - Required
 * - Max 100 characters
 * - Can only contain letters, numbers, underscores, and hyphens
 */
export const flagKeySchema = z.string()
    .min(1, 'Key is required')
    .max(100, 'Key must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Key can only contain letters, numbers, underscores, and hyphens');

/**
 * Schema for validating flag values
 * Rules:
  * - Max 1000 characters
 */
export const flagValueSchema = z.string()
    .max(1000, 'Value must not exceed 1000 characters');

/**
 * Schema for validating a complete flag (key-value pair)
 */
export const flagSchema = z.object({
    key: flagKeySchema,
    value: flagValueSchema,
});

export type FlagInput = z.infer<typeof flagSchema>;

