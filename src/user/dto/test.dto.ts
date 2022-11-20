import { ApiProperty } from '@nestjs/swagger';
import { TestType } from '../types/test.type';

export class TestDto {
  @ApiProperty({ type: String })
  a!: string;

  @ApiProperty({ type: String })
  b!: string;

  @ApiProperty({ type: String })
  c!: string;

  static of(data: TestType): TestDto {
    return {
      a: data.a,
      b: data.b,
      c: data.c,
    };
  }
}
