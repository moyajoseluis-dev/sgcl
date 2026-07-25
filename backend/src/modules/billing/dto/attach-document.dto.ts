import { IsNotEmpty, IsString } from 'class-validator';

export class AttachDocumentDto {
  @IsString()
  @IsNotEmpty()
  docType!: string; // F30, F30_1, ATTENDANCE, etc.

  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  fileUrl!: string;
}
