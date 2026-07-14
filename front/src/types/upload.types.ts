export type AreaUnit = 'm2' | 'dunum';

export interface ProjectType {
  value: string;
  label: string;
  icon: string;
}

export interface FloorOption {
  value: number;
  label: string;
}

export interface UploadSectionProps {
  onGenerate: (data: {
    projectType: string;
    budget: number;
    file: File;
    floors: number;
    area: number;
    areaUnit: AreaUnit;
  }) => Promise<void> | void;
  projectType?: string;
  budget?: number;
  file?: File | null;
  floors?: number;
  area?: number | string;
  areaUnit?: AreaUnit;
}

export interface FormData {
  projectType: string;
  budget: number;
  file: File | null;
  floors: number;
  area: number | string;
  areaUnit: AreaUnit;
}
