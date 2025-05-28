export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createAt: Date;
    publicationsCount: number;
    subscribersCount: number;
  }