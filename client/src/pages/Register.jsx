import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { AuthLayout } from '../features/auth/index.js';
import { registerSchema } from '../features/auth/index.js';
import { registerThunk, selectIsLoading, selectAuthError, clearError } from '../redux/slices/authSlice.js';

import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import arrowIcon from '../assets/icons/arrow.svg';
import chainIcon from '../assets/icons/chain.svg';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsLoading);
    const serverError = useSelector(selectAuthError);

    useEffect(() => {
        if (serverError) {
            toast.error(serverError);
            dispatch(clearError());
        }
    }, [serverError, dispatch]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        const result = await dispatch(registerThunk(data));
        if (registerThunk.fulfilled.match(result)) {
            toast.success('Account created! Please sign in.');
            navigate('/login');
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                {/* Logo icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-15 h-8 rounded-full bg-bg-primary flex items-center justify-center">
                        <img src={chainIcon} alt="ShortLink" />
                    </div>
                </div>

                {/* Heading */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Join the elite architects of the web.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="flex flex-col gap-5">
                            {/* Email */}
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="name@company.com"
                                error={errors.email?.message}
                                {...register('email')}
                            />

                            {/* Password */}
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                hint="Minimum 8 characters"
                                error={errors.password?.message}
                                {...register('password')}
                            />

                            {/* Confirm Password */}
                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                error={errors.confirm_password?.message}
                                {...register('confirm_password')}
                            />

                            {/* Submit */}
                            <Button
                                type="submit"
                                fullWidth
                                isLoading={isLoading}
                                rightIcon={
                                    <img src={arrowIcon} alt="" className="w-3 h-3" />
                                }
                            >
                                Sign Up
                            </Button>

                            {/* Terms */}
                            <p className="text-xs text-gray-400 text-center leading-relaxed">
                                By signing up, you agree to our{' '}
                                <Link to="/terms" className="text-blue-primary hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-blue-primary hover:underline">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer link */}
                <p className="mt-5 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-primary font-medium hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Register;