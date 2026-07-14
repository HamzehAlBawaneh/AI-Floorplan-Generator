import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Building2, Globe, Menu, X, Home, Info, LayoutGrid, Zap } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { ThemeToggle } from "./theme-toggle";
import { useNavigate, Link, useLocation } from "react-router-dom";

const navLinks = [
  { name: 'home', path: '/', icon: <Home className="w-4 h-4" /> },
  { name: 'features', path: '/features', icon: <LayoutGrid className="w-4 h-4" /> },
  { name: 'pricing', path: '/pricing', icon: <Zap className="w-4 h-4" /> },
  { name: 'contact', path: '/contact', icon: <Info className="w-4 h-4" /> },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled
        ? 'bg-background/90 backdrop-blur-lg shadow-sm'
        : 'bg-background/80 backdrop-blur-md'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ArchiMind
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-8 space-x-1">
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  asChild
                  variant={location.pathname === link.path ? 'secondary' : 'ghost'}
                  className={`gap-2 ${location.pathname === link.path ? 'font-medium' : 'text-muted-foreground'}`}
                >
                  <Link to={link.path}>
                    {link.icon}
                    {t(link.name)}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={toggleLanguage} className="gap-2">
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center
          ">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2">
            <div className="space-y-1 px-2">
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  asChild
                  variant={location.pathname === link.path ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-2 ${location.pathname === link.path ? 'font-medium' : 'text-muted-foreground'}`}
                  onClick={closeMobileMenu}
                >
                  <Link to={link.path}>
                    {link.icon}
                    {t(link.name)}
                  </Link>
                </Button>
              ))}
              <div className="pt-2 border-t mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toggleLanguage();
                    closeMobileMenu();
                  }}
                  className="w-full justify-start gap-2 mb-2"
                >
                  <Globe className="w-4 h-4" />
                  {language === 'en' ? 'العربية' : 'English'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
