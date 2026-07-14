import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { ImageSlideshow } from "./ImageSlideshow";
import heroImage from "@/assets/hero-architecture.jpg";

export function Hero() {
  const { t } = useLanguage();
  const slideshowImages = [
    heroImage,
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&h=800&fit=crop"
  ];

  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted"
        style={{ backgroundImage: 'var(--gradient-mesh)' }} />

      {/* Hero slideshow background */}
      <div className="absolute inset-0">
        <ImageSlideshow images={slideshowImages} autoPlayInterval={3000} />
      </div>

      {/* Dynamic overlay for text readability */}
      <div className="absolute inset-0 bg-background/60 dark:bg-background/80" />

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">{t('heroSubtitle')}</span>
            </div> */}

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              {t('heroTitle')}
            </h1>

            <p className="text-lg text-foreground/90 leading-relaxed">
              {t('heroDescription')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                onClick={scrollToUpload}
              >
                {t('getStarted')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right content - Feature cards */}
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard
              icon="📐"
              title={t('feature1Title')}
              description={t('feature1Desc')}
            />
            <FeatureCard
              icon="🏗️"
              title={t('feature2Title')}
              description={t('feature2Desc')}
            />
            <FeatureCard
              icon="🎨"
              title={t('feature3Title')}
              description={t('feature3Desc')}
            />
            <FeatureCard
              icon="📄"
              title={t('feature4Title')}
              description={t('feature4Desc')}
            />
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-background/80 dark:bg-background/90 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-border hover:border-primary/20 group">
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
    </div>
  );
}
