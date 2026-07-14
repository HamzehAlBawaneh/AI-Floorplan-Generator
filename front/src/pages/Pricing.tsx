import { motion } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const pricingPlans = [
    {
        name: 'Free',
        monthlyPrice: '$0',
        yearlyPrice: '$0',
        monthlyPeriod: '/month',
        yearlyPeriod: '/month',
        description: 'Perfect for trying out basic features',
        features: [
            '1 active project',
            'Basic design tools',
            'Community support',
            'Standard templates',
            'Limited exports',
        ],
        buttonText: 'Get Started',
        popular: false,
    },
    {
        name: 'Starter',
        monthlyPrice: '$19',
        yearlyPrice: '$69',
        monthlyPeriod: '/month',
        yearlyPeriod: '/year',
        description: 'For individuals and small projects',
        features: [
            '5 active projects',
            'Advanced design tools',
            'Email support',
            'All templates',
            'Unlimited exports',
            'Basic analytics',
        ],
        buttonText: 'Start Free Trial',
        popular: true,
    },
    {
        name: 'Professional',
        monthlyPrice: '$49',
        yearlyPrice: '$119',
        monthlyPeriod: '/month',
        yearlyPeriod: '/year',
        description: 'For professionals and growing teams',
        features: [
            'Unlimited projects',
            'Premium design tools',
            'Priority support',
            'Team collaboration',
            '3D modeling',
            'Advanced analytics',
        ],
        buttonText: 'Start Free Trial',
        popular: false,
    },
    {
        name: 'Enterprise',
        monthlyPrice: '$75',
        yearlyPrice: '$359',
        monthlyPeriod: '/month',
        yearlyPeriod: '/year',
        description: 'For large organizations with advanced needs',
        features: [
            'Unlimited everything',
            'Dedicated account manager',
            '24/7 priority support',
            'Custom integrations',
            'On-premise deployment',
            'Training & onboarding',
            'API access',
            'SLA 99.9% uptime',
        ],
        buttonText: 'Contact Sales',
        popular: false,
    },
];

export default function Pricing() {
    const navigate = useNavigate();
    const [isYearly, setIsYearly] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const savings = {
        'Starter': 'Save 30%',
        'Professional': 'Save 40%',
        'Enterprise': 'Save 60%'
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4 py-16 sm:py-24">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl mb-4">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                        Choose the perfect plan for your architectural design needs. Save up to 60% with annual billing.
                    </p>
                    <div className="mt-8 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-3">Monthly</span>
                        <button
                            type="button"
                            onClick={() => setIsYearly(!isYearly)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isYearly ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        <div className="ml-3 flex items-center">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Yearly</span>
                            {!isYearly && (
                                <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
                                    Save up to 60%
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mt-12">
                    {pricingPlans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className={`relative rounded-2xl p-8 bg-white dark:bg-slate-800 shadow-lg border ${plan.popular
                                ? 'border-indigo-500 dark:border-indigo-600 ring-2 ring-indigo-500/20 dark:ring-indigo-600/30'
                                : 'border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-indigo-600 text-white text-xs font-medium px-4 py-1.5 rounded-full whitespace-nowrap">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                        {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        {isYearly ? plan.yearlyPeriod : plan.monthlyPeriod}
                                        {isYearly && plan.name !== 'Free' && (
                                            <span className="ml-2 text-sm text-indigo-600 dark:text-indigo-400">
                                                {savings[plan.name as keyof typeof savings]}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                {isYearly && plan.name !== 'Free' && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-through">
                                        {plan.monthlyPrice}{plan.monthlyPeriod}
                                    </p>
                                )}
                                <p className="mt-2 text-slate-600 dark:text-slate-400">
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full transition-all ${selectedPlan === plan.name
                                        ? 'ring-2 ring-offset-2 ring-indigo-500 bg-indigo-600 hover:bg-indigo-700'
                                        : plan.popular
                                            ? 'bg-indigo-600 hover:bg-indigo-700'
                                            : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600'
                                    }`}
                                size="lg"
                                onClick={() => setSelectedPlan(plan.name === selectedPlan ? null : plan.name)}
                            >
                                {selectedPlan === plan.name ? 'Selected' : plan.buttonText}
                                {plan.popular && !selectedPlan && <Zap className="ml-2 h-4 w-4" />}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-24 max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
                        Frequently asked questions
                    </h2>

                    <div className="space-y-6">
                        {[
                            {
                                question: 'Can I try before I buy?',
                                answer: 'Absolutely! We offer a 14-day free trial for all plans with no credit card required.'
                            },
                            {
                                question: 'What payment methods do you accept?',
                                answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
                            },
                            {
                                question: 'Can I change plans later?',
                                answer: 'Yes, you can upgrade or downgrade your plan at any time from your account settings.'
                            },
                            {
                                question: 'Do you offer team or educational discounts?',
                                answer: 'Yes, we offer special pricing for teams and educational institutions. Please contact our sales team for more information.'
                            },
                        ].map((item, index) => (
                            <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-6">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                    {item.question}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {item.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
