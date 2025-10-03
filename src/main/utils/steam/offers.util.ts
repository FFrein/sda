import { IactOnConfirmationParam, IMobileConfirmation, ITradeOffer } from '@main/models/api'
import { maFiles, users } from '@main/store/store'
import { sendNotify } from '../notify.util'
import TradeOfferManager from 'steam-tradeoffer-manager'
import SteamTotp from 'steam-totp'

// Trade Offers
export const getTradeOffers = async (login: string): Promise<ITradeOffer[]> => {
  try {
    if (!users[login]?.manager) throw new Error('user dont have manager')
    const { manager } = users[login]

    console.log('getTradeOffers', login)

    return new Promise((resolve, reject) => {
      manager.getOffers(TradeOfferManager.EOfferFilter.ActiveOnly, (err, body) => {
        if (err) return reject(err)

        const offers = body?.response?.trade_offers_received ?? []
        console.log(body?.response)
        resolve(offers)
      })
    })
  } catch (e) {
    sendNotify(`${e}`)
    return []
  }
}

export const acceptTradeOffer = (login: string, tradeOfferId: string): Promise<unknown> => {
  const { manager, community } = users[login]

  return new Promise((resolve, reject) => {
    manager.acceptOffer(tradeOfferId, (err, status) => {
      if (err) {
        reject({ text: 'Ошибка принятия предложения:', err })
        return
      }
      resolve(`Предложение ${tradeOfferId} принято, статус: ${status}`)

      community.acceptConfirmationForObject(maFiles[login].shared_secret, tradeOfferId, (err) => {
        if (err) {
          reject({ text: 'Ошибка подтверждения сделки:', err })
        } else {
          resolve('Сделка подтверждена мобильным аутентификатором!')
        }
      })
    })
  })
}

export const getMobileConfirmations = async (login: string): Promise<IMobileConfirmation[]> => {
  try {
    if (!users[login]?.community) throw new Error('user dont have community')
    const { community } = users[login]
    const maFile = maFiles[login]

    return new Promise((resolve, reject) => {
      const time = Math.floor(Date.now() / 1000)
      const confKey = SteamTotp.getConfirmationKey(maFile.identity_secret, time, 'conf')

      community.getConfirmations(time, confKey, (err, confirmations) => {
        if (err) return reject(err)

        resolve(confirmations || [])
      })
    })
  } catch (e) {
    sendNotify(`${e}`)
    return [] as IMobileConfirmation[]
  }
}

export const actOnConfirmation = async (data: IactOnConfirmationParam): Promise<boolean> => {
  try {
    const { login, confirmationId, type } = data

    const community = users[login].community
    const maFile = maFiles[login]

    const time = Math.floor(Date.now() / 1000)

    if (!community) throw new Error('user dont have community')

    return new Promise((resolve, reject) => {
      const confKey = SteamTotp.getConfirmationKey(maFile.identity_secret, time, 'conf')

      community.getConfirmations(time, confKey, (err, confirmations) => {
        if (err) return reject(err)

        const confirmation = confirmations.find((c: any) => c.id === confirmationId)
        if (!confirmation) return reject(new Error('confirmation not found'))

        const allowKey = SteamTotp.getConfirmationKey(maFile.identity_secret, time, 'allow')

        community.respondToConfirmation(
          confirmation.id,
          confirmation.key,
          time,
          allowKey,
          type,
          (err) => {
            if (err) return reject(err)
            resolve(true)
          }
        )
      })
    })
  } catch (e) {
    sendNotify(`${e}`)
    return false
  }
}
