import { genSalt, hash, compare } from 'bcrypt';
import { Entity } from "@project/core";
import { StorableEntity, AuthUser } from "@project/core";
import { SALT_ROUNDS } from './blog-user.constant';

export class BlogUserEntity extends Entity implements StorableEntity<AuthUser> {
  public email: string;
  public firstname: string;
  public lastname: string;
  public avatar?: string;
  public createAt: Date;
  public publicationsCount: number;
  public subscribersCount: number;
  public passwordHash: string;
  public subscriptions: string[];

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
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.avatar = user.avatar;
    this.createAt = user.createAt;
    this.publicationsCount = user.publicationsCount;
    this.subscribersCount = user.subscribersCount;
    this.passwordHash = user.passwordHash;
    this.subscriptions = user.subscriptions || [];
  }

  public toPOJO(): AuthUser {
    return {
      id: this.id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      avatar: this.avatar,
      createAt: this.createAt,
      publicationsCount: this.publicationsCount,
      subscribersCount: this.subscribersCount,
      passwordHash: this.passwordHash,
      subscriptions: this.subscriptions,
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

  public addSubscription(publisherId: string): void {
    if (!this.subscriptions.includes(publisherId)) {
      this.subscriptions.push(publisherId);
    }
  }

  public removeSubscription(publisherId: string): void {
    this.subscriptions = this.subscriptions.filter(id => id !== publisherId);
  }

  public isSubscribedTo(publisherId: string): boolean {
    return this.subscriptions.includes(publisherId);
  }
}
