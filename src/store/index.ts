import { defineStore } from 'pinia'
import axios from 'axios'
import type { CurrencyType } from './models/CurrencyType'

const token = 'Tv9W4UzCiJKVIn4DE6PRpy5iSwrjmtKg'

export type CurrencyState = {
  currency: {
    data: Array<CurrencyType> | null
    pendingApiCall: any
  }
  conversion: {
    data: string | null
    pendingApiCall: any
  }
}

export const currencyStore = defineStore('currencyStore', {
  state: (): CurrencyState => ({
    currency: {
      data: null,
      pendingApiCall: null
    },
    conversion: {
      data: null,
      pendingApiCall: null
    }
  }),
  actions: {
    async getCurrencyData() {
      try {
        const apiCall = await axios.get(
          `https://api.currencybeacon.com/v1/currencies?api_key=${token}`
        )
        this.currency.pendingApiCall = apiCall
        const response = await apiCall
        this.currency.data = response.data.response
        return response.data
      } catch (error) {
        return false
      } finally {
        this.currency.pendingApiCall = null
      }
    },
    async getConvertedValue(from: string, to: string, amount: number) {
      try {
        const apiCall = await axios.get(
          `https://api.currencybeacon.com/v1/convert?api_key=${token}&from=${from}&to=${to}&amount=${amount}`
        )
        this.conversion.pendingApiCall = apiCall
        const response = await apiCall
        this.conversion.data = response.data.value
        return response.data
      } catch (error) {
        return false
      } finally {
        this.conversion.pendingApiCall = null
      }
    }
  }
})
