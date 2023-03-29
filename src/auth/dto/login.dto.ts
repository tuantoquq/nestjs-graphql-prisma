import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class LoginDto {
  @Field(() => String)
  @IsString()
  @MinLength(6)
  username: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string;
}
