export enum ApplicationServiceURL {
  Users = "http://localhost:3001/api/auth",
  Blog = "http://localhost:3002/api/posts",
  FileVault = "http://localhost:3003/api/files",
  Notification = "http://localhost:3004/api/notifications",
}

export const httpClient = {
  MAX_REDIRECTS: 5,
  TIMEOUT: 3000,
}
    