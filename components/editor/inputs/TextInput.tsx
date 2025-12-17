import { UseFormRegisterReturn } from 'react-hook-form';
import { forwardRef } from 'react';

interface TextInputProps {
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  type?: 'text' | 'textarea';
  rows?: number;
}

const TextInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextInputProps>(
  ({ label, error, register, placeholder, type = 'text', rows = 4 }, ref) => {
    const inputClasses = `
      bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 
      rounded-lg p-3 w-full transition-all backdrop-blur-sm
      placeholder:text-gray-400
      ${error ? 'border-red-300 focus:border-red-400' : ''}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className="w-full">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            {...register}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            placeholder={placeholder}
            rows={rows}
            className={inputClasses}
          />
        ) : (
          <input
            {...register}
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            placeholder={placeholder}
            className={inputClasses}
          />
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;

