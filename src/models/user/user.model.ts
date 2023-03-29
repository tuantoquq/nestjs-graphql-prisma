import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/models/base.model';

@ObjectType('User')
export class UserEntity extends BaseEntity {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;

  /* relation fields */
}
