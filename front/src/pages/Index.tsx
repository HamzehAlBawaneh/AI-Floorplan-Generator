import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { UploadSection } from "@/components/UploadSection";
import { PlansDisplay } from "@/components/PlansDisplay";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import type { AreaUnit } from "@/types/upload.types";

// Define the GeneratedPlan type to match the Plan type from PlansDisplay
interface GeneratedPlan {
  id: number;
  title: string;
  area: string;
  rooms: string;
  floors: string;
  budget: string;
  preview: string;
  pdfpath: string;
  name?: string; // Optional if you need to keep it for backward compatibility
}

interface ProjectConfig {
  projectType: string;
  budget: number;
  file: File | null;
  floors: number;
  area: number | string;
  areaUnit: AreaUnit;
  generatedPlans: GeneratedPlan[]; // This now matches the expected Plan[] type
}

type FormValues = Omit<ProjectConfig, 'generatedPlans'>;

// Using types from @/types

const Index = () => {
  const [showPlans, setShowPlans] = useState(false);
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    projectType: 'house',
    budget: 500000,
    file: null,
    floors: 1,
    area: 250,
    areaUnit: 'm2',
    generatedPlans: []
  });
  const { t } = useLanguage();

  const handleGenerate = useCallback(async (data: FormValues) => {
    // Ensure area is a number
    const area = typeof data.area === 'string' ? parseFloat(data.area) || 0 : data.area;

    setProjectConfig({
      projectType: data.projectType,
      budget: data.budget,
      file: data.file,
      floors: data.floors,
      area: area,
      areaUnit: data.areaUnit,
      generatedPlans: []
    });

    setShowPlans(true);

    // Scroll to plans after a brief delay
    const timer = setTimeout(() => {
      document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => clearTimeout(timer);
  }, [setProjectConfig, setShowPlans]);

  const handleNewProject = useCallback(() => {
    setShowPlans(false);
    // Reset project configuration to default values
    setProjectConfig({
      projectType: 'house',
      budget: 500000,
      file: null,
      floors: 1,
      area: 250,
      areaUnit: 'm2',
      generatedPlans: []
    });

    // Use requestAnimationFrame to ensure the DOM has updated
    requestAnimationFrame(() => {
      const uploadSection = document.getElementById('upload-section');
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: 'smooth' });
        // Focus on the first focusable element in the upload section for better accessibility
        const focusable = uploadSection.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        // Use setTimeout to ensure focus happens after the scroll
        setTimeout(() => {
          focusable?.focus();
        }, 300);
      }
    });
  }, [setProjectConfig, setShowPlans]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <div id="upload-section">
        <UploadSection
          key={`upload-section-${projectConfig.file ? 'with-file' : 'no-file'}`}
          onGenerate={handleGenerate}
          projectType={projectConfig.projectType}
          budget={projectConfig.budget}
          file={projectConfig.file}
          floors={projectConfig.floors}
          area={projectConfig.area}
          areaUnit={projectConfig.areaUnit}
        />
      </div>
      {showPlans && (
        <div id="plans-section" className="pb-16">
          <PlansDisplay
            projectType={projectConfig.projectType}
            budget={projectConfig.budget}
            plans={projectConfig.generatedPlans}
            isLoading={false}
          />
          <div className="container mx-auto px-4 mt-8 max-w-4xl">
            <Button
              variant="outline"
              size="lg"
              className="w-full text-lg h-14"
              onClick={handleNewProject}
            >
              {t("newProject")}
            </Button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Index;
