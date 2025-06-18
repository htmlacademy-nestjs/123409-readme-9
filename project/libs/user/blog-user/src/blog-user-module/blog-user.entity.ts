import { genSalt, hash, compare } from 'bcrypt';
import { Entity } from "@project/core";
import { StorableEntity, AuthUser } from "@project/core";
import { SALT_ROUNDS } from './blog-user.constant';

export class BlogUserEntity extends Entity implements StorableEntity<AuthUser> {
  public email: string;
  public firstName: string;
  public lastName: string;
  public avatar?: string;
  public createAt: Date;
  public publicationsCount: number;
  public subscribersCount: number;
  public passwordHash: string;

  constructor(user?: AuthUser) {
    super();
    this.populate(user);
  }

  public populate(user?: AuthUser): void {
    if (!user) {
      return;
    }

    this.id = user.id ?? '';
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.avatar = user.avatar;
    this.createAt = user.createAt;
    this.publicationsCount = user.publicationsCount;
    this.subscribersCount = user.subscribersCount;
    this.passwordHash = user.passwordHash;
  }

  public toPOJO(): AuthUser {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      createAt: this.createAt,
      publicationsCount: this.publicationsCount,
      subscribersCount: this.subscribersCount,
      passwordHash: this.passwordHash,
    };
  }

  public async setPassword(password: string): Promise<BlogUserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }
}
