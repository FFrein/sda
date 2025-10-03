export interface IAccountOptions {
  login: string
  password?: string
  img?: File
  refreshToken?: string
}

export interface IGuardCode {
  code: string
  ttl: number
}

export interface ITradeOffer {
  tradeofferid: string
}

export interface IMobileConfirmation {
  id: string
  type: number
  creator: string
  key: string
  title: string
  receiving: string
  sending: string
  time: string // ISO строка времени
  timestamp: string // ISO строка времени
  icon: string
  offerID: string
}

export interface IactOnConfirmationParam {
  login: string
  confirmationId: string
  type: boolean
}

export type AccountOptionRecords = Record<string, IAccountOptions>
