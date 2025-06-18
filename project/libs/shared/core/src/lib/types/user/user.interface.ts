export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createAt: Date;
  publicationsCount: number;
  subscribersCount: number;
}
