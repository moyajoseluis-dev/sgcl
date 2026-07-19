export class LoginResponseDto {
  accessToken!: string;
  tokenType!: string;
  expiresIn!: number;
  username!: string;
  role!: string; // <--- AGREGA ESTA LÍNEA
}