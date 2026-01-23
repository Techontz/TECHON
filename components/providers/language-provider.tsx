"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "sw" | "fr" | "ar";

export const languages = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
] as const;

export const translations = {
  en: {
    // Navigation
    work: "Work",
    services: "Services",
    about: "About",
    contact: "Contact",
    startProject: "Start a Project",
    
    // Hero
    greeting: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
    heroTitle1: "We craft digital",
    heroTitle2: "products",
    heroTitle3: "that transform businesses",
    heroSubtitle: "A software studio building scalable apps, intelligent systems, and beautiful digital experiences.",
    viewWork: "View our work",
    projects: "Projects",
    years: "Years",
    clients: "Clients",
    offices: "Offices",
    
    // About
    aboutUs: "About us",
    aboutTitle1: "Building the future,",
    aboutTitle2: "one line at a time",
    aboutDesc1: "TechOn is a software development company founded in 2019, headquartered in Houston, Texas with offices in Dar es Salaam and Nairobi.",
    aboutDesc2: "We specialize in creating digital solutions that help businesses thrive. Our team combines technical expertise with deep understanding of global markets.",
    qualityFirst: "Quality First",
    qualityDesc: "We never compromise on code quality or user experience",
    partnership: "Partnership",
    partnershipDesc: "We work alongside you, not just for you",
    founded: "Founded",
    headquarters: "Headquarters",
    
    // Services
    whatWeDo: "What we do",
    servicesTitle: "Services",
    servicesSubtitle: "From concept to launch, we handle every aspect of your digital product with precision.",
    mobileApps: "Mobile Apps",
    mobileAppsDesc: "Native and cross-platform applications built with Flutter and React Native.",
    webDev: "Web Development",
    webDevDesc: "Fast, responsive websites using Next.js, React, and modern frameworks.",
    aiSolutions: "AI Solutions",
    aiSolutionsDesc: "Intelligent systems from chatbots to predictive analytics and automation.",
    businessSystems: "Business Systems",
    businessSystemsDesc: "Custom ERP, CRM, and POS solutions tailored to your operations.",
    games: "Games",
    gamesDesc: "Engaging mobile and desktop games that captivate your audience.",
    
    // Portfolio
    selectedWork: "Selected work",
    featuredProjects: "Featured projects",
    viewAllProjects: "View all projects",
    
    // Why Choose Us
    whyTechOn: "Why TechOn",
    whatSetsUsApart: "What sets us apart",
    reliableSecure: "Reliable & Secure",
    reliableSecureDesc: "Enterprise-grade security and 99.9% uptime for all our solutions.",
    onTimeDelivery: "On-Time Delivery",
    onTimeDeliveryDesc: "We respect deadlines and keep you informed every step of the way.",
    dedicatedTeam: "Dedicated Team",
    dedicatedTeamDesc: "A team that cares about your success as much as you do.",
    fastEfficient: "Fast & Efficient",
    fastEfficientDesc: "Agile methodologies that deliver results without the bloat.",
    
    // CTA
    readyToStart: "Ready to start?",
    ctaTitle1: "Let's build something",
    ctaTitle2: "extraordinary",
    ctaTitle3: "together",
    ctaSubtitle: "Whether you have a detailed spec or just an idea, we would love to hear from you.",
    orCallUs: "Or call us",
    
    // Footer
    navigation: "Navigation",
    connect: "Connect",
    locations: "Locations",
    privacy: "Privacy",
    terms: "Terms",
    brandTagline: "Building digital products that transform businesses worldwide.",
    
    // Portfolio Page
    allProjects: "All Projects",
    backToHome: "Back to home",
    showing: "Showing",
    project: "project",
    projectPlural: "projects",
    all: "All",
  },
  sw: {
    // Navigation
    work: "Kazi",
    services: "Huduma",
    about: "Kuhusu",
    contact: "Wasiliana",
    startProject: "Anza Mradi",
    
    // Hero
    greeting: {
      morning: "Habari za asubuhi",
      afternoon: "Habari za mchana",
      evening: "Habari za jioni",
    },
    heroTitle1: "Tunaunda",
    heroTitle2: "bidhaa",
    heroTitle3: "za kidijitali zinazobadilisha biashara",
    heroSubtitle: "Studio ya programu inayojenga programu zinazoweza kupanuliwa, mifumo ya akili, na uzoefu mzuri wa kidijitali.",
    viewWork: "Tazama kazi yetu",
    projects: "Miradi",
    years: "Miaka",
    clients: "Wateja",
    offices: "Ofisi",
    
    // About
    aboutUs: "Kuhusu sisi",
    aboutTitle1: "Kujenga siku zijazo,",
    aboutTitle2: "mstari mmoja kwa wakati",
    aboutDesc1: "TechOn ni kampuni ya uundaji wa programu iliyoanzishwa mwaka 2019, makao makuu yake yako Houston, Texas na ofisi zake ziko Dar es Salaam na Nairobi.",
    aboutDesc2: "Tunashughulikia kuunda suluhisho za kidijitali zinazosaidia biashara kustawi. Timu yetu inachanganya utaalamu wa kiufundi na uelewa wa kina wa masoko ya kimataifa.",
    qualityFirst: "Ubora Kwanza",
    qualityDesc: "Hatukubali maelewano kuhusu ubora wa msimbo au uzoefu wa mtumiaji",
    partnership: "Ushirikiano",
    partnershipDesc: "Tunafanya kazi pamoja nawe, si kwa ajili yako tu",
    founded: "Ilianzishwa",
    headquarters: "Makao Makuu",
    
    // Services
    whatWeDo: "Tunachofanya",
    servicesTitle: "Huduma",
    servicesSubtitle: "Kutoka dhana hadi uzinduzi, tunashughulikia kila kipengele cha bidhaa yako ya kidijitali kwa usahihi.",
    mobileApps: "Programu za Simu",
    mobileAppsDesc: "Programu za asili na za majukwaa mbalimbali zilizojengwa na Flutter na React Native.",
    webDev: "Uundaji wa Wavuti",
    webDevDesc: "Tovuti za haraka, zinazostahimili ukubwa kwa kutumia Next.js, React, na mifumo ya kisasa.",
    aiSolutions: "Suluhisho za AI",
    aiSolutionsDesc: "Mifumo ya akili kutoka kwa chatbots hadi uchambuzi wa kutabiri na automatiki.",
    businessSystems: "Mifumo ya Biashara",
    businessSystemsDesc: "ERP, CRM, na suluhisho za POS zilizobinafsishwa kwa shughuli zako.",
    games: "Michezo",
    gamesDesc: "Michezo ya simu na kompyuta inayovutia watazamaji wako.",
    
    // Portfolio
    selectedWork: "Kazi iliyochaguliwa",
    featuredProjects: "Miradi iliyoangaziwa",
    viewAllProjects: "Tazama miradi yote",
    
    // Why Choose Us
    whyTechOn: "Kwa nini TechOn",
    whatSetsUsApart: "Kinachotutofautisha",
    reliableSecure: "Kuaminika na Salama",
    reliableSecureDesc: "Usalama wa kiwango cha biashara na upatikanaji wa 99.9% kwa suluhisho zetu zote.",
    onTimeDelivery: "Utoaji kwa Wakati",
    onTimeDeliveryDesc: "Tunaheshimu tarehe za mwisho na kukujulisha kila hatua.",
    dedicatedTeam: "Timu Iliyojitolea",
    dedicatedTeamDesc: "Timu inayojali mafanikio yako kama unavyofanya wewe.",
    fastEfficient: "Haraka na Bora",
    fastEfficientDesc: "Mbinu za agile zinazoleta matokeo bila upotevu.",
    
    // CTA
    readyToStart: "Uko tayari kuanza?",
    ctaTitle1: "Tuunde kitu",
    ctaTitle2: "cha ajabu",
    ctaTitle3: "pamoja",
    ctaSubtitle: "Iwe una maelezo kamili au wazo tu, tungependa kusikia kutoka kwako.",
    orCallUs: "Au tupigie simu",
    
    // Footer
    navigation: "Urambazaji",
    connect: "Unganisha",
    locations: "Maeneo",
    privacy: "Faragha",
    terms: "Masharti",
    brandTagline: "Kuunda bidhaa za kidijitali zinazobadilisha biashara duniani kote.",
    
    // Portfolio Page
    allProjects: "Miradi Yote",
    backToHome: "Rudi nyumbani",
    showing: "Inaonyesha",
    project: "mradi",
    projectPlural: "miradi",
    all: "Yote",
  },
  fr: {
    // Navigation
    work: "Travail",
    services: "Services",
    about: "À propos",
    contact: "Contact",
    startProject: "Démarrer un Projet",
    
    // Hero
    greeting: {
      morning: "Bonjour",
      afternoon: "Bon après-midi",
      evening: "Bonsoir",
    },
    heroTitle1: "Nous créons des",
    heroTitle2: "produits",
    heroTitle3: "numériques qui transforment les entreprises",
    heroSubtitle: "Un studio logiciel construisant des applications évolutives, des systèmes intelligents et de belles expériences numériques.",
    viewWork: "Voir notre travail",
    projects: "Projets",
    years: "Années",
    clients: "Clients",
    offices: "Bureaux",
    
    // About
    aboutUs: "À propos de nous",
    aboutTitle1: "Construire l'avenir,",
    aboutTitle2: "une ligne à la fois",
    aboutDesc1: "TechOn est une société de développement logiciel fondée en 2019, dont le siège est à Houston, Texas, avec des bureaux à Dar es Salaam et Nairobi.",
    aboutDesc2: "Nous nous spécialisons dans la création de solutions numériques qui aident les entreprises à prospérer. Notre équipe combine expertise technique et compréhension approfondie des marchés mondiaux.",
    qualityFirst: "La Qualité d'Abord",
    qualityDesc: "Nous ne faisons jamais de compromis sur la qualité du code ou l'expérience utilisateur",
    partnership: "Partenariat",
    partnershipDesc: "Nous travaillons à vos côtés, pas seulement pour vous",
    founded: "Fondée",
    headquarters: "Siège Social",
    
    // Services
    whatWeDo: "Ce que nous faisons",
    servicesTitle: "Services",
    servicesSubtitle: "Du concept au lancement, nous gérons chaque aspect de votre produit numérique avec précision.",
    mobileApps: "Applications Mobiles",
    mobileAppsDesc: "Applications natives et multiplateformes construites avec Flutter et React Native.",
    webDev: "Développement Web",
    webDevDesc: "Sites web rapides et réactifs utilisant Next.js, React et des frameworks modernes.",
    aiSolutions: "Solutions IA",
    aiSolutionsDesc: "Systèmes intelligents des chatbots à l'analyse prédictive et l'automatisation.",
    businessSystems: "Systèmes d'Entreprise",
    businessSystemsDesc: "Solutions ERP, CRM et POS personnalisées adaptées à vos opérations.",
    games: "Jeux",
    gamesDesc: "Jeux mobiles et de bureau captivants qui captivent votre audience.",
    
    // Portfolio
    selectedWork: "Travail sélectionné",
    featuredProjects: "Projets en vedette",
    viewAllProjects: "Voir tous les projets",
    
    // Why Choose Us
    whyTechOn: "Pourquoi TechOn",
    whatSetsUsApart: "Ce qui nous distingue",
    reliableSecure: "Fiable et Sécurisé",
    reliableSecureDesc: "Sécurité de niveau entreprise et disponibilité de 99,9% pour toutes nos solutions.",
    onTimeDelivery: "Livraison à Temps",
    onTimeDeliveryDesc: "Nous respectons les délais et vous tenons informé à chaque étape.",
    dedicatedTeam: "Équipe Dédiée",
    dedicatedTeamDesc: "Une équipe qui se soucie de votre succès autant que vous.",
    fastEfficient: "Rapide et Efficace",
    fastEfficientDesc: "Méthodologies agiles qui livrent des résultats sans superflu.",
    
    // CTA
    readyToStart: "Prêt à commencer?",
    ctaTitle1: "Construisons quelque chose",
    ctaTitle2: "d'extraordinaire",
    ctaTitle3: "ensemble",
    ctaSubtitle: "Que vous ayez des spécifications détaillées ou juste une idée, nous serions ravis de vous entendre.",
    orCallUs: "Ou appelez-nous",
    
    // Footer
    navigation: "Navigation",
    connect: "Connecter",
    locations: "Emplacements",
    privacy: "Confidentialité",
    terms: "Conditions",
    brandTagline: "Créer des produits numériques qui transforment les entreprises dans le monde entier.",
    
    // Portfolio Page
    allProjects: "Tous les Projets",
    backToHome: "Retour à l'accueil",
    showing: "Affichage",
    project: "projet",
    projectPlural: "projets",
    all: "Tout",
  },
  ar: {
    // Navigation
    work: "الأعمال",
    services: "الخدمات",
    about: "عنا",
    contact: "اتصل",
    startProject: "ابدأ مشروع",
    
    // Hero
    greeting: {
      morning: "صباح الخير",
      afternoon: "مساء الخير",
      evening: "مساء الخير",
    },
    heroTitle1: "نصنع",
    heroTitle2: "منتجات",
    heroTitle3: "رقمية تحول الأعمال",
    heroSubtitle: "استوديو برمجيات يبني تطبيقات قابلة للتطوير وأنظمة ذكية وتجارب رقمية جميلة.",
    viewWork: "شاهد أعمالنا",
    projects: "المشاريع",
    years: "السنوات",
    clients: "العملاء",
    offices: "المكاتب",
    
    // About
    aboutUs: "عنا",
    aboutTitle1: "بناء المستقبل،",
    aboutTitle2: "سطر واحد في كل مرة",
    aboutDesc1: "تيكون هي شركة تطوير برمجيات تأسست عام 2019، يقع مقرها الرئيسي في هيوستن، تكساس مع مكاتب في دار السلام ونيروبي.",
    aboutDesc2: "نحن متخصصون في إنشاء حلول رقمية تساعد الشركات على الازدهار. يجمع فريقنا بين الخبرة التقنية والفهم العميق للأسواق العالمية.",
    qualityFirst: "الجودة أولاً",
    qualityDesc: "لا نتنازل أبداً عن جودة الكود أو تجربة المستخدم",
    partnership: "شراكة",
    partnershipDesc: "نعمل معك، وليس فقط من أجلك",
    founded: "تأسست",
    headquarters: "المقر الرئيسي",
    
    // Services
    whatWeDo: "ما نفعله",
    servicesTitle: "الخدمات",
    servicesSubtitle: "من الفكرة إلى الإطلاق، نتعامل مع كل جانب من جوانب منتجك الرقمي بدقة.",
    mobileApps: "تطبيقات الجوال",
    mobileAppsDesc: "تطبيقات أصلية ومتعددة المنصات مبنية باستخدام Flutter و React Native.",
    webDev: "تطوير الويب",
    webDevDesc: "مواقع ويب سريعة ومتجاوبة باستخدام Next.js و React والأطر الحديثة.",
    aiSolutions: "حلول الذكاء الاصطناعي",
    aiSolutionsDesc: "أنظمة ذكية من روبوتات الدردشة إلى التحليلات التنبؤية والأتمتة.",
    businessSystems: "أنظمة الأعمال",
    businessSystemsDesc: "حلول ERP و CRM و POS مخصصة لعملياتك.",
    games: "الألعاب",
    gamesDesc: "ألعاب جوال وسطح مكتب جذابة تأسر جمهورك.",
    
    // Portfolio
    selectedWork: "أعمال مختارة",
    featuredProjects: "مشاريع مميزة",
    viewAllProjects: "عرض جميع المشاريع",
    
    // Why Choose Us
    whyTechOn: "لماذا تيكون",
    whatSetsUsApart: "ما يميزنا",
    reliableSecure: "موثوق وآمن",
    reliableSecureDesc: "أمان على مستوى المؤسسات ووقت تشغيل 99.9% لجميع حلولنا.",
    onTimeDelivery: "التسليم في الوقت المحدد",
    onTimeDeliveryDesc: "نحترم المواعيد النهائية ونبقيك على اطلاع في كل خطوة.",
    dedicatedTeam: "فريق متخصص",
    dedicatedTeamDesc: "فريق يهتم بنجاحك بقدر اهتمامك أنت.",
    fastEfficient: "سريع وفعال",
    fastEfficientDesc: "منهجيات مرنة تحقق النتائج دون تعقيد.",
    
    // CTA
    readyToStart: "مستعد للبدء؟",
    ctaTitle1: "لنبني شيئاً",
    ctaTitle2: "استثنائياً",
    ctaTitle3: "معاً",
    ctaSubtitle: "سواء كان لديك مواصفات مفصلة أو مجرد فكرة، نود أن نسمع منك.",
    orCallUs: "أو اتصل بنا",
    
    // Footer
    navigation: "التنقل",
    connect: "تواصل",
    locations: "المواقع",
    privacy: "الخصوصية",
    terms: "الشروط",
    brandTagline: "بناء منتجات رقمية تحول الأعمال في جميع أنحاء العالم.",
    
    // Portfolio Page
    allProjects: "جميع المشاريع",
    backToHome: "العودة للرئيسية",
    showing: "عرض",
    project: "مشروع",
    projectPlural: "مشاريع",
    all: "الكل",
  },
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("language") as Language | null;
    if (stored && translations[stored]) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    const langConfig = languages.find(l => l.code === language);
    if (langConfig) {
      document.documentElement.dir = langConfig.dir;
      document.documentElement.lang = language;
    }
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    dir: languages.find(l => l.code === language)?.dir ?? "ltr",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}