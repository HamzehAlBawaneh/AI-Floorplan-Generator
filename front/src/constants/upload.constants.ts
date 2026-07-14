import { ProjectType, FloorOption } from '@/types/upload.types';

export const ACCEPTED_IMAGE_TYPES = 'image/png, image/jpeg, image/jpg';

export const PROJECT_TYPES: ProjectType[] = [
  { value: 'house', label: 'house', icon: '🏠' },
  { value: 'school', label: 'school', icon: '🏫' },
  { value: 'university', label: 'university', icon: '🎓' },
  { value: 'commercial', label: 'commercial', icon: '🏢' },
];

export const FLOOR_OPTIONS: FloorOption[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4+' },
];

export const BUDGET_RANGE = {
  MIN: 250000,
  MAX: 1500000,
  STEP: 50000,
} as const;
