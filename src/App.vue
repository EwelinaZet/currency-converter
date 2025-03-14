<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { currencyStore } from './store/index'
import BaseInput from './components/base/BaseInput.vue'
import BaseDropdown from './components/base/BaseDropdown.vue'
import type { CurrencyType } from './models/CurrencyType'

const storeCurrency = currencyStore()

const currency = ref<Array<CurrencyType> | []>([])
const currencyDropdownList = ref<Array<CurrencyType> | []>([])

onMounted(async () => {
  await storeCurrency.getCurrencyData()
  if (storeCurrency?.currency?.data && !storeCurrency?.currency?.pendingApiCall){
    currency.value = storeCurrency.currency?.data
    currencyDropdownList.value = storeCurrency.currency?.data
  }
})

const updateList = (value: string) => {
  if (!value) {
    return (currencyDropdownList.value = currency.value)
  } else {
    return (currencyDropdownList.value = currency.value.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    ))
  }
}

const fromCurrency = ref<CurrencyType | null>(null)

const selectFromCurrency = (value: string) => {
  fromCurrency.value = currencyDropdownList.value.find((item) => item.name === value) || null
}

const toCurrency = ref<CurrencyType |  null>(null)

const selectToCurrency = (value: string) => {
  toCurrency.value = currencyDropdownList.value.find((item) => item.name === value) || null
}

const amount = ref<number>(1)

const updateAmount = (value: number): void => {
  amount.value = value || 1
}

const showConversion = computed((): boolean => {
  return (
    !!amount.value &&
    !!fromCurrency.value &&
    !!toCurrency.value
  )
})

watch(
  () => [amount.value, fromCurrency.value, toCurrency.value],
  () => {
    if (showConversion.value) getConvertedValue()
  }
)

const convertedValue = ref<string>('')

const getConvertedValue = async (): Promise<void> => {
  if(fromCurrency?.value && toCurrency.value){
    await storeCurrency.getConvertedValue(
    fromCurrency.value.short_code,
    toCurrency.value.short_code,
    amount.value
  )
  convertedValue.value = storeCurrency.conversion?.data || ''
  }
}
</script>

<template>
  <div class="currency-converter">
    <div class="currency-converter__action">
      <BaseInput
        label="Amount"
        type="number"
        :withIcon="false"
        :userSelect="amount"
        @updateItem="updateAmount"
      />
      <BaseDropdown
        placeholder="Type to search..."
        label="From"
        :userSelect="fromCurrency?.name"
        :itemList="currencyDropdownList"
        @updateList="updateList"
        @selectItem="selectFromCurrency"
      />
      <BaseDropdown
        placeholder="Type to search..."
        label="To"
        :userSelect="toCurrency?.name"
        :itemList="currencyDropdownList"
        @updateList="updateList"
        @selectItem="selectToCurrency"
      />
    </div>

    <div class="currency-converter__wrapper">
      <div v-if="fromCurrency && toCurrency" class="currency-converter__conversion">
        <div class="currency-converter__conversion-header">
          {{ amount }}{{ fromCurrency.symbol }} =
        </div>
        <div class="currency-converter__conversion-value">
          {{ convertedValue }}{{ toCurrency.symbol }}
        </div>
      </div>
      <div v-else  class="currency-converter__info">
        Select currencies to check foreign currency exchange rates.
      </div>
    </div>
    
  </div>
</template>

<style lang="scss" scoped>
.currency-converter {
  &__action {
    display: flex;
    flex-direction: column;
    gap: 20px;


    @media screen and (min-width: 650px) {
      flex-direction: row;
    }
  }

  &__wrapper {
    width: 100%;
    border: 0;
    border-radius: 4px;
    background: white;
    color: gray;
    margin-top: 25px;
    padding: 24px 0;
    font-size: 16px;

    @media screen and (min-width: 650px) {
      font-size: 24px;
    }
  }

  &__conversion {
    display: flex;
    flex-direction: row;

    &-header {
      margin: 0 5px 0 24px;
    }
  }

  &__info {
    margin: 0 24px;
  }
}
</style>
