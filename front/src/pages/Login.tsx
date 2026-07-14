import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Mail,
    Lock,
    ArrowRight,
    ChevronLeft,
    Building2,
    Eye,
    EyeOff,
    Sparkles,
    Shield,
    Zap
} from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        navigate('/dashboard');
    };

    const handleSocialLogin = (provider: 'google' | 'linkedin') => {
        const url = provider === 'google'
            ? '/auth/google'
            : '/auth/linkedin';
        window.location.href = url;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const features = [
        { icon: Sparkles, text: "AI-Powered Design Tools" },
        { icon: Shield, text: "Secure & Private" },
        { icon: Zap, text: "Lightning Fast Workflow" }
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
                {/* Animated background */}
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
                            <Building2 className="h-16 w-16 text-white" />
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
                                transition={{ delay: 0.6 + (index * 0.15) }}
                                className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-5 rounded-3xl border border-white/20 hover:bg-white/15 transition-all"
                            >
                                <div className="bg-white/20 p-3 rounded-2xl">
                                    <feature.icon className="h-6 w-6 text-white" />
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
                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-8"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Back</span>
                    </motion.button>

                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                            Welcome back
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            Sign in to continue your creative journey
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>

                        {/* Email */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                Email address
                            </Label>
                            <div className="relative">
                                <Mail
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'email'
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-400'
                                        }`}
                                />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-12 h-14 text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <div className="flex items-center justify-between mb-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Password
                                </Label>
                                {/* <RouterLink
                                    to="/signup"
                                    className="font-semibold text-indigo-600 dark:text-indigo-400"
                                >
                                    Sign up
                                </RouterLink> */}
                            </div>

                            <div className="relative">
                                <Lock
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'password'
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-400'
                                        }`}
                                />

                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="pl-12 pr-12 h-14 text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />

                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </motion.div>
                        {/* Submit */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <Button
                                type="submit"
                                className="w-full h-14 mt-4 text-base font-semibold bg-indigo-600 text-white rounded-xl"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in…" : "Sign in"}
                            </Button>
                        </motion.div>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <RouterLink to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Sign up
                        </RouterLink>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
