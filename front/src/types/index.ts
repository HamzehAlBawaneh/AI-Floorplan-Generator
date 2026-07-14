// Standard project types
export type AreaUnit = 'm2' | 'dunum';

export type ProjectType = 'house' | 'school' | 'hospital' | 'commercial' | 'apartment' | 'villa';

export interface GeneratedPlan {
  id: string | number;
  title: string;
  imageUrl: string;
  area?: string;
  rooms?: string;
  floors?: string;
  budget?: string;
  preview?: string;
  pdfPath?: string;
}

export interface ProjectConfig {
  projectType: ProjectType;
  budget: number;
  file: File | null;
  floors: number;
  area: number;
  areaUnit: AreaUnit;
  generatedPlans: GeneratedPlan[];
}

export interface ApiError extends Error {
  status?: number;
  response?: string;
  code?: string;
}

// Form related types
export interface FormValues {
  projectType: ProjectType;
  budget: number;
  file: File | null;
  floors: number;
  area: number;
  areaUnit: AreaUnit;
}

// Component props
export interface UploadSectionProps {
  onGenerate: (data: FormValues) => void;
  projectType?: ProjectType;
  budget?: number;
  file?: File | null;
  floors?: number;
  area?: number | string;
  areaUnit?: AreaUnit;
  isLoading?: boolean;
}

export interface PlansDisplayProps {
  projectType: ProjectType;
  budget: number;
  plans?: GeneratedPlan[];
  isLoading?: boolean;
  error?: string | null;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Language types
export interface TranslationKey {
  [key: string]: string | TranslationKey;
}

export interface LanguageResources {
  [language: string]: {
    translation: TranslationKey;
  };
}
