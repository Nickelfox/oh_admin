export interface Auth {
  loggedIn: boolean;
  token: string;
  session_id: string;
  errorMessage?: string;
  isLoading?: boolean;
}
