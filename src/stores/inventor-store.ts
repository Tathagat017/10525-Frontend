import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { StartUpProfile } from "../types/start-up-profile";
import { User } from "../types/user";

export class InventorStore {
  allStartUpProfiles: StartUpProfile[] = [];
  queryClient: QueryClient;
  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    makeAutoObservable(this);
  }

  private loadTokenFromLocalStorage(): string | null {
    return localStorage.getItem("auth_token") ?? null;
  }

  private get authHeaders() {
    const token = this.loadTokenFromLocalStorage();
    if (!token) {
      return null;
    }
    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};
  }

  async getAllProfiles() {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.get<{ profile: StartUpProfile[] }>(
        `${this.baseUrl}startupProfile`,
        this.authHeaders
      );
      runInAction(() => {
        this.allStartUpProfiles = data.profile;
      });
      return data.profile;
    } catch (error) {
      console.error("Failed to fetch profile", error);
      return null;
    }
  }

  async getAllUsers() {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.get<User[]>(
        `${this.baseUrl}users/all`,
        this.authHeaders
      );
      return data;
    } catch (error) {
      console.error("Failed to fetch profile", error);
      return null;
    }
  }
}
