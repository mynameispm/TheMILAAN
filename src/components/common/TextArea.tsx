import React from 'react';

interface TextAreaProps {
  id: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  helperText?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  className = '',
  required = false,
  disabled = false,
  rows = 4,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        className={`input w-full ${error ? 'border-error-500 focus:ring-error-500' : ''} ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        rows={rows}
      ></textarea>
      {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default TextArea;