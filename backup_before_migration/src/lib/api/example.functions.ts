import { z } from "zod";

export const getGreeting = async (data: { name: string }) => {
  const parsed = z.object({ name: z.string().min(1) }).parse(data);
  return {
    greeting: `Hello, ${parsed.name}!`,
    mode: import.meta.env.MODE || "development",
  };
};
