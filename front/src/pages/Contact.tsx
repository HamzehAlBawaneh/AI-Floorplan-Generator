import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Contact() {
    const { t } = useLanguage();

    const contactMethods = [
        {
            icon: <Mail className="w-6 h-6" />,
            title: t('emailUs', 'Email Us'),
            value: 'info@archimind.com',
            href: 'mailto:info@archimind.com'
        },
        {
            icon: <Phone className="w-6 h-6" />,
            title: t('callUs', 'Call Us'),
            value: '+1 (204) 123-4567',
            href: 'tel:+12041234567'
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: t('visitUs', 'Visit Us'),
            value: t('value','123 Design St., Tech City, 10001'),
            href: 'https://maps.google.com'
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <div className="min-h-screen bg-background">
                    {/* Hero Section */}
                    <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
                        <div className="container mx-auto max-w-6xl text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                                {t('contactUs', 'Contact Us')}
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                {t('contactSubtitle', 'Have questions? Get in touch with our team.')}
                            </p>
                        </div>
                    </section>

                    {/* Contact Form and Info */}
                    <section className="py-16 px-4">
                        <div className="container mx-auto max-w-6xl">
                            <div className="grid md:grid-cols-2 gap-12">
                                {/* Contact Form */}
                                <div className="bg-card p-8 rounded-xl border border-border">
                                    <h2 className="text-2xl font-semibold mb-6 text-foreground">
                                        {t('sendMessage', 'Send us a message')}
                                    </h2>
                                    <form className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium text-foreground">
                                                    {t('fullName', 'Full Name')}
                                                </label>
                                                <Input id="name" placeholder={t('enterName', 'Your name')} />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                                    {t('email', 'Email')}
                                                </label>
                                                <Input id="email" type="email" placeholder="you@example.com" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-foreground">
                                                {t('subject', 'Subject')}
                                            </label>
                                            <Input id="subject" placeholder={t('subjectPlaceholder', 'How can we help?')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-foreground">
                                                {t('message', 'Message')}
                                            </label>
                                            <Textarea
                                                id="message"
                                                placeholder={t('messagePlaceholder', 'Your message here...')}
                                                rows={5}
                                            />
                                        </div>
                                        <Button type="submit" className="gap-2">
                                            <Send className="w-4 h-4" />
                                            {t('sendMessage', 'Send Message')}
                                        </Button>
                                    </form>
                                </div>

                                {/* Contact Info */}
                                <div>
                                    <h2 className="text-2xl font-semibold mb-6 text-foreground">
                                        {t('contactInfo', 'Contact Information')}
                                    </h2>
                                    <div className="space-y-6">
                                        {contactMethods.map((method, index) => (
                                            <a
                                                key={index}
                                                href={method.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-start gap-4 group"
                                            >
                                                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                                    {method.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-foreground">{method.title}</h3>
                                                    <p className="text-muted-foreground">{method.value}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>

                                    <div className="mt-12">
                                        <h3 className="text-lg font-medium mb-4 text-foreground">
                                            {t('businessHours', 'Business Hours')}
                                        </h3>
                                        <div className="space-y-2 text-muted-foreground">
                                            <p>{t('mondayToSunday', 'Monday - Sunday')}:{t('time1', '9:00 AM - 6:00 PM')}</p>
                                            <p>{t('saturday', 'Saturday')}: {t('time2', '10:00 AM - 4:00 PM')}</p>
                                            <p>{t('Friday', 'Friday')}: {t('closed', 'Closed')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
