export interface IAccount {
  id: number
  name: string
  img?: File
}

export interface IGuardCode {
  code: string
  ttl: number
}
