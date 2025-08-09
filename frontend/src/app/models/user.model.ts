export interface User {
  user_email: string;
  user_pwd: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    uuid: string;
    email: string;
    createdAt: string;
  };
}

export interface LoginResponse {
  message: string;
  token: string;
}
