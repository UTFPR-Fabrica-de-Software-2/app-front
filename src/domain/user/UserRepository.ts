import type { AxiosPromise } from 'axios'
import BaseRepository from '@/domain/base/BaseRepository'
import UserModel from '@/domain/user/UserModel'
import type UserMeResInterface from '@/domain/user/types/res/UserMeResInterface'

export default class UserRepository extends BaseRepository {
  protected _model = new UserModel()

  me(): AxiosPromise<UserMeResInterface> {
    return this._httpClient.getBackClient().get(`/${this._model.name}/me`)
  }
}
