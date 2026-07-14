import * as React from 'react';
import { Theme as RadixTheme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

type Appearance = 'light' | 'dark' | 'inherit';
type AccentColor = 'blue' | 'violet' | 'indigo' | 'green' | 'red' | 'orange' | 'yellow' | 'gray';
type GrayColor = 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand' | 'auto';
type PanelBackground = 'solid' | 'translucent';
type Radius = 'none' | 'small' | 'medium' | 'large' | 'full';
type Scaling = '90%' | '95%' | '100%' | '105%' | '110%';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark';
  accentColor?: AccentColor;
  grayColor?: GrayColor;
  panelBackground?: PanelBackground;
  radius?: Radius;
  scaling?: Scaling;
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  accentColor = 'blue',
  grayColor = 'gray',
  panelBackground = 'solid',
  radius = 'medium',
  scaling = '100%',
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [appearance, setAppearance] = React.useState<Appearance>(defaultTheme);

  React.useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setAppearance(savedTheme);
    }
  }, []);

  // Update document class when appearance changes
  React.useEffect(() => {
    if (appearance !== 'inherit') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(appearance);
    }
  }, [appearance]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <RadixTheme
      appearance={appearance}
      accentColor={accentColor}
      grayColor={grayColor}
      panelBackground={panelBackground}
      radius={radius}
      scaling={scaling}
      {...props}
    >
      {children}
    </RadixTheme>
  );
}
