<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
type ValidateFunc = () => boolean
type ClearFunc = () => void
type Events = {
  'form-item-created': ValidateFunc
  'form-item-clear': ClearFunc
}
export const emitter = mitt<Events>()
export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup(props, context) {
    let ValidateFuncArr: ValidateFunc[] = []
    let clearFuncArr: ClearFunc[] = []
    const submitForm = () => {
      const result = ValidateFuncArr.map((func) => func()).every(
        (result) => result
      )
      clearFuncArr.map((func) => func())
      context.emit('form-submit', result)
    }
    const ValidateCB = (func: ValidateFunc) => {
      ValidateFuncArr.push(func)
    }
    const clearCB = (func: ClearFunc) => {
      clearFuncArr.push(func)
    }
    emitter.on('form-item-created', ValidateCB)
    emitter.on('form-item-clear', clearCB)
    onUnmounted(() => {
      emitter.off('form-item-created', ValidateCB)
      emitter.off('form-item-created', clearCB)
      ValidateFuncArr = []
      clearFuncArr = []
    })
    return {
      submitForm
    }
  }
})
</script>

<style scoped></style>
