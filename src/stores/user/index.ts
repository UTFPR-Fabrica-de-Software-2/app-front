import { defineStore } from 'pinia'

import UserService from '@/domain/user/UserService'
import type UserMeResInterface from '@/domain/user/types/res/UserMeResInterface'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserMeResInterface['me'] | null,
  }),

  actions: {
    async actMe(): Promise<UserMeResInterface> {
      const USER_SERVICE = new UserService()

      try {
        const { data } = await USER_SERVICE.me()
        this.user = data.me || null
        return data
      } catch (err) {
        throw err
      }
    },
  },
})
