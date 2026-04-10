"use client";

import Container from "@/components/ui/Container";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import React from "react";
import Toast from "@/components/ui/Toast";
import { useAuthStore } from "@/store/authStore";

interface ProfileFormData {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
}

export default function MyAccountPage() {

    const user = useUserInfo();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>();

    const [error, setError] = React.useState<Array<string> | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState<Array<string> | null>(null);

    const onSubmit = async (data: ProfileFormData) => {
        setLoading(true);
        setError(null);
        try {
            const successMessages: Array<string> = [];
            
            const responseProfile = await axiosInstance.put("/auth/profile", {
                email: data.email,
                name: data.name
            });

            const { success : successProfile, message: messageProfile } = responseProfile.data;

            // update user in store
            if (user) {
                useAuthStore.setState({
                    user: {
                        ...user,
                        name: data.name,
                        email: data.email,
                    },
                });
            }

            if (successProfile) {
                successMessages.push(messageProfile);
            }

            if (data.currentPassword && data.newPassword) {
                const responsePassword = await axiosInstance.put("/auth/password", {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                });

                const { success : successPassword, message: messagePassword } = responsePassword.data;

                if (successPassword) {
                    successMessages.push(messagePassword);
                }
            } else if (!data.currentPassword && data.newPassword) {
                setError(["L'ancien mot de passe est requis"]);
            } else if (data.currentPassword && !data.newPassword) {
                setError(["Le nouveau mot de passe est requis"]);
            }

            if (successMessages.length > 0) {
                setSuccess(successMessages);
            }
            
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                const responseData = err.response?.data;
                const messages: string[] = [];
                
                if (responseData?.data?.errors && Array.isArray(responseData.data.errors)) {
                    responseData.data.errors.forEach((e: any) => messages.push(e.message));
                } else if (responseData?.message) {
                    messages.push(responseData.message);
                } else {
                    messages.push("Erreur lors de la mise à jour du profil. Veuillez réessayer.");
                }
                setError(messages);
            } else {
                setError(["Une erreur inattendue est survenue. Veuillez réessayer."]);
            }
        } finally {
            

            
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">

            {error && (
                <Container className="mt-5 mb-5">
                    {error.map((message, index) => (
                        <Toast key={index} type="error" message={message} />
                    ))}
                </Container>
            )}
            {success && (
                <Container className="mt-5 mb-5">
                    {success.map((message, index) => (
                        <Toast key={index} type="success" message={message} />
                    ))}
                </Container>
            )}

            <Container background={true}>
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

                    <div className="mb-5">
                        <label htmlFor="currentPassword" title="Mot de passe actuel" className="block text-lg font-medium text-gray-700">
                            Ancien mot de passe
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            {...register("currentPassword")}
                            className={`mt-2 w-full h-[53px] px-[17px] bg-white border ${errors.currentPassword
                                ? "border-red-500"
                                : "border-neutral-grey-200"
                                } rounded-[4px] focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange ring-offset-0 transition-all font-inter text-black`}
                        />
                        {errors.currentPassword && (
                            <p className="mt-2 text-sm text-red-600">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="newPassword" title="Nouveau mot de passe" className="block text-lg font-medium text-gray-700">
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            {...register("newPassword", {
                                minLength: {
                                    value: 8,
                                    message: "Le nouveau mot de passe doit contenir au moins 8 caractères",
                                },
                            })}
                            className={`mt-2 w-full h-[53px] px-[17px] bg-white border ${errors.newPassword
                                ? "border-red-500"
                                : "border-neutral-grey-200"
                                } rounded-[4px] focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange ring-offset-0 transition-all font-inter text-black`}
                        />
                        {errors.newPassword && (
                            <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>
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