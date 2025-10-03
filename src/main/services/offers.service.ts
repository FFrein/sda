import { IactOnConfirmationParam, IMobileConfirmation, ITradeOffer } from '@main/models/api'
import * as OffersUtils from '@main/utils/steam/offers.util'

export const getTradeOffers = async (login: string): Promise<ITradeOffer[]> => {
  return OffersUtils.getTradeOffers(login)
}

export const acceptTradeOffer = async (login: string, tradeOfferId: string): Promise<void> => {
  await OffersUtils.acceptTradeOffer(login, tradeOfferId)
}

export const getMobileConfirmations = async (login: string): Promise<IMobileConfirmation[]> => {
  return await OffersUtils.getMobileConfirmations(login)
}

export const actOnConfirmation = async (data: IactOnConfirmationParam): Promise<void> => {
  await OffersUtils.actOnConfirmation(data)
}
