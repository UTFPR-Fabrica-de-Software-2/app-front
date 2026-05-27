import type { AxiosPromise } from 'axios'

import UserRepository from '@/domain/user/UserRepository'
import type UserMeResInterface from '@/domain/user/types/res/UserMeResInterface'

export default class UserService {
  constructor(private _repository: UserRepository = new UserRepository()) {}

  me(): AxiosPromise<UserMeResInterface> {
    return this._repository.me()
  }
}
