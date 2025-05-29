import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignUpSchema = z.infer<typeof signUpSchema>

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInSchema = z.infer<typeof signInSchema>

const signOutSchema = z.object({
  user_id: z.string().uuid(),
});

type SignOutSchema = z.infer<typeof signOutSchema>

const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});

type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>

export {
  signUpSchema,
  SignUpSchema,
  signInSchema,
  SignInSchema,
  signOutSchema,
  SignOutSchema,
  refreshTokenSchema,
  RefreshTokenSchema,
}