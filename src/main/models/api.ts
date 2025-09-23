export interface IAccountOptions {
  login: string
  password?: string
  img?: File
}

export interface IUser {
  client: object
  community: object
  manager: object
}

export interface IGuardCode {
  code: string
  ttl: number
}

export type AccountOptionRecords = Record<string, IAccountOptions>

export type UserRecords = Record<string, IUser>
