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

import SteamUser from 'steam-user'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'

export type SteamUser = typeof SteamUser
export type SteamCommunity = typeof SteamCommunity
export type TradeOfferManager = typeof TradeOfferManager
export interface IUser {
  client?: SteamUser
  community?: SteamCommunity
  manager?: TradeOfferManager
  sessionID: string
  cookies: string[]
}

export interface ISteamAuthData {
  sessionID: string
  cookies: string[]
}

export type IMaFileRecord = Record<string, IMaFile>

export type UserRecords = Record<string, IUser>
