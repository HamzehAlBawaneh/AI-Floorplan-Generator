import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface SocialLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGoogleLogin: () => void;
    onLinkedInLogin: () => void;
    isRegistering?: boolean;
}

export function SocialLoginModal({
    isOpen,
    onClose,
    onGoogleLogin,
    onLinkedInLogin,
    isRegistering = false,
}: SocialLoginModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                    {isRegistering ? 'Sign up with' : 'Log in with'}
                </h3>

                <div className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full h-14 text-base font-medium border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        onClick={onGoogleLogin}
                    >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full h-14 text-base font-medium border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        onClick={onLinkedInLogin}
                    >
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.108 0-.612.492-1.108 1.1-1.108s1.1.496 1.1 1.108c0 .613-.492 1.108-1.1 1.108zm8 6.891h-1.706v-3.156c0-.976-.175-2.031-2.342-2.031-1.161 0-1.952.812-1.952 1.823v3.364h-1.7v-6h1.634v.901h.023c.377-.711 1.294-1.46 2.666-1.46 2.85 0 3.377 1.796 3.377 4.108v3.088z" />
                        </svg>
                        Continue with LinkedIn
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
