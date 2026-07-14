import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Mail, Lock, User, ArrowRight, Eye, EyeOff, Check
} from 'lucide-react';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const Signup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [id]: value
        }));

        // Clear error for this field
        if (errors[id as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [id]: ''
            }));
        }

        // Dynamic confirm password validation
        if (id === "password" || id === "confirmPassword") {
            if (value && formData.confirmPassword && formData.password !== formData.confirmPassword) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: "Passwords do not match"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: ""
                }));
            }
        }
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = 'Email is invalid';

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form submitted:', formData);
            // Redirect or further logic
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength =
        formData.password.length >= 8
            ? formData.password.match(/[A-Z]/) &&
                formData.password.match(/[0-9]/) &&
                formData.password.match(/[^A-Za-z0-9]/)
                ? 'strong'
                : 'medium'
            : 'weak';

    const features = [
        { text: 'AI-powered design suggestions' },
        { text: 'Secure and private' },
        { text: 'Lightning fast performance' }
    ];

    return (
        <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">

            {/* Left Panel */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
                    <motion.div
                        className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
                        style={{ left: '-10%', top: '10%' }}
                        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"
                        style={{ right: '-5%', top: '40%' }}
                        animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute w-72 h-72 bg-indigo-400/25 rounded-full blur-3xl"
                        style={{ left: '30%', bottom: '10%' }}
                        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -40, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="mb-8"
                    >
                        <div className="bg-white/20 backdrop-blur-xl p-6 rounded-3xl border border-white/30 shadow-2xl">
                            <div className="h-16 w-16 text-white">•</div>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-6xl font-bold mb-4 tracking-tight"
                    >
                        ArchiMind
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl text-white/90 text-center max-w-md mb-16 leading-relaxed"
                    >
                        Transform architectural visions into reality with intelligent design assistance
                    </motion.p>

                    <div className="space-y-5 w-full max-w-md">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 + index * 0.15 }}
                                className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-5 rounded-3xl border border-white/20 hover:bg-white/15 transition-all"
                            >
                                <div className="bg-white/20 p-3 rounded-2xl">
                                    <span className="h-6 w-6 text-white">•</span>
                                </div>
                                <span className="text-white/95 font-medium text-lg">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <motion.button
                        whileHover={{ x: -5 }}
                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 mb-8"
                        onClick={() => window.history.back()}
                    >
                        <span className="h-4 w-4">←</span>
                        <span>Back</span>
                    </motion.button>

                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                            Create account
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            Join ArchiMind and start designing smarter
                        </p>
                    </div>

                    <div className="space-y-5">

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                    First name
                                </label>
                                <motion.div animate={{ scale: focusedField === 'firstName' ? 1.02 : 1 }} transition={{ duration: 0.2 }} className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
                                        className="w-full pl-12 h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-indigo-100 outline-none"
                                        value={formData.firstName}
                                        onFocus={() => setFocusedField('firstName')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={handleChange}
                                    />
                                </motion.div>
                                {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                    Last name
                                </label>
                                <motion.div animate={{ scale: focusedField === 'lastName' ? 1.02 : 1 }} transition={{ duration: 0.2 }} className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        className="w-full pl-12 h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-indigo-100 outline-none"
                                        value={formData.lastName}
                                        onFocus={() => setFocusedField('lastName')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={handleChange}
                                    />
                                </motion.div>
                                {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                Email address
                            </label>
                            <motion.div animate={{ scale: focusedField === 'email' ? 1.02 : 1 }} transition={{ duration: 0.2 }} className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full pl-12 h-14 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-indigo-100 outline-none"
                                    value={formData.email}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={handleChange}
                                />
                            </motion.div>
                            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                Password
                            </label>
                            <motion.div animate={{ scale: focusedField === 'password' ? 1.02 : 1 }} transition={{ duration: 0.2 }} className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                    className="w-full pl-12 pr-12 h-14 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-indigo-100 outline-none"
                                    value={formData.password}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </motion.div>

                            {/* Password Strength Bar */}
                            {formData.password && !errors.password && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${passwordStrength === 'strong'
                                                    ? 'bg-green-500'
                                                    : passwordStrength === 'medium'
                                                        ? 'bg-yellow-500'
                                                        : 'bg-red-500'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{
                                                width:
                                                    passwordStrength === 'strong'
                                                        ? '100%'
                                                        : passwordStrength === 'medium'
                                                            ? '66%'
                                                            : '33%'
                                            }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <span
                                        className={`text-xs font-medium ${passwordStrength === 'strong'
                                                ? 'text-green-600'
                                                : passwordStrength === 'medium'
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                            }`}
                                    >
                                        {passwordStrength === 'strong'
                                            ? 'Strong'
                                            : passwordStrength === 'medium'
                                                ? 'Medium'
                                                : 'Weak'}
                                    </span>
                                </motion.div>
                            )}
                            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                Confirm password
                            </label>
                            <motion.div animate={{ scale: focusedField === 'confirmPassword' ? 1.02 : 1 }} transition={{ duration: 0.2 }} className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    className="w-full pl-12 pr-12 h-14 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-indigo-100 outline-none"
                                    value={formData.confirmPassword}
                                    onFocus={() => setFocusedField('confirmPassword')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </motion.div>

                            {formData.confirmPassword &&
                                formData.password === formData.confirmPassword &&
                                !errors.confirmPassword && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex items-center gap-2 text-green-600">
                                        <Check className="h-4 w-4" />
                                        <span className="text-xs font-medium">Passwords match</span>
                                    </motion.div>
                                )}

                            {errors.confirmPassword && (
                                <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={handleSubmit}
                                    className="w-full h-14 font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            <span>Creating account...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>Create account</span>
                                            <ArrowRight />
                                        </div>
                                    )}
                                </button>
                            </motion.div>
                        </motion.div>

                        {/* Login Link */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-600 mt-8">
                            Already have an account?{' '}
                            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                                Log in
                            </a>
                        </motion.div>

                        {/* Terms */}
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-slate-500 mt-4">
                            By creating an account, you agree to our{' '}
                            <button className="text-indigo-600 hover:underline">Terms of Service</button>{' '}
                            and{' '}
                            <button className="text-indigo-600 hover:underline">Privacy Policy</button>
                        </motion.p>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
