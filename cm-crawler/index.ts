import axios from 'axios'
import { checkIfS3ObjectExists, saveToS3 } from './s3'

export async function handler() {
  const priceList = await getPriceList()
  const key = createS3KeyFromDate(priceList.createdAt)
  const exists = await checkIfS3ObjectExists(key)
  if (exists === false) {
    await saveToS3(key, priceList)
  }
}

interface PriceGuide {
  idProduct: number
  avg: number | null
  low: number | null
  trend: number | null
  avg1: number | null
  avg7: number | null
  avg30: number | null
  'avg-foil'?: number | null
  'low-foil'?: number | null
  'trend-foil'?: number | null
  'avg1-foil'?: number | null
  'avg7-foil'?: number | null
  'avg30-foil'?: number | null
}

export interface PriceList {
  version: 1
  createdAt: Date
  priceGuides: PriceGuide[]
}

async function getPriceList(): Promise<PriceList> {
  return (
    await axios.get(
      'https://downloads.s3.cardmarket.com/productCatalog/priceGuide/price_guide_16.json',
    )
  ).data
}

function createS3KeyFromDate(dateString: Date): string {
  const date = new Date(dateString)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

handler()
