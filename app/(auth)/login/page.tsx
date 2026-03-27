"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import Toast from "@/components/Toast";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    errors,
    error,
    loading,
    onSubmit,
    handleForgotPassword,
  } = useLogin();

  return (
    <main className="relative min-h-screen w-full flex items-stretch overflow-hidden">
      {/* Background Image Container */}
      <div className="hidden lg:block absolute inset-0 z-0">
        <Image
          src="/login-hero.jpg"
          alt="Login Hero"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Mobile-only background (or same for both if preferred) */}
      <div className="lg:hidden absolute inset-0 z-0">
        <Image
          src="/login-hero.jpg"
          alt="Login Hero"
          fill
          className="object-cover opacity-20"
        />
      </div>

      {/* Login Card Panel */}
      <section className="relative z-10 bg-neutral-grey-50 w-full max-w-[562px] min-h-screen flex flex-col items-center justify-between px-6 py-10 md:px-[100px] lg:px-[140px] md:py-[55px] shadow-2xl overflow-y-auto">
        <div className="w-full flex flex-col items-center gap-[60px] md:gap-[150px] lg:gap-[202px]">
          <Logo width={252} height={32} />

          <div className="w-full flex flex-col gap-[30px] items-center">
            <h1 className="font-manrope font-bold text-[32px] md:text-[40px] text-brand-orange leading-tight text-center">
              Connexion
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
                    value: "alice@example.com"
                  })}
                  className={`w-full h-[53px] px-[17px] bg-white border ${
                    errors.email ? "border-red-500" : "border-neutral-grey-200"
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
                    value: "password123"
                  })}
                  className={`w-full h-[53px] px-[17px] bg-white border ${
                    errors.password
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
                  className={`w-full h-[50px] bg-neutral-grey-800 hover:bg-black text-white font-inter font-semibold rounded-[10px] transition-all cursor-pointer transform active:scale-[0.98] ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </button>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-brand-orange text-sm underline font-inter hover:text-opacity-80 transition-all bg-transparent border-none cursor-pointer"
                >
                  Mot de passe oublié?
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full flex flex-wrap justify-center items-center gap-2 mt-12 md:mt-8 font-inter text-sm pb-4">
          <span className="text-neutral-grey-800">Pas encore de compte ?</span>
          <Link
            href="/signin"
            className="text-brand-orange underline hover:text-opacity-80 transition-all font-semibold"
          >
            Créer un compte
          </Link>
        </div>
      </section>
    </main>
  );
}
