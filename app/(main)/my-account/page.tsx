"use client";

import Container from "@/components/ui/Container";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import React from "react";
import Toast from "@/components/ui/Toast";

interface ProfileFormData {
    name: string;
    email: string;
}

export default function MyAccountPage() {

    const user = useUserInfo();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>();

    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState<string | null>(null);

    const onSubmit = async (data: ProfileFormData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.put("/auth/profile", {
                email: data.email,
                name: data.name,
            });

            const { success, message } = response.data;

            if (success) {
                setSuccess(message);
            }
        } catch (err: unknown) {
            console.error("Profile update error:", err);
            const message =
                err instanceof AxiosError
                    ? err.response?.data?.message
                    : undefined;
            setError(
                message || "Erreur lors de la mise à jour du profil. Veuillez réessayer."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">

            {error && (
                <Toast type="error" message={error} />
            )}
            {success && (
                <Toast type="success" message={success} />
            )}

            <Container>
                <h1 className="text-2xl font-bold mt-10">Mon compte</h1>
                <p className="text-lg mt-3 text-gray-600">{user?.name}</p>

                <form onSubmit={handleSubmit(onSubmit)} className="my-10">
                    <div className="mb-5">
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                            Nom
                        </label>
                        <input
                            type="text"
                            id="name"
                            defaultValue={user?.name}
                            {...register("name", {
                                required: "Le nom est requis",
                            })}
                            className={`mt-2 w-full h-[53px] px-[17px] bg-white border ${errors.name
                                ? "border-red-500"
                                : "border-neutral-grey-200"
                                } rounded-[4px] focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange ring-offset-0 transition-all font-inter text-black`}
                        />
                        {errors.name && (
                            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", {
                                required: "L'email est requis",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Adresse email invalide",
                                },
                            })}
                            defaultValue={user?.email}
                            className={`mt-2 w-full h-[53px] px-[17px] bg-white border ${errors.email
                                ? "border-red-500"
                                : "border-neutral-grey-200"
                                } rounded-[4px] focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange ring-offset-0 transition-all font-inter text-black`}
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-orange hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
                    >
                        {loading ? "Mise à jour..." : "Mettre à jour"}
                    </button>
                </form>
            </Container>
        </div>
    );
}