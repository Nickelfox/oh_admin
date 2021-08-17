export interface Auth {
  loggedIn: boolean;
  token: string;
  session_id: string;
  errorMessage?: string;
  isLoading?: boolean;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {

}
