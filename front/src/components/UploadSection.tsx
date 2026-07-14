import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  FileText,
  Home,
  Layers,
  Sparkles,
  ArrowRight,
  Loader2,
  DollarSign,
  LayoutGrid,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { BUDGET_RANGE } from "@/constants/upload.constants";
import { toast } from "sonner";

interface UploadSectionProps {
  onGenerate: (data: {
    projectType: string;
    budget: number;
    file: File | null;
    floors: number;
    rooms: number;
    bathrooms: number;
    area: number;
    areaUnit: "m2" | "dunum";
  }) => void;
  projectType?: string;
  budget?: number;
  file?: File | null;
  floors?: number;
  area?: number | string;
  areaUnit?: "m2" | "dunum";
}

const acceptImage = "image/png, image/jpeg, image/jpg";
const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:3000";

export function UploadSection({
  onGenerate,
  projectType: propProjectType = "house",
  budget: propBudget = 500000,
  file: propFile = null,
  floors: propFloors = 1,
  area: propArea = 250,
  areaUnit: propAreaUnit = "m2",
}: UploadSectionProps) {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(propFile);
  const [projectType, setProjectType] = useState<string>(propProjectType);
  const [budget, setBudget] = useState<number>(propBudget);
  const [isDragging, setIsDragging] = useState(false);
  const [floors, setFloors] = useState<number>(propFloors);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [area, setArea] = useState<number | string>(propArea);
  const [areaUnit, setAreaUnit] = useState<"m2" | "dunum">(propAreaUnit);
  const [rooms, setRooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!propFile && fileInputRef.current) {
      fileInputRef.current.value = "";
      setFile(null);
    }
  }, [propFile]);

  const projectTypes = [
    {
      value: "house",
      label: t("house"),
      icon: (
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          <Home className="w-6 h-6" />
        </div>
      )
    },
    {
      value: "deplex",
      label: t("deplex"),
      icon: (
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          <Layers className="w-6 h-6" />
        </div>
      )
    },
  ];

  const floorOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4+" },
  ];

  const roomOptions = [1, 2, 3, 4].map(num => ({
    value: num,
    label: num === 4 ? "4" : num.toString(),
    icon: num === 4 ? "4" : num.toString(),
  }));

  const bathroomOptions = [1, 2, 3, 4].map(num => ({
    value: num,
    label: num === 4 ? "4" : num.toString(),
    icon: num === 4 ? "4" : num.toString(),
  }));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      toast.success(t("uploadSuccess"));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success(t("uploadSuccess"));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    if (!file) {
      toast.error(t("errorUploadFile"));
      return false;
    }
    if (!projectType) {
      toast.error(t("errorSelectProjectType"));
      return false;
    }
    const numericArea = Number(area);
    if (isNaN(numericArea) || numericArea <= 0) {
      toast.error(t("errorInvalidArea"));
      return false;
    }
    if (!floors || floors < 1) {
      toast.error(t("errorSelectFloors"));
      return false;
    }
    if (!budget || budget < 250000) {
      toast.error(t("errorInvalidBudget"));
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    const numericArea = Number(area);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("projectType", projectType);
      formData.append("budget", String(budget));
      formData.append("floors", String(floors));
      formData.append("rooms", String(rooms));
      formData.append("bathrooms", String(bathrooms));
      formData.append("area", String(numericArea));
      formData.append("areaUnit", areaUnit);
      if (file) formData.append("file", file);

      const res = await fetch(`${API_BASE}/api/v1/generate-plans`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Request failed");
      }

      toast.success(t("uploadSuccess"));
      onGenerate({
        projectType,
        budget,
        file,
        floors,
        rooms,
        bathrooms,
        area: numericArea,
        areaUnit,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage || t("errorProcessingRequest"));
    } finally {
      setIsLoading(false);
    }
  };

  const numericAreaForCheck = Number(area);
  const isAreaInvalid = isNaN(numericAreaForCheck) || numericAreaForCheck <= 0;

  const isGenerateDisabled =
    !file ||
    !projectType ||
    isAreaInvalid ||
    !floors ||
    budget < 250000 ||
    isLoading;

  // Format budget value with proper suffix (K or M) based on the value
  const formatBudget = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}${t('millionSuffix')}`;
    }
    return `${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}${t('thousandSuffix')}`;
    const thousandSuffix = t("thousandSuffix");
    const millionSuffix = t("millionSuffix");

    if (value >= 1500000) {
      return `1.5${millionSuffix}+`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}${millionSuffix}`;
    }
    return `${(value / 1000).toFixed(0)}${thousandSuffix}`;
  };

  return (
    <section
      id="upload-section"
      className={`py-12 md:py-20 bg-gradient-to-b from-background to-muted/20 ${language === "ar" ? "font-arabic" : ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            {/* <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-3">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{t("getStarted")}</span>
            </div> */}
            <h2
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {t("uploadTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("uploadDropDescription")}
            </p>
          </div>

          {/* === 🚀 UNIFIED CARD === */}
          {/* We now have a single card for the entire flow */}
          <Card className="p-6 md:p-8 space-y-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            {/* --- STEP 1: UPLOAD --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {/* <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  1
                </div> */}
                <h3 className="text-lg font-semibold text-foreground">
                  {t("uploadStep1Title", "Upload Your Land Plot")}
                </h3>
              </div>
              {file ? (
                /* --- File Preview --- */
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-green-500 rounded-xl bg-green-500/5">
                  <FileText className="w-16 h-16 mx-auto text-primary" />
                  <div className="mt-4">
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleRemoveFile}
                    disabled={isLoading}
                  >
                    {t("remove")}
                  </Button>
                </div>
              ) : (
                /* --- Dropzone (Fixed) --- */
                <label
                  htmlFor="dropzone-file"
                  className={`group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isDragging
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/30 hover:bg-muted/20"
                    }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-6 text-center space-y-3">
                    <div className="p-3.5 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-medium text-foreground">
                        {t("clickToUpload")}{" "}
                        <span className="text-muted-foreground">
                          {t("orDragAndDrop")}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("fileRequirements")}
                      </p>
                    </div>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept={acceptImage}
                    onChange={handleFileInput}
                    ref={fileInputRef}
                  />
                </label>
              )}
            </div>

            {/* --- DIVIDER --- */}
            <hr className="border-border/50" />

            {/* --- STEP 2: CONFIGURE --- */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {/* <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  2
                </div> */}
                <h3 className="text-lg font-semibold text-foreground">
                  {t("uploadStep2Title", "Define Your Project")}
                </h3>
              </div>

              {/* Project Type */}
              <div className="space-y-5">
                <div>
                  <Label className="block text-sm font-medium text-foreground mb-2">
                    {t("projectType")}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {projectTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg text-center transition-all duration-200 ${projectType === type.value
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border bg-background hover:border-primary/30 hover:bg-muted/20"
                          }`}
                        onClick={() => setProjectType(type.value)}
                      >
                        <div className="mb-1.5">{type.icon}</div>
                        <span className="text-sm font-medium text-foreground">
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Area + Floors (Better Grouping) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Area */}
                <div className="space-y-3">
                  <Label
                    htmlFor="area"
                    className="text-sm font-medium text-foreground flex items-center gap-1.5"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    {t("area")}
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        id="area"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className={`w-full h-11 pl-4 pr-24 text-base ${isAreaInvalid ? "border-destructive" : ""}`}
                        min="1"
                        step="1"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 end-0 flex items-center bg-muted/30 rounded-r-md border-l border-border">
                        <select
                          value={areaUnit}
                          onChange={(e) => setAreaUnit(e.target.value as "m2" | "dunum")}
                          className="h-full pl-3 pr-8 text-sm bg-transparent border-0 focus:ring-0 focus:outline-none appearance-none text-foreground"
                        >
                          <option value="m2" className="text-foreground bg-background">m²</option>
                          <option value="dunum" className="text-foreground bg-background">{t("dunum")}</option>
                        </select>
                        <svg
                          className="absolute right-2 w-4 h-4 text-foreground/60 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {isAreaInvalid && (
                    <p className="text-sm text-destructive mt-1">
                      {t("errorInvalidArea")}
                    </p>
                  )}
                </div>

                {/* Floors */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    {t("floors")}
                  </Label>
                  <div className="relative">
                    <select
                      value={floors}
                      onChange={(e) => setFloors(Number(e.target.value))}
                      className="w-full h-11 pl-4 pr-10 text-base bg-background border border-input rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      {floorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} {t("floors")}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rooms + Bathrooms (Better Grouping) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Rooms */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-door-open"
                    >
                      <path d="M13 4h3a2 2 0 0 1 2 2v14" />
                      <path d="M2 20h3" />
                      <path d="M13 20h9" />
                      <path d="M10 12v.01" />
                      <path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z" />
                    </svg>
                    {t("rooms")}
                  </Label>
                  <div className="relative">
                    <select
                      value={rooms}
                      onChange={(e) => setRooms(Number(e.target.value))}
                      className="w-full h-11 pl-4 pr-10 text-base bg-background border border-input rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      {roomOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} {t("rooms").toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-bath"
                    >
                      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2v0" />
                      <path d="M10 5v3" />
                      <path d="M14 7v.01" />
                      <path d="M10 12v.01" />
                      <path d="M10 16v.01" />
                      <path d="M18 11h2" />
                      <path d="M4 15h16" />
                      <path d="M20 15v6" />
                      <path d="M4 15v6" />
                    </svg>
                    {t("bathrooms")}
                  </Label>
                  <div className="relative">
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full h-11 pl-4 pr-10 text-base bg-background border border-input rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      {bathroomOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} {t("bathrooms").toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- DIVIDER --- */}
            <hr className="border-border/50" />

            {/* --- STEP 3: BUDGET --- */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                {/* <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  3
                </div> */}
                <h3 className="text-lg font-semibold text-foreground">
                  {t("uploadStep3Title", "Set Your Budget")}
                </h3>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">
                    {t("budgetLabel")}
                  </Label>
                  <span className="text-base font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {formatBudget(budget)}
                  </span>
                </div>
                <div className="px-1">
                  <Slider
                    value={[budget]}
                    min={BUDGET_RANGE.MIN}
                    max={BUDGET_RANGE.MAX}
                    step={BUDGET_RANGE.STEP}
                    onValueChange={(value) => setBudget(value[0])}
                    className="py-4 [&>span:first-child]:h-2 [&>span:first-child]:bg-primary/20 [&>span[data-orientation=horizontal]>span]:h-2 [&>span[data-orientation=horizontal]>span]:bg-primary"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>{t("budgetMin")}</span>
                  <span>{t("budgetMax")}</span>
                </div>
              </div>
            </div>

            {/* --- DIVIDER --- */}
            <hr className="border-border/50" />

            {/* --- GENERATE BUTTON --- */}
            <div className="pt-2">
              <Button
                type="button"
                size="lg"
                className={`group w-full py-6 text-base font-medium transition-all duration-300 ${isGenerateDisabled
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-lg"
                  }`}
                onClick={handleGenerate}
                disabled={isGenerateDisabled}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("generating")}
                  </>
                ) : (
                  <>
                    {t("generatePlans")}
                    <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}