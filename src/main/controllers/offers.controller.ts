import { IactOnConfirmationParam, IMobileConfirmation, ITradeOffer } from '@main/models/api'
import * as OffersService from '@main/services/offers.service'

export function getTradeOffers(_, login: string): Promise<ITradeOffer[]> {
  return OffersService.getTradeOffers(login)
}
export function acceptTradeOffer(
  _,
  data: { login: string; tradeOfferId: string }
): Promise<unknown> {
  return OffersService.acceptTradeOffer(data.login, data.tradeOfferId)
}

export function getMobileConfirmations(_, login: string): Promise<IMobileConfirmation[]> {
  return OffersService.getMobileConfirmations(login)
}
export function actOnConfirmation(_, data: IactOnConfirmationParam): Promise<unknown> {
  return OffersService.actOnConfirmation(data)
}
