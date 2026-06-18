import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { AuthLayout } from '../features/auth/index.js';
import { loginSchema } from '../features/auth/index.js';
import { loginThunk, selectIsLoading, selectAuthError, clearError } from '../redux/slices/authSlice.js';

import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import googleIcon from '../assets/icons/google-auth.svg';
import arrowIcon from '../assets/icons/arrow.svg';

const Login = () => {
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
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        const result = await dispatch(loginThunk(data));
        if (loginThunk.fulfilled.match(result)) {
            toast.success('Welcome back!');
            navigate('/dashboard');
        }
        // Error is handled via the useEffect above
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md bg-white p-8 rounded-3xl">
                {/* Heading */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Please enter your details to sign in.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="flex flex-col gap-5">
                        {/* Email */}
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@mail.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        {/* Password */}
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            rightLabel={
                                <Link
                                    to="/forgot-password"
                                    className="text-blue-primary hover:underline text-sm font-bold"
                                >
                                    Forgot password?
                                </Link>
                            }
                            {...register('password')}
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
                            Log In
                        </Button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <hr className="flex-1 border-gray-200" />
                            <span className="text-xs text-gray-400 uppercase tracking-widest">
                                or continue with
                            </span>
                            <hr className="flex-1 border-gray-200" />
                        </div>

                        {/* Google */}
                        <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            leftIcon={
                                <img src={googleIcon} alt="Google" className="w-5 h-5" />
                            }
                        >
                            Sign in with Google
                        </Button>
                    </div>
                </form>

                {/* Footer link */}
                <p className="mt-5 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link
                        to="/register"
                        className="text-blue-primary font-medium hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;