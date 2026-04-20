import { z } from "zod";

export const textCardSchema = z.object({
  title: z.string().default("Hello World"),
  subtitle: z.string().default("Your subtitle here"),
  backgroundColor: z.string().default("#1a1a2e"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#7c3aed"),
});

export type TextCardProps = z.infer<typeof textCardSchema>;
