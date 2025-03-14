<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const inputValue = ref<any>(null)
onMounted(() => {
  inputValue.value = props.userSelect
})

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  userSelect: {
    type: [Number, String]
  },
  withIcon: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'text'
  }
})

const emit = defineEmits<{
  (e: 'updateList', value: string): void
  (e: 'updateItem', value: number): void
  (e: 'focus'): void
  (e: 'close'): void
}>()

const handelInput = (event: Event): void => {
  const target = event.target as HTMLTextAreaElement
  emit('updateList', target.value)
}

const handelClose = (): void => {
  emit('close')
  inputValue.value = ''
}


const handleClickOutside = (): void => {
  console.log('handleClickOutside')
}
watch(
  () => props.userSelect,
  () => {
    inputValue.value = props.userSelect
  }
)

watch(
  () => props.userSelect,
  () => {
    inputValue.value = props.userSelect
  }
)

watch(
  () => inputValue.value,
  () => {
    if (props.type === 'number') emit('updateItem', inputValue.value)
  }
)
</script>

<template>
  <div class="base-input" v-click-outside="handleClickOutside">
    <span class="base-input__label">{{ label }}</span>
    <div class="base-input__wrapper">
      <input
        class="base-input__wrapper-input"
        v-model="inputValue"
        min="1"
        :type="type"
        :placeholder="placeholder"
        @input="handelInput"
        @focus="$emit('focus')"
      />
      <span
        v-if="withIcon"
        class="base-input__wrapper-close"
        :class="{ hide: !inputValue }"
        @click="handelClose"
        >X</span
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-input {
  &__wrapper {
    position: relative;

    cursor: pointer;

    &-input {
      background: white;
      color: gray;
      border: 0;
      border-radius: 4px;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 8px 12px;
      font-size: 16px;
      line-height: 26px;
      width: 100%;
      box-sizing: border-box;
    }

    &-close {
      position: absolute;
      right: 0px;
      top: 0;
      bottom: 0;
      width: 18px;
      height: 18px;
      color: gray;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 12px 8px;

      &.hide {
        display: none;
      }
    }
  }
}
</style>
