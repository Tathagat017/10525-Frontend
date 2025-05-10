import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import {
  StartUpProfile,
  StartUpProfilePayload,
} from "../types/start-up-profile";
import { notifications } from "@mantine/notifications";
import { User } from "../types/user";

export class FounderStore {
  queryClient: QueryClient;
  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    makeAutoObservable(this);
  }

  private loadTokenFromLocalStorage(): string | null {
    return localStorage.getItem("auth_token") ?? null;
  }

  private loadUserFromLocalStorage(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
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

  async createProfile(payload: StartUpProfilePayload) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<StartUpProfile>(
        `${this.baseUrl}startupProfile`,
        payload,
        this.authHeaders
      );
      runInAction(() => {
        //
      });
      this.queryClient.invalidateQueries({ queryKey: ["startup-profile"] });
      notifications.show({
        title: "Success",
        message: "Startup profile created!",
        color: "green",
      });
      return data;
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create startup profile",
        color: "red",
      });
      throw error;
    }
  }

  async getProfile() {
    const user = this.loadUserFromLocalStorage();
    if (!user) {
      throw new Error("User not found in local storage");
    }
    const founderId = user._id;
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.get<{ profile: StartUpProfile }>(
        `${this.baseUrl}startupProfile/founder/${founderId}`,
        this.authHeaders
      );
      runInAction(() => {
        //
      });
      return data.profile;
    } catch (error) {
      console.error("Failed to fetch profile", error);
      return null;
    }
  }

  async updateProfile(payload: StartUpProfile) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.put<StartUpProfile>(
        `${this.baseUrl}founder/profile`,
        payload,
        this.authHeaders
      );
      runInAction(() => {
        //
        this.queryClient.invalidateQueries({ queryKey: ["startup-profile"] });
      });
      notifications.show({
        title: "Updated",
        message: "Profile updated successfully!",
        color: "blue",
      });
      return data;
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Update failed",
        color: "red",
      });
      throw error;
    }
  }
}
