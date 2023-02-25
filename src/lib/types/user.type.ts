export type User = {
  id: string;
  email: string;
  isPremium: boolean;
  role: "user" | "admin";
}