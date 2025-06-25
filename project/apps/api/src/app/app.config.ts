export enum ApplicationServiceURL {
  Users = "http://localhost:3001/api/auth",
  Blog = "http://localhost:3002/api/posts",
  FileVault = "http://localhost:3003/api/files",
  Notification = "http://localhost:3004/api/notifications",
}

export const HTTP_CLIENT_MAX_REDIRECTS = 5;
export const HTTP_CLIENT_TIMEOUT = 3000;
    