export interface IAccountOptions {
  login: string
  password?: string
  img?: File
  isAuth?: boolean
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

export interface IActOnConfirmationParam {
  login: string
  confirmationId: string
  type: boolean
}
