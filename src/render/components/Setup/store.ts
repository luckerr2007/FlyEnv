import { defineStore } from 'pinia'

interface State {
  tab: string
}

const state: State = {
  tab: 'base'
}

export const SetupStore = defineStore('setup', {
  state: (): State => state,
  getters: {},
  actions: {
    init() {
      return Promise.resolve()
    }
  }
})
