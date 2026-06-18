import React, { forwardRef, useState, useId } from 'react';
import eyeOpen from '../../assets/icons/eye-open.svg';
import eyeOff from '../../assets/icons/eye-off.svg';

/**
 * Input component global
 *
 * @param {string} label
 * @param {string} error
 * @param {string} hint
 * @param {React.ReactNode} prefix
 * @param {React.ReactNode} suffix
 * @param {React.ReactNode} rightLabel
 */
const Input = forwardRef(
    (
        {
            label,
            error,
            hint,
            prefix,
            suffix,
            rightLabel,
            type = 'text',
            className = '',
            id,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        // Handle password toggle
        const [showPassword, setShowPassword] = useState(false);
        const isPasswordType = type === 'password';
        const resolvedType = isPasswordType
            ? showPassword
                ? 'text'
                : 'password'
            : type;

        const baseInput =
            'w-full rounded-lg border bg-white text-sm text-gray-800 placeholder:text-gray-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent';

        const errorStyle = error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-gray-200 hover:border-gray-300';

        // Left Padding
        const paddingLeft = prefix ? 'pl-10' : 'pl-4';
        // Right Padding
        const paddingRight = isPasswordType || suffix ? 'pr-10' : 'pr-4';

        return (
            <div className={`flex flex-col gap-1.5 ${className}`}>
                {/* Label row */}
                {(label || rightLabel) && (
                    <div className="flex items-center justify-between">
                        {label && (
                            <label
                                htmlFor={inputId}
                                className="text-sm font-medium text-gray-700"
                            >
                                {label}
                            </label>
                        )}
                        {rightLabel && (
                            <span className="text-sm">{rightLabel}</span>
                        )}
                    </div>
                )}

                {/* Input wrapper */}
                <div className="relative flex items-center">
                    {/* Prefix icon/teks */}
                    {prefix && (
                        <span className="pointer-events-none absolute left-3 flex items-center text-gray-400">
                            {prefix}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        type={resolvedType}
                        className={[
                            baseInput,
                            errorStyle,
                            paddingLeft,
                            paddingRight,
                            'py-2.5',
                        ].join(' ')}
                        {...props}
                    />

                    {/* Password toggle */}
                    {isPasswordType && (
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            tabIndex={-1}
                            aria-label={
                                showPassword
                                    ? 'Hide password'
                                    : 'Show password'
                            }
                        >
                            <img
                                src={showPassword ? eyeOff : eyeOpen}
                                alt=""
                                className="w-5 h-5"
                            />
                        </button>
                    )}

                    {/* Suffix */}
                    {!isPasswordType && suffix && (
                        <span className="absolute right-3 flex items-center text-gray-400">
                            {suffix}
                        </span>
                    )}
                </div>

                {/* Error or Hint */}
                {error ? (
                    <p className="text-xs text-red-500">{error}</p>
                ) : hint ? (
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                        {hint}
                    </p>
                ) : null}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;