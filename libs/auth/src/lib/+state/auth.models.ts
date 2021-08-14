/**
 * Interface for the 'Auth' data
 */
export interface AuthEntity {
  id: string | number; // Primary ID
  name: string;
}

export interface Auth {
  loggedIn: boolean;
  token: string;
  session_id: string;
  errorMessage?: string;
  isLoading?: boolean;
}
