export interface IAccountOptions {
  login: string
  password?: string
  img?: File
}

export interface IGuardCode {
  code: string
  ttl: number
}

export interface ITradeOffer {
  tradeofferid: string
}

export type AccountOptionRecords = Record<string, IAccountOptions>
