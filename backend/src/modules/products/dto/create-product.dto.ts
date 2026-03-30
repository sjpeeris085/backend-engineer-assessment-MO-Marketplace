import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, Length, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'CCTV Camera' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: 'HK-30' })
  @IsString()
  @Length(2, 50)
  model: string;

  @ApiPropertyOptional({ example: 'Wireless security camera' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 15000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}
