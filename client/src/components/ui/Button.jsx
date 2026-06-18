import React from 'react';
import {ClipLoader} from 'react-spinners';

/**
 * Button component global
 *
 * @param {'primary' | 'outline' | 'ghost' | 'danger'} variant
 * @param {'sm' | 'md' | 'lg'} size
 * @param {boolean} isLoading
 * @param {boolean} fullWidth
 * @param {React.ReactNode} leftIcon
 * @param {React.ReactNode} rightIcon
 */
const Button = ({
                    children,
                    variant = 'primary',
                    size = 'md',
                    isLoading = false,
                    fullWidth = false,
                    leftIcon,
                    rightIcon,
                    className = '',
                    disabled,
                    type = 'button',
                    onClick,
                    ...props
                }) => {
    const baseStyles =
        'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

    const variants = {
        // Button blue solid
        primary:
            'bg-blue-primary text-white hover:bg-blue-700 focus:ring-blue-primary active:scale-[0.98]',

        // Button border blue
        outline:
            'border border-blue-primary text-blue-primary bg-white hover:bg-bg-primary focus:ring-blue-primary active:scale-[0.98]',

        // Button without border
        ghost:
            'text-blue-primary hover:bg-bg-primary focus:ring-blue-primary active:scale-[0.98]',

        // Button red
        danger:
            'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 active:scale-[0.98]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={[
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth ? 'w-full' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...props}
        >
            {isLoading ? (
                <ClipLoader size={16} color="currentColor"/>
            ) : (
                leftIcon
            )}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
};

export default Button;