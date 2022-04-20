<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag !== 'textarea'"
      type="text"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      :value="inputRef.val"
      @blur="validateInput"
      @input="updateValue"
      v-bind="$attrs"
    />
    <textarea
      v-else
      type="text"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      :value="inputRef.val"
      @blur="validateInput"
      @input="updateValue"
      v-bind="$attrs"
    />
    <span v-if="inputRef.error" class="invalid-feedback">
      {{ inputRef.message }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted } from 'vue'
import { emitter } from './ValidateForm.vue'

const emailReg =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface limitProp {
  message: string
  length: number
}
interface RuleProp {
  type: 'required' | 'email' | 'range'
  message?: string
  min?: limitProp
  max?: limitProp
}
export type RulesProp = RuleProp[]
export type TagType = 'oninput' | 'textarea'
export default defineComponent({
  name: 'ValidateInput',
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false,
  setup(props, context) {
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })
    const updateValue = (e: KeyboardEvent) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }
    // 判断字符串长度是否在 range 范围内
    const isInRange = (rule: RuleProp) => {
      let rangeFlag = true
      if (rule.min) {
        const minLen = rule.min.length
        if (inputRef.val.length < minLen) {
          inputRef.message = rule.min.message
          rangeFlag = false
        }
      }
      if (rule.max) {
        console.log('max')
        const maxLen = rule.max.length
        if (inputRef.val.length > maxLen) {
          console.log('max')
          inputRef.message = rule.max.message
          rangeFlag = false
        }
      }
      return rangeFlag
    }
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every((rule) => {
          let passed = true
          if (rule.message) {
            inputRef.message = rule.message
          }
          switch (rule.type) {
            case 'required':
              passed = inputRef.val.trim() !== ''
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'range':
              passed = isInRange(rule)
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    // 清空 inputRef
    const clearInput = () => {
      inputRef.val = ''
    }
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
      emitter.emit('form-item-clear', clearInput)
    })
    return {
      inputRef,
      validateInput,
      updateValue,
      clearInput
    }
  }
})
</script>

<style scoped></style>
