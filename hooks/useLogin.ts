import React from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export interface LoginFormData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();


  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Fonctionnalité de mot de passe oublié à venir.");
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data.data;

      // Stocker le token dans un cookie pour le proxy/middleware et axios
      Cookies.set("auth_token", token, { expires: 7, path: "/" });

      login(token, user);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.warn("Login error:", err);
      const message =
        err instanceof AxiosError ? err.response?.data?.message : undefined;
      setError(
        message ||
          "Erreur lors de la connexion. Veuillez vérifier vos identifiants."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    error,
    loading,
    onSubmit,
    handleForgotPassword,
  };
};
