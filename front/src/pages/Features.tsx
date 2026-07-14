import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Layout, Eye, FileText } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";

export default function Features() {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const isRTL = language === 'ar';
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/');
    };

    const features = [
        {
            title: t('aiLandAnalysis'),
            description: t('feature1Desc'),
            icon: <Zap className="w-6 h-6 text-primary" />,
            bgColor: "bg-primary/10"
        },
        {
            title: t('feature2Title'),
            description: t('feature2Desc'),
            icon: <Layout className="w-6 h-6 text-green-500" />,
            bgColor: "bg-green-500/10"
        },
        {
            title: t('feature3Title'),
            description: t('feature3Desc'),
            icon: <Eye className="w-6 h-6 text-blue-500" />,
            bgColor: "bg-blue-500/10"
        },
        {
            title: t('feature4Title'),
            description: t('feature4Desc'),
            icon: <FileText className="w-6 h-6 text-purple-500" />,
            bgColor: "bg-purple-500/10"
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <div className={cn("min-h-screen bg-background", {
                    "text-right": isRTL,
                    "text-left": !isRTL,
                    "dark": theme === 'dark'
                })} dir={isRTL ? 'rtl' : 'ltr'}>
                    {/* Hero Section */}
                    <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background dark:from-primary/10 dark:to-background">
                        <div className={cn("container mx-auto max-w-6xl text-center", {
                            "text-right": isRTL,
                            "text-left": !isRTL
                        })}>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                {t('featuresTitle', 'Powerful Features')}
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                {t('featuresSubtitle', 'Discover how our AI-powered tools can transform your architectural planning process.')}
                            </p>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="py-16 px-4">
                        <div className="container mx-auto max-w-6xl">
                            <div className="grid md:grid-cols-2 gap-8">
                                {features.map((feature, index) => (
                                    <div key={index} className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                                        <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2 text-foreground">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
                        <div className="container mx-auto max-w-4xl text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                                {t('readyToStart', 'Ready to get started?')}
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8">
                                {t('ctaSubtitle', 'Join thousands of architects and designers using our platform.')}
                            </p>
                            <Button
                                size="lg"
                                className="gap-2 group"
                                onClick={handleGetStarted}
                            >
                                {t('getStarted', 'Get Started for Free')}
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
