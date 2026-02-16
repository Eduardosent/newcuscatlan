'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks';
import { Input } from '@/components/forms';
import { GoogleButton } from '@/components/auth/google-button'; // Nombre corregido
import { Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { signUpSchema, type SignUpForm } from '@/types/forms/sign-up';

export default function SignUpPage() {
    const t = useTranslations('Auth.SignUp');
    const { signUp } = useAuth();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { email: '', password: '', confirmPassword: '' },
    });

    const onSubmit = async (data: SignUpForm) => {
        setServerError(null);
        try {
            await signUp(data.email, data.password);
        } catch (err: any) {
            setServerError(err.message || t('errorMessage'));
        }
    };

    return (
        <div className="bg-white rounded-[32px] shadow-2xl p-8 md:p-10 border border-white max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                    {t('title')}
                </h1>
                <p className="text-gray-400 text-sm font-medium mt-1">
                    {t('subtitle')}
                </p>
            </div>

            {serverError && (
                <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-3 rounded-2xl text-sm font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{serverError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input 
                    label={t('emailLabel')}
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    {...register('email')}
                    error={errors.email?.message}
                />

                <Input 
                    label={t('passwordLabel')}
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    error={errors.password?.message}
                />

                <Input 
                    label={t('confirmPasswordLabel')}
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer w-full bg-[#1D4ED8] text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 mt-2 flex justify-center items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{t('loadingButton')}</span>
                        </>
                    ) : (
                        t('submitButton')
                    )}
                </button>
            </form>

            <div className="mt-6">
                <GoogleButton />
            </div>

            <div className="mt-6 text-center pt-4 border-t border-gray-50">
                <p className="text-gray-400 text-sm font-medium">
                    {t('alreadyHaveAccount')}{' '}
                    <Link href="/login" className="text-[#1D4ED8] font-bold hover:underline">
                        {t('signIn')}
                    </Link>
                </p>
            </div>
        </div>
    );
}