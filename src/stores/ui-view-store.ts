import { makeAutoObservable, runInAction } from "mobx";
import { UserRole } from "../types/user";

export class UiViewStore {
  _toggleUserRoleForLogin: UserRole = "founder";
  _editStartUpProfileModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  get UserRoleForLogin() {
    return this._toggleUserRoleForLogin;
  }

  toggleUserRoleForLogin(value: UserRole) {
    runInAction(() => {
      this._toggleUserRoleForLogin = value;
    });
  }

  get EditStartUpProfileModal() {
    return this._editStartUpProfileModal;
  }

  toggleEditStartUpProfile(value: boolean) {
    runInAction(() => {
      this._editStartUpProfileModal = value;
    });
  }
}
