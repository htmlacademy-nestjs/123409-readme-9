import { PrismaClientService } from '@project/blog-models';
import { Entity, StorableEntity, EntityFactory } from '@project/core';
import { Repository } from './repository.interface';

export abstract class BasePostgresRepository<
T extends Entity & StorableEntity<ReturnType<T['toPOJO']>>,
DocumentType = ReturnType<T['toPOJO']>
> implements Repository<T> {

  constructor(
    protected entityFactory: EntityFactory<T>,
    protected readonly client: PrismaClientService,
  ) {}

  protected createEntityFromDocument(document: DocumentType): T {
    return this.entityFactory.create(document as ReturnType<T['toPOJO']>);
  }

  public async findById(id: T['id']): Promise<T> {
    throw new Error('Not implemented');
  }

  public async save(entity: T): Promise<T> {
    throw new Error('Not implemented');
  }

  public async update(entity: T): Promise<void> {
    throw new Error('Not implemented');
  }

  public async deleteById(id: T['id']): Promise<void> {
    throw new Error('Not implemented');
  }
}