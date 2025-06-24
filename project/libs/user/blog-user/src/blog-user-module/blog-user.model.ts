import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'accounts',
  timestamps: true,
})
export class BlogUserModel extends Document {
  @Prop({
    required: true,
  })
  public firstname: string;

  @Prop({
    required: true,
  })
  public lastname: string;

  @Prop({
    required: true,
    unique: true,
  })
  public email: string;

  @Prop({
    required: false,
  })
  public avatar: string;

  @Prop({
    required: true,
  })
  public createAt: Date;

  @Prop({
    required: true,
  })
  public passwordHash: string;

  @Prop({
    type: [Types.ObjectId],
    ref: 'BlogUserModel',
    default: []
  })
  public subscriptions: Types.ObjectId[];

  @Prop({
    required: true,
    default: 0
  })
  public subscribersCount: number;
}

export const BlogUserSchema = SchemaFactory.createForClass(BlogUserModel);