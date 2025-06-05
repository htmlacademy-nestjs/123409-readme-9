import { Document, Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

import { Entity, StorableEntity, EntityFactory } from '@project/core';
import { Repository } from './repository.interface';

export abstract class BaseMongoRepository<
  T extends Entity & StorableEntity<ReturnType<T['toPOJO']>>,
  DocumentType extends Document
> implements Repository<T> {

  constructor(
    protected entityFactory: EntityFactory<T>,
    protected readonly model: Model<DocumentType>,
  ) {}


  protected createEntityFromDocument(document: DocumentType | null): T | null {
    if (! document) {
      return null;
    }

    const plainObject = document.toObject({ versionKey: false }) as ReturnType<T['toPOJO']>;
    return this.entityFactory.create(plainObject);
  }

  public async findById(id: T['id']): Promise<T> {
    const document = await this.model.findById(id).exec();
    const entity = this.createEntityFromDocument(document);
    
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    
    return entity;
  }

  public async save(entity: T): Promise<void> {
    const newEntity = new this.model(entity.toPOJO());
    await newEntity.save();
  }

  public async update(entity: T): Promise<void> {
    const updatedDocument = await this.model.findByIdAndUpdate(
      entity.id,
      entity.toPOJO() as Partial<DocumentType>,
      { new: true, runValidators: true }
    )
      .exec();

    if (! updatedDocument) {
      throw new NotFoundException(`Entity with id ${entity.id} not found`);
    }
  }

  public async deleteById(id: T['id']): Promise<void> {
    const deletedDocument = await this.model.findByIdAndDelete(id).exec();
    if (! deletedDocument) {
      throw new NotFoundException(`Entity with id ${id} not found.`);
    }
  }
}