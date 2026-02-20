import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    isHighlighted?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, isHighlighted, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                    {label}
                </label>
                
                <textarea 
                    {...props}
                    ref={ref}
                    className={`
                        w-full px-5 py-3 rounded-2xl text-base outline-none transition-all duration-300 resize-none
                        bg-white border-2
                        placeholder:text-gray-300
                        disabled:bg-gray-50 disabled:cursor-not-allowed
                        ${error 
                            ? "border-red-500 focus:border-red-600 text-red-900" 
                            : (isHighlighted 
                                ? "border-[#1D4ED8] bg-blue-50/30 text-[#1D4ED8] font-bold" 
                                : "border-gray-100 text-gray-800 focus:border-[#1D4ED8] focus:shadow-[0_0_0_4px_rgba(29,78,216,0.1)]")
                        }
                    `}
                />

                {error && (
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-2 mt-1">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';