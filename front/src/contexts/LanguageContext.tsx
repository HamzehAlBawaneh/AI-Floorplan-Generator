import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

// Define the shape of our translations
interface TranslationKeys {
  [key: string]: string | { [key: string]: string };
}

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    heroTitle: "Turn Your Land Paper into a Complete Smart Building Design",
    heroSubtitle: "AI-Powered Architectural Planning",
    heroDescription: "Our intelligent platform analyzes your land ownership document, detecting area, boundaries, and angles with high precision. Generate 6+ professional architectural plans tailored to your project.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    uploadTitle: "Upload Your Land Document",
    uploadDropDescription: "Drop your land ownership document here or click to browse",
    uploadButton: "Upload Document",
    remove: "Remove",
    contactUs: "Contact Us",
    projectType: "Project Type",
    house: "House",
    deplex: "Duplex apartment",
    budgetLabel: "Budget Range",
    budgetMin: "250K",
    budgetMax: "1.5M+",
    generatePlans: "Generate Plans",
    generatedPlans: "Generated Plans",
    planCard: "Plan",
    view3D: "View in 3D",
    downloadPDF: "Download PDF",
    selectPlan: "Select Plan",
    newProject: "New Project",
    features: "Key Features",
    feature1Title: "AI Land Analysis",
    feature1Desc: "Automatic detection of area, boundaries, and angles from your document",
    feature2Title: "6+ Professional Plans",
    feature2Desc: "Multiple design options tailored to your budget and project type",
    feature3Title: "3D Previews",
    feature3Desc: "Visualize every design in realistic 3D before making a decision",
    feature4Title: "Detailed PDFs",
    // Navigation
    home: "Home",
    contact: "Contact",
    login: "Login",
    register: "Register",
    back: "Back",

    // Login Page
    welcomeBack: "Welcome back",
    signInToContinue: "Sign in to continue to ArchiMind",
    email: "Email address",
    password: "Password",
    forgotPassword: "Forgot password?",
    signIn: "Sign in",
    signingIn: "Signing in...",
    orContinueWith: "Or continue with",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign up",
    loginQuote: "Transform your architectural visions into reality with AI-powered design assistance.",

    // Feature section
    featuresTitle: "Powerful Features",
    featuresSubtitle: "Everything you need for your architectural projects",
    aiLandAnalysis: "AI Land Analysis",

    // CTA Section
    readyToStart: "Ready to get started?",
    ctaSubtitle: "Join thousands of architects and designers using our platform",
    feature4Desc: "Complete documentation with layouts, budgets, and QR codes",
    // Upload section
    uploadStep1Title: "Step 1: Upload Document",
    uploadStep2Title: "Step 2: Project Details",
    uploadStep3Title: "Step 3: Budget",
    clickToUpload: "Click to upload",
    orDragAndDrop: "or drag and drop",
    fileRequirements: "PDF, JPG, or PNG (max. 10MB)",

    // Project details
    area: "Area",
    rooms: "Rooms",
    bathrooms: "Bathrooms",
    numberOfFloors: "Number of Floors",
    floor: "Floor",
    floors: "Floors",
    enterArea: "Enter area",
    m2: "m²",
    areaLabelShort: "Area",
    dunum: "Dunam",
    thousandSuffix: "K",
    millionSuffix: "M",
    uploadSuccess: "Document uploaded successfully!",
    errorUploadFile: "Please upload a land document first",
    errorInvalidArea: "Please enter a valid area greater than zero",
    generatingPlansToast: "Generating architectural plans...",
    planDetails: "Plan Details",
    layout: "Layout",
    estimatedCost: "Estimated Cost",
    selectThisPlan: "Select This Plan",
    viewIn3D: "View in 3D",
    downloadPdf: "Download PDF",
    areaLabel: "Area",
    layoutLabel: "Layout",
    floorsLabel: "Floors",
    estimatedCostLabel: "Est. Cost",
    contactSubtitle: "Have questions? Get in touch with our team.",
    sendMessage: "Send us a message",

    fullName: "Full Name",
    enterFullName: "Enter your full name",
    enterEmail: "Enter your email address",
    subject: "Subject",
    enterSubject: "Enter the subject of your message",
    message: "Message",
    enterMessage: "Enter your message here...",
    enterName: "Enter your name",
    subjectPlaceholder: "How can we help?",
    messagePlaceholder: "Enter your message here...",
    contactInfo: "Contact Information",
    emailUs: "Email Us",
    callUs: "Call Us",
    visitUs: "Visit Us",
    value: "123 Design St., Tech City, 10001",


    // AR Translations
    viewInAR: "View in AR",
    arExperience: "AR Experience",
    arInstructions: "Point your camera at a flat surface to place the model",
    placeModel: "Place Model",
    resetModel: "Reset Position",
    exitAR: "Exit AR",
    arNotSupported: "AR is not supported on your device",
    arNotAvailable: "AR features are not available in your browser",
    arLoading: "Loading AR experience...",
    businessHours: "Business Hours",
    mondayToSunday: "Sunday - Thursday",
    saturday: "Saturday",
    Friday: "Friday",
    closed: "Closed",
    time1: "9:00 AM - 6:00 PM",
    time2: "10:00 AM - 4:00 PM",
    loginDescription: 'Enter your credentials to access your account',
    enterPassword: 'Enter your password',
    createAccount: 'Create an account',
    signupDescription: 'Enter your information to create an account',
    firstName: 'First name',
    enterFirstName: 'Enter your first name',
    lastName: 'Last name',
    enterLastName: 'Enter your last name',
    createPassword: 'Create a password',
    passwordRequirements: 'Use 8 or more characters with a mix of letters, numbers & symbols',
    confirmPassword: 'Confirm Password',
    confirmYourPassword: 'Confirm your password',
    alreadyHaveAccount: 'Already have an account?',
    termsAgreement: 'By clicking continue, you agree to our',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    and: 'and'
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    features: "المميزات",
    contact: "اتصل بنا",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    back: "عودة",

    // Login Page
    welcomeBack: "مرحباً بعودتك",
    signInToContinue: "سجل الدخول للمتابعة إلى ArchiMind",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    signIn: "تسجيل الدخول",
    signingIn: "جاري تسجيل الدخول...",
    orContinueWith: "أو تابع باستخدام",
    dontHaveAccount: "ليس لديك حساب؟",
    signUp: "إنشاء حساب",
    loginQuote: "حول رؤاك المعمارية إلى حقيقة مع مساعد التصميم المدعوم بالذكاء الاصطناعي.",

    // Feature section
    featuresTitle: "مميزات قوية",
    featuresSubtitle: "كل ما تحتاجه لمشاريعك المعمارية",
    aiLandAnalysis: "تحليل الأراضي بالذكاء الاصطناعي",

    // CTA Section
    readyToStart: "هل أنت مستعد للبدء؟",
    ctaSubtitle: "انضم إلى الآلاف من المهندسين المعماريين والمصممين الذين يستخدمون منصتنا",
    mondayToSunday: "الأحد - الخميس",

    createAccount: 'إنشاء حساب',
    signupDescription: 'أدخل معلوماتك لإنشاء حساب',
    firstName: 'الاسم الأول',
    enterFirstName: 'أدخل اسمك الأول',
    lastName: 'اسم العائلة',
    enterLastName: 'أدخل اسم العائلة',
    createPassword: 'إنشاء كلمة مرور',
    passwordRequirements: 'استخدم 8 أحرف أو أكثر مع مزيج من الأحرف والأرقام والرموز',
    confirmPassword: 'تأكيد كلمة المرور',
    confirmYourPassword: 'تأكيد كلمة المرور الخاصة بك',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    termsAgreement: 'بالنقر على متابعة، فإنك توافق على',
    termsOfService: 'شروط الخدمة',
    privacyPolicy: 'سياسة الخصوصية',
    and: 'و',
    time1: "9:00 صباحاً - 6:00 مساءً",
    time2: "10:00 صباحاً - 4:00 مساءً",
    saturday: "السبت",
    Friday: "الجمعة",
    closed: "الإغلاق",
    value: "123 شارع التصميم، مدينة التكنولوجيا، 10001",
    callUs: "اتصل بنا",
    emailUs: "راسلنا عبر البريد الإلكتروني",
    visitUs: "تفضل بزيارتنا",
    contactInfo: "معلومات الاتصال",
    heroTitle: "حوّل وثيقة أرضك إلى تصميم بناء ذكي متكامل",
    heroSubtitle: "التخطيط المعماري بالذكاء الاصطناعي",
    heroDescription: "منصتنا الذكية تحلل وثيقة ملكية أرضك، وتكتشف المساحة والحدود والزوايا بدقة عالية. توليد أكثر من 6 مخططات معمارية احترافية مصممة خصيصًا لمشروعك.",
    getStarted: "ابدأ الآن",
    contactUs: "اتصل بنا",
    sendMessage: "أرسل لنا رسالة",
    enterName: "أدخل اسمك",
    enterSubject: "أدخل موضوع رسالتك",
    enterMessage: "أدخل رسالتك هنا...",
    subjectPlaceholder: "كيف يمكننا مساعدتك؟",
    messagePlaceholder: "أدخل رسالتك هنا...",

    fullName: "الاسم الكامل",
    enterFullName: "أدخل اسمك الكامل",
    subject: "الموضوع",
    message: "رسالة",




    contactSubtitle: "هل لديك أسئلة؟ تواصل مع فريقنا.",
    learnMore: "اعرف المزيد",
    uploadTitle: "ارفع وثيقة الأرض",
    uploadDropDescription: "اسحب وثيقة ملكية الأرض هنا أو انقر للتصفح",
    uploadButton: "رفع الوثيقة",
    remove: "إزالة",
    projectType: "نوع المشروع",
    house: "منزل",
    deplex: "شقق طابقية",
    budgetLabel: "نطاق الميزانية",
    budgetMin: "250 ألف",
    budgetMax: "1.5 مليون+",
    generatePlans: "توليد المخططات",
    generatedPlans: "المخططات المولدة",
    planCard: "مخطط",
    view3D: "عرض ثلاثي الأبعاد",
    downloadPDF: "تحميل PDF",
    selectPlan: "اختر التصميم",
    newProject: "مشروع جديد",
    feature1Title: "تحليل الأرض بالذكاء الاصطناعي",
    feature1Desc: "كشف تلقائي للمساحة والحدود والزوايا من وثيقتك",
    feature2Title: "أكثر من 6 مخططات احترافية",
    feature2Desc: "خيارات تصميم متعددة مصممة حسب ميزانيتك ونوع مشروعك",
    feature3Title: "معاينات ثلاثية الأبعاد",
    feature3Desc: "تصور كل تصميم بشكل واقعي قبل اتخاذ القرار",
    feature4Title: "ملفات PDF مفصلة",
    feature4Desc: "توثيق كامل مع المخططات والميزانيات ورموز QR",
    // Upload section
    uploadStep1Title: "الخطوة 1: رفع المستند",
    uploadStep2Title: "الخطوة 2: تفاصيل المشروع",
    uploadStep3Title: "الخطوة 3: الميزانية",
    clickToUpload: "انقر للرفع",
    orDragAndDrop: "أو اسحب وأفلت",
    fileRequirements: "PDF, JPG, أو PNG (الحد الأقصى 10 ميجابايت)",

    // Project details
    area: "المساحة",
    rooms: "الغرف",
    bathrooms: "دورات المياه",
    numberOfFloors: "عدد الطوابق",
    floor: "طابق",
    floors: "طوابق",
    enterArea: "أدخل المساحة",
    m2: "م²",
    areaLabelShort: "المساحة",
    dunum: "دونم",
    thousandSuffix: "ألف",
    millionSuffix: "مليون",
    uploadSuccess: "تم رفع الوثيقة بنجاح!",
    errorUploadFile: "يرجى رفع وثيقة الأرض أولاً",
    errorInvalidArea: "يرجى إدخال مساحة صالحة أكبر من صفر",
    generatingPlansToast: "جاري توليد المخططات المعمارية...",
    planDetails: "تفاصيل المخطط",
    layout: "التخطيط",
    estimatedCost: "التكلفة التقديرية",
    selectThisPlan: "اختر هذا المخطط",
    viewIn3D: "عرض ثلاثي الأبعاد",
    downloadPdf: "تحميل PDF",
    areaLabel: "المساحة",
    layoutLabel: "التصميم",
    floorsLabel: "الطوابق",
    estimatedCostLabel: "التكلفة التقديرية",

    // AR Translations
    viewInAR: "عرض بالواقع المعزز",
    arExperience: "تجربة الواقع المعزز",
    arInstructions: "وجه كاميرا هاتفك نحو سطح مستوٍ لوضع النموذج",
    placeModel: "وضع النموذج",
    resetModel: "إعادة تعيين الموضع",
    exitAR: "خروج من الواقع المعزز",
    arNotSupported: "الواقع المعزز غير مدعوم على جهازك",
    arNotAvailable: "ميزات الواقع المعزز غير متوفرة في متصفحك",
    arLoading: "جاري تحميل تجربة الواقع المعزز...",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language | null;
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else if (navigator.language.startsWith('ar')) {
      setLanguage('ar');
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key: TranslationKey, fallback: string = ''): string => {
    try {
      const translation = translations[language]?.[key] || translations.en[key];
      if (!translation) {
        console.warn(`Missing translation for key: ${key}`);
        return fallback || key as string;
      }
      return translation as string;
    } catch (error) {
      console.error('Translation error:', error);
      return fallback || key as string;
    }
  };

  // Set initial HTML language attribute
  useEffect(() => {
    document.documentElement.lang = language;
    // Force LTR direction for all languages
    document.documentElement.dir = 'ltr';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div
        dir="ltr"
        className={`${language === 'ar' ? 'font-arabic' : ''} ${language}-content`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

// Export the context to be used with the useLanguage hook
export { LanguageContext };

export default LanguageProvider;