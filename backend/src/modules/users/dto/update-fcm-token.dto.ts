import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateFcmTokenDto {
  @ApiProperty({ example: 'fcm_token_example' })
  @IsString()
  fcmToken: string;
}
