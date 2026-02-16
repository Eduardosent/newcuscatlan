import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    isHighlighted?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, isHighlighted, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                {label}
            </label>
            
            <div className="relative w-full">
                <input 
                    {...props}
                    ref={ref}
                    type={inputType}
                    className={`
                        w-full px-5 py-3 rounded-2xl text-base outline-none transition-all duration-300
                        bg-white border-2
                        placeholder:text-gray-300
                        disabled:bg-gray-50 disabled:cursor-not-allowed
                        ${isPassword ? 'pr-12' : ''}
                        ${error 
                            ? "border-red-500 focus:border-red-600 text-red-900" 
                            : (isHighlighted 
                                ? "border-[#1D4ED8] bg-blue-50/30 text-[#1D4ED8] font-bold" 
                                : "border-gray-100 text-gray-800 focus:border-[#1D4ED8] focus:shadow-[0_0_0_4px_rgba(29,78,216,0.1)]")
                        }
                    `}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1D4ED8] transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>

            {error && (
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-2 mt-1">
                    {error}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';