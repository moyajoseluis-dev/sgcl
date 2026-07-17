export interface LoginResponse {
  token: string;
  expiration: string; // Fecha en formato ISO 8601
}