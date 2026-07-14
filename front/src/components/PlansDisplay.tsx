import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Eye, Check, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Plan {
  id: number;
  title: string;
  area: string;
  rooms: string;
  floors: string;
  budget: string;
  preview: string;
  pdfpath: string;
}

const mockPlans: Record<string, Plan[]> = {
  en: [
    {
      id: 1,
      title: "Modern Minimalist",
      area: "350 m²",
      rooms: "4 Bedrooms, 3 Bathrooms",
      floors: "2 Floors",
      budget: "$450,000",
      preview: "/floorplans_output/1.png",
      pdfpath: "/floorplan_pdf/1.pdf"
    },
    {
      id: 2,
      title: "Contemporary Classic",
      area: "420 m²",
      rooms: "5 Bedrooms, 4 Bathrooms",
      floors: "2 Floors + Basement",
      budget: "$580,000",
      preview: "/floorplans_output/2.png",
      pdfpath: "/floorplan_pdf/2.pdf"
    },
    {
      id: 3,
      title: "Eco-Friendly Design",
      area: "380 m²",
      rooms: "4 Bedrooms, 3 Bathrooms",
      floors: "2 Floors",
      budget: "$520,000",
      preview: "/floorplans_output/3.png",
      pdfpath: "/floorplan_pdf/3.pdf"
    },
    {
      id: 4,
      title: "Urban Villa",
      area: "500 m²",
      rooms: "6 Bedrooms, 5 Bathrooms",
      floors: "3 Floors",
      budget: "$750,000",
      preview: "/floorplans_output/4.png",
      pdfpath: "/floorplan_pdf/4.pdf"
    },
    {
      id: 5,
      title: "Smart Home Layout",
      area: "390 m²",
      rooms: "4 Bedrooms, 3 Bathrooms",
      floors: "2 Floors",
      budget: "$540,000",
      preview: "/floorplans_output/5.png",
      pdfpath: "/floorplan_pdf/5.pdf"
    },
    {
      id: 6,
      title: "Mediterranean Style",
      area: "450 m²",
      rooms: "5 Bedrooms, 4 Bathrooms",
      floors: "2 Floors + Rooftop",
      budget: "$680,000",
      preview: "/floorplans_output/6.png",
      pdfpath: "/floorplan_pdf/6.pdf"
    }
  ],
  ar: [
    {
      id: 1,
      title: "الحديث البسيط",
      area: "350 م²",
      rooms: "4 غرف نوم، 3 حمامات",
      floors: "طابقان",
      budget: "1,687,500 $",
      preview: "/floorplans_output/1.png",
      pdfpath: "/floorplan_pdf/1.pdf"
    },
    {
      id: 2,
      title: "الكلاسيكية المعاصرة",
      area: "420 م²",
      rooms: "5 غرف نوم، 4 حمامات",
      floors: "طابقان + قبو",
      budget: "2,175,000 $",
      preview: "/front/public/floorplans_output/2.png",
      pdfpath: "/front/public/floorplan_pdf/2.pdf"
    },
    {
      id: 3,
      title: "تصميم صديق للبيئة",
      area: "380 م²",
      rooms: "4 غرف نوم، 3 حمامات",
      floors: "طابقان",
      budget: "1,950,000 $",
      preview: "/floorplans_output/3.png",
      pdfpath: "/floorplan_pdf/3.pdf"
    },
    {
      id: 4,
      title: "فيلا حضرية",
      area: "500 م²",
      rooms: "6 غرف نوم، 5 حمامات",
      floors: "3 طوابق",
      budget: "2,812,500 $",
      preview: "/floorplans_output/4.png",
      pdfpath: "/floorplan_pdf/4.pdf"
    },
    {
      id: 5,
      title: "تخطيط المنزل الذكي",
      area: "390 م²",
      rooms: "4 غرف نوم، 3 حمامات",
      floors: "طابقان",
      budget: "2,025,000 $",
      preview: "/floorplans_output/5.png",
      pdfpath: "/floorplan_pdf/5.pdf"
    },
    {
      id: 6,
      title: "النمط المتوسطي",
      area: "450 م²",
      rooms: "5 غرف نوم، 4 حمامات",
      floors: "طابقان + سطح",
      budget: "2,550,000 $",
      preview: "/floorplans_output/6.png",
      pdfpath: "/floorplan_pdf/6.pdf"
    }
  ]
};

