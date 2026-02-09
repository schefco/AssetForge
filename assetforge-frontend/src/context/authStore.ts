import { create } from "zustand";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../types/DecodedToken";

interface User {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  notificationEmail: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  login: (token: string) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
  setUser: (u: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  isInitialized: false,

login: (token: string) => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);

    set({
      token,
      user: {
        id: Number(decoded.sub),
        email: decoded.email,
        role: decoded.role,
        firstName: "",
        lastName: "",
        notificationEmail: "",
      },
    });

    localStorage.setItem("token", token);
  } catch (err) {
    console.error("Invalid token on login:", err);
    localStorage.removeItem("token");
    set({ token: null, user: null });
  }
},

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },

  loadUser: async () => {
    const token = get().token;

    if (!token) {
      set({ isInitialized: true });
      return;
    }

    try {
      const res = await api.get("/auth/me");

      set({
        user: {
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          notificationEmail: res.data.notificationEmail,
        },
        isInitialized: true,
      });

      console.log("ME RESPONSE:", res.data);
    } catch (err) {
      console.error("Failed to load user:", err);
      localStorage.removeItem("token");
      set({
        token: null,
        user: null,
        isInitialized: true,
      });
    }
  },

  setUser: (u: User | null) => {
    set({ user: u });
  },
}));