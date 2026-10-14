export type User = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type Credentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: User;
};
