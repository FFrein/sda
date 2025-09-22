export interface IMaFile {
  shared_secret: string
  serial_number: string
  revocation_code: string
  uri: string
  server_time: number
  account_name: string
  token_gid: string
  identity_secret: string
  secret_1: string
  status: number
  device_id: string
  fully_enrolled: boolean
  Session: {
    SessionID: string
    SteamLogin: string
    SteamLoginSecure: string
    WebCookie: string
    OAuthToken: string
    SteamID: number
  }
}
