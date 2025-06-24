import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseMongoRepository } from '@project/data-access';

import { BlogUserEntity } from './blog-user.entity';
import { BlogUserFactory } from './blog-user.factory';
import { BlogUserModel } from './blog-user.model';
import { Model } from 'mongoose';

@Injectable()
export class BlogUserRepository extends BaseMongoRepository<BlogUserEntity, BlogUserModel> {
  constructor(
    entityFactory: BlogUserFactory,
    @InjectModel(BlogUserModel.name) blogUserModel: Model<BlogUserModel>
  ) {
    super(entityFactory, blogUserModel);
  }

  public async findByEmail(email: string): Promise<BlogUserEntity | null> {
    const document = await this.model.findOne({ email }).exec();
    return this.createEntityFromDocument(document);
  }

  public async addSubscription(subscriberId: string, publisherId: string): Promise<void> {
    await this.model.updateOne(
      { _id: subscriberId },
      { $addToSet: { subscriptions: publisherId } }
    ).exec();
  }

  public async removeSubscription(subscriberId: string, publisherId: string): Promise<void> {
    await this.model.updateOne(
      { _id: subscriberId },
      { $pull: { subscriptions: publisherId } }
    ).exec();
  }

  public async updateSubscribersCount(publisherId: string, increment: boolean): Promise<void> {
    const update = increment ? { $inc: { subscribersCount: 1 } } : { $inc: { subscribersCount: -1 } };
    await this.model.updateOne({ _id: publisherId }, update).exec();
  }
}