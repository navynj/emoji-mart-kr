// @ts-nocheck
import { Store } from '../helpers'

const DEFAULTS = [
  'moneybag',
  'money_with_wings',
  'rice',
  'house',
  'shopping_trolley',
  'shopping_bags',
  'coffee',
  'cookie',
  'stethoscope',
  'dollar',
  'bank',
  'credit_card'
]

let Index: any | null = null

function add(emoji: { id: string }) {
  Index || (Index = Store.get('frequently') || {})

  const emojiId = emoji.id || emoji
  if (!emojiId) return

  Index[emojiId] || (Index[emojiId] = 0)
  Index[emojiId] += 1

  Store.set('last', emojiId)
  Store.set('frequently', Index)
}

function get({ maxFrequentRows, perLine }) {
  if (!maxFrequentRows) return []

  Index || (Index = Store.get('frequently'))
  let emojiIds = []

  if (!Index) {
    Index = {}

    for (let i in DEFAULTS.slice(0, perLine)) {
      const emojiId = DEFAULTS[i]

      Index[emojiId] = perLine - i
      emojiIds.push(emojiId)
    }

    return emojiIds
  }

  const max = maxFrequentRows * perLine
  const last = Store.get('last')

  for (let emojiId in Index) {
    emojiIds.push(emojiId)
  }

  emojiIds.sort((a, b) => {
    const aScore = Index[b]
    const bScore = Index[a]

    if (aScore == bScore) {
      return a.localeCompare(b)
    }

    return aScore - bScore
  })

  if (emojiIds.length > max) {
    const removedIds = emojiIds.slice(max)
    emojiIds = emojiIds.slice(0, max)

    for (let removedId of removedIds) {
      if (removedId == last) continue
      delete Index[removedId]
    }

    if (last && emojiIds.indexOf(last) == -1) {
      delete Index[emojiIds[emojiIds.length - 1]]
      emojiIds.unshift(last)
    }

    Store.set('frequently', Index)
  }

  return emojiIds
}

export default { add, get, DEFAULTS }