interface Plan {
  id: number;
  title: string;
  area: string;
  rooms: string;
  floors: string;
  budget: string;
  preview: string;
  pdfpath: string;
}

interface PlansDisplayProps {
  projectType: string;
  budget: number;
  plans?: Plan[];
  isLoading?: boolean;
}

export function PlansDisplay({ projectType, budget }: PlansDisplayProps) {
  const { t, language } = useLanguage();
  const currentPlans = mockPlans[language] || mockPlans.en;
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handleView3D = (e: React.MouseEvent, planId: number) => {
    e.stopPropagation();
    toast.success(`Opening 3D view for Plan ${planId}`);
  };

  // Process plans with correct image paths
  const processedPlans = useMemo(() => {
    return currentPlans.map(plan => {
      // Ensure consistent path format for preview images
      let previewPath = plan.preview
        .replace(/^\/+/, '')  // Remove leading slashes
        .replace(/^front\/public\//, '') // Remove front/public/
        .replace(/^floorplans_output\//, ''); // Remove floorplans_output/ if present

      // Construct the final path - always use /floorplans_output/ as the base
      previewPath = `/floorplans_output/${previewPath}`;

      // Handle PDF paths
      const pdfPath = plan.pdfpath
        .replace(/^\/+/, '')
        .replace(/^front\/public\//, '');

      return {
        ...plan,
        preview: previewPath,
        pdfpath: `/${pdfPath}`
      };
    });
  }, [currentPlans]);

  const handleDownloadPDF = (e: React.MouseEvent, planId: number) => {
    e.stopPropagation();
    const plan = currentPlans.find(p => p.id === planId);
    if (plan) {
      const link = document.createElement('a');
      link.href = plan.pdfpath;
      link.download = `floorplan-${planId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSelectPlan = (e: React.MouseEvent, planId: number, title: string) => {
    e.stopPropagation();
    setSelectedPlanId(selectedPlanId === planId ? null : planId);
    toast.success(selectedPlanId === planId ? `Deselected: ${title}` : `Selected: ${title}`);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">{t('generatedPlans')}</h2>
          <p className="text-lg text-muted-foreground">
            AI-generated designs based on your {projectType} project with ${(budget / 1000).toFixed(0)}K budget
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {processedPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden group hover:shadow-xl transition-all">
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <div className="relative w-full h-full">
                  <div className="w-full h-full overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <img
                      src={plan.preview}
                      alt={`${plan.title} floorplan preview`}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                      loading="eager"
                      width={400}
                      height={300}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        // Try alternative paths
                        if (target.src.includes('floorplans_output/')) {
                          // Try with a different path format
                          target.src = target.src.replace('floorplans_output/', '');
                        } else if (target.src.includes('/front/public/')) {
                          target.src = target.src.replace('/front/public/', '/');
                        } else {
                          // Fallback to placeholder
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgNDAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2YzcyODAiPk5vIHByZXZpZXcgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                        }
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300">
                    {selectedPlanId === plan.id && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1.5 shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">{plan.title}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('areaLabelShort')}:</span>
                    <span className="font-semibold">{plan.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('layout')}:</span>
                    <span className="font-semibold">{plan.rooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('floorsLabel')}:</span>
                    <span className="font-semibold">{plan.floors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('estimatedCostLabel')}:</span>
                    <span className="font-semibold text-primary">{plan.budget}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => handleView3D(e, plan.id)}
                    disabled={selectedPlanId !== plan.id}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {t('view3D')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => handleDownloadPDF(e, plan.id)}
                    disabled={selectedPlanId !== plan.id}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {t('downloadPDF')}
                  </Button>
                </div>

                <Button
                  className={cn(
                    "w-full",
                    selectedPlanId === plan.id
                      ? "bg-green-600 hover:bg-green-600/90"
                      : "bg-primary hover:bg-primary/90"
                  )}
                  onClick={(e) => handleSelectPlan(e, plan.id, plan.title)}
                >
                  {selectedPlanId === plan.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {t('selected')}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {t('selectPlan')}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}