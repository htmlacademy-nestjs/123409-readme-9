import { Entity } from "@project/core";
import { StorableEntity, AuthUser } from "@project/core";

export class BlogUserEntity extends Entity implements StorableEntity<AuthUser> {
  public email: string;
  public name: string;
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
    this.name = user.name;
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
      name: this.name,
      avatar: this.avatar,
      createAt: this.createAt,
      publicationsCount: this.publicationsCount,
      subscribersCount: this.subscribersCount,
      passwordHash: this.passwordHash,
    };
  }
}
