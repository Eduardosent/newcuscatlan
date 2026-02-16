'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks';
import { Input } from '@/components/forms';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const resetSchema = z.object({
  password: z.string().min(6, { message: "passwordMin" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwordsDontMatch",
  path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const t = useTranslations('Auth.ResetPassword');
  const { updateUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    const errorDescription = searchParams.get('error_description');
    if (errorDescription) {
      setServerError(errorDescription);
    }
    setIsVerifying(false);
  }, [searchParams]);

  const onSubmit = async (data: ResetForm) => {
    setServerError(null);
    try {
      await updateUser({ password: data.password });
      setIsSuccess(true);
      setTimeout(() => router.replace('/login'), 3000);
    } catch (err: any) {
      setServerError(err.message || t('errorMessage'));
    }
  };

  if (isVerifying) {
    return (
      <div className="bg-white rounded-[32px] p-12 text-center shadow-2xl border border-white max-w-md mx-auto">
        <Loader2 className="w-10 h-10 animate-spin text-[#1D4ED8] mx-auto mb-4" />
        <p className="text-gray-400 font-medium">{t('verifying')}</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-white rounded-[32px] p-10 text-center shadow-2xl border border-white max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-50 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">
          {t('successTitle')}
        </h1>
        <p className="text-gray-400 text-sm font-medium">
          {t('successMessage')}
        </p>
      </div>
    );
  }

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
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{serverError}</p>
          {!isSuccess && (
             <Link href="/forgot-password" className="ml-auto underline text-xs">
                {t('requestNew')}
             </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input 
          label={t('passwordLabel')}
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message ? t(errors.password.message) : ''}
        />

        <Input 
          label={t('confirmPasswordLabel')}
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : ''}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer w-full bg-[#1D4ED8] text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 mt-2 flex justify-center items-center gap-2"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('submitButton')}
        </button>
      </form>
    </div>
  );
}