"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import React from "react";
import Toast from "@/components/ui/Toast";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
interface LoginFormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const router = useRouter();

  const login = useAuthStore((state) => state.login);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/auth/register", {
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data;
      login(token, user);

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("SignIn error:", err);
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : undefined;
      setError(
        message || "Erreur lors de l'inscription. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-stretch overflow-hidden">
      {/* Background Image Container */}
      <div className="hidden lg:block absolute inset-0 z-0">
        <Image
          src="/signin-hero.jpg"
          alt="Sign In Hero"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Mobile-only background */}
      <div className="lg:hidden absolute inset-0 z-0">
        <Image
          src="/signin-hero.jpg"
          alt="Sign In Hero"
          fill
          className="object-cover opacity-20"
        />
      </div>

      {/* Sign In Card Panel */}
      <section className="relative z-10 bg-neutral-grey-50 w-full max-w-[562px] min-h-screen flex flex-col items-center justify-between px-6 py-10 md:px-[100px] lg:px-[140px] md:py-[55px] shadow-2xl overflow-y-auto">
        <div className="w-full flex flex-col items-center gap-[60px] md:gap-[150px] lg:gap-[202px]">
          <Logo width={252} height={32} />

          <div className="w-full flex flex-col gap-[30px] items-center">
            <h1 className="font-manrope font-bold text-[32px] md:text-[40px] text-brand-orange leading-tight text-center">
              Inscription
            </h1>

            {error && (
              <Toast type="error" message={error} />
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-6 md:gap-[29px]"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="font-inter text-sm text-neutral-grey-800 font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  {...register("email", {
                    required: "L'email est requis",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Adresse email invalide",
                    },
                  })}
                  className={`w-full h-[53px] px-[17px] bg-white border ${errors.email ? "border-red-500" : "border-neutral-grey-200"
                    } rounded-[4px] focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange ring-offset-0 transition-all font-inter text-black`}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">
                    {errors.email.message as string}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="font-inter text-sm text-neutral-grey-800 font-medium"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Le mot de passe est requis",
                    minLength: {
                      value: 6,
                      message: "Le mot de passe doit faire au moins 6 caractères",
                    },
                  })}
                  className={`w-full h-[53px] px-[17px] bg-white border ${errors.password
                      ? "border-red-500"
                      : "border-neutral-grey-200"
                    } rounded-[4px] focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange ring-offset-0 transition-all font-inter text-black`}
                />
                {errors.password && (
                  <span className="text-red-500 text-xs">
                    {errors.password.message as string}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[21px] items-center mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-[50px] bg-neutral-grey-800 hover:bg-black text-white font-inter font-semibold rounded-[10px] transition-all cursor-pointer transform active:scale-[0.98] ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? "Inscription..." : "S’inscrire"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full flex flex-wrap justify-center items-center gap-2 mt-12 md:mt-8 font-inter text-sm pb-4">
          <span className="text-neutral-grey-800">Déjà inscrit ?</span>
          <Link
            href="/login"
            className="text-brand-orange underline hover:text-opacity-80 transition-all font-semibold"
          >
            Se connecter
          </Link>
        </div>
      </section>
    </main>
  );
}
