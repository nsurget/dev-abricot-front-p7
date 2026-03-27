"use client";

import { useRef } from "react";
import { useAuthStore } from "@/store/authStore";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthStoreInitializerProps {
  user: User | null;
  token: string | null;
}

export default function AuthStoreInitializer({ user, token }: AuthStoreInitializerProps) {
  const initialized = useRef(false);

  if (!initialized.current) {
    if (user && token) {
      useAuthStore.setState({ user, token, isAuthenticated: true });
    } else {
      // Si on n'a rien sur le serveur, on s'assure que le store est à jour (checkAuth côté client au cas où)
      // Mais normalement le serveur est la source de vérité ici
      useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    }
    initialized.current = true;
  }

  return null;
}
