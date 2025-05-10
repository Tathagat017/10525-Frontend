import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { InvestmentOffer } from "../types/funding";
import { User } from "../types/user";
import { QueryClient } from "@tanstack/react-query";

export class InvestmentOfferStore {
  offers: InvestmentOffer[] = [];
  queryClient: QueryClient;
  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;
  constructor(queryClient: QueryClient) {
    makeAutoObservable(this);
    this.queryClient = queryClient;
  }

  private loadTokenFromLocalStorage(): string | null {
    return localStorage.getItem("auth_token") ?? null;
  }

  private loadUserFromLocalStorage(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  private loadRoleFromLocalStorage(): string | null {
    return localStorage.getItem("user_role") ?? null;
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

  async fetchOffersForCurrentUser() {
    try {
      const user = this.loadUserFromLocalStorage();

      if (!user || !this.authHeaders) {
        return;
      }
      const userId = user._id;
      const role = this.loadRoleFromLocalStorage();

      if (!userId || !role) {
        throw new Error("User not authenticated");
      }

      let url = "";
      if (role === "founder") {
        url = `${this.baseUrl}investment-offers/founder/${userId}`;
      } else if (role === "investor") {
        url = `${this.baseUrl}investment-offers/investor/${userId}`;
      } else {
        throw new Error("Invalid user role");
      }

      const { data } = await axios.get<InvestmentOffer[]>(
        url,
        this.authHeaders
      );
      runInAction(() => {
        this.offers = data;
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error fetching investment offers:", err.message);
      throw new Error("Failed to fetch investment offers");
    }
  }

  async acceptOffer(offerId: string) {
    try {
      if (!this.authHeaders) {
        throw new Error("Unauthorized: No auth token found");
      }

      const url = `${this.baseUrl}investment-offers/${offerId}/accept`;
      const { data } = await axios.put(url, {}, this.authHeaders);

      // Update the offer in local store
      runInAction(() => {
        const index = this.offers.findIndex((o) => o._id === offerId);
        if (index !== -1) {
          this.offers[index] = data.offer;
        }
      });

      return data.offer;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error accepting investment offer:", err.message);
      throw new Error(err.response?.data?.message || "Failed to accept offer");
    }
  }
}
