<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from './BaseInput.vue'

defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  itemList: {
    type: Array<any>,
    default: ''
  },
  userSelect: {
    type: String,
    default: ''
  }
})

const showList = ref<boolean>(false)

const emit = defineEmits<{
  (e: 'updateList', value: string): void
  (e: 'selectItem', value: string): void
}>()

const handelInput = (value: string): void => {
  emit('updateList', value)
}

const handleSelect = (value: string): void => {
  emit('selectItem', value)
  showList.value = false
}

const handleFocus = (): void => {
  showList.value = true
}

const handleClose = (): void => {
  showList.value = false
  emit('selectItem', '')
}
</script>

<template>
  <div class="base-dropdown">
    <BaseInput
      :placeholder="placeholder"
      :label="label"
      :userSelect="userSelect"
      @focus="handleFocus"
      @updateList="handelInput"
      @close="handleClose"
    />
    <div v-if="showList" class="base-dropdown__wrapper">
      <div v-for="(item, index) in itemList" :key="index" class="base-dropdown__wrapper-list">
        <div class="base-dropdown__wrapper-list-item" @click="handleSelect(item.name)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-dropdown {
  width: 100%;
  box-sizing: border-box;
  position: relative;

  @media screen and (min-width: 650px) {
    width: calc((100% - 40px)/3);
  }
  
  cursor: pointer;

  &__wrapper {
    overflow-y: auto;
    overflow-x: hidden;
    height: 200px;
    border-radius: 4px;
    background: white;
    color: gray;
    margin-top: 3px;
    position: absolute;
    z-index: 1;
    width: 100%;
    box-sizing: border-box;



    &-list {
      box-sizing: border-box;
      &-item {
        padding: 3px 6px;
      }
    }
  }
}
</style>
