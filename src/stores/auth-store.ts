import { QueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { User, UserRole } from "../types/user";
import { LoginPayload, RegisterPayload } from "../types/auth";
import { Founder } from "../types/founder";
import { Investor } from "../types/investor";

export class AuthStore {
  token: string | null = localStorage.getItem("auth_token");
  user: User | null = JSON.parse(localStorage.getItem("user") || "null");
  role: UserRole | null = localStorage.getItem("user_role") as UserRole;
  queryClient: QueryClient;
  isAuthenticated: boolean = false;
  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  constructor(queryClient: QueryClient) {
    makeAutoObservable(this);
    this.queryClient = queryClient;
  }

  get IsAuthenticated() {
    return !!this.token && !!this.user;
  }

  get BaseUrl() {
    return this.baseUrl;
  }

  get Token() {
    return this.token;
  }

  get User(): Founder | Investor | null {
    return this.user;
  }

  get Role() {
    return this.role;
  }

  setAuth(token: string, user: User, role: UserRole) {
    runInAction(() => {
      this.token = token;
      this.user = user;
      this.role = role;
      this.isAuthenticated = true;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("user_role", role);
    });
  }

  logout() {
    this.token = null;
    this.user = null;
    this.role = null;
    this.isAuthenticated = false;
    localStorage.clear();
  }

  async signUp(payload: RegisterPayload): Promise<User | null> {
    try {
      const res: AxiosResponse<User> = await axios.post(
        `${this.baseUrl}users/register`,
        payload
      );
      return res.data;
    } catch (error) {
      console.error("Signup failed:", error);
      return null;
    }
  }

  async loginUser(payload: LoginPayload): Promise<User | null> {
    try {
      const res: AxiosResponse<{ user: User; token: string }> =
        await axios.post(`${this.baseUrl}users/login`, payload);
      const userData = res.data;
      runInAction(() => {
        this.setAuth(userData.token, userData.user, payload.role);
      });
      return userData.user;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  }

  clearStore() {
    this.logout();
  }
}
