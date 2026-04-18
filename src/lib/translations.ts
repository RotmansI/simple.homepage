export type Language = 'en' | 'he';

export const translations = {
  en: {
    // General
    dir: 'ltr',
    brandName: "Simple.",
    switchLang: "עברית",
    city: "Tel Aviv",
    temp: "Clear",

    // Landing Page
    welcome: "The Smartest Way to Build Your Business Website",
    subtitle: "Create a professional presence for your brand in minutes. Simple, modular, and designed for growth.",
    login: "Login",
    register: "Start Building",
    demo: "View Demo",
    noCode: "No Coding Required",
    multi: "Automated, simple, and effective.",

    // Auth Flow
    email: "Email Address",
    password: "Password",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    noAccount: "New here? Create an account",
    hasAccount: "Already a member? Log in",
    authError: "Authentication failed",
    checkEmail: "Check your email for confirmation link!",

    // Dashboard & Layout
    hi: "Hi",
    welcomeBack: "Happy to see you again at Simple.",
    dashboard: "Dashboard",
    myOrganizations: "My Businesses",
    noOrgsTitle: "No businesses found",
    noOrgsSub: "To start building your site, you need to create or be associated with a business profile.",
    contactSales: "Contact Support",
    stats_visits: "Total Visits",
    stats_menu: "Engagement",
    stats_leads: "Leads Generated",
    dailyInsight: "Daily Insight",
    insightText: "High-quality images on your homepage can increase user engagement by up to 30%. Consider updating your gallery today!",
    whatsHappening: "Performance this week",
    upgrades: "Available Features",
    add: "Add",
    upgrade: "Upgrade",

    // User Menu
    userMenu: {
      profile: "Profile",
      settings: "Settings",
      whatsNew: "What's New",
      contact: "Support",
      adminArea: "Platform Admin",
      systemAdmin: "System Management",
      userOrgMgmt: "Accounts & Business Management",
      logout: "Logout"
    },

    // Admin Management Area
    admin: {
      title: "Accounts Management",
      subtitle: "Manage platform operators, users, and Simple. businesses.",
      tabs: {
        operators: "Operators",
        users: "Users",
        orgs: "Businesses"
      },
      operators: {
        title: "Platform Operators",
        countSuffix: "records",
        searchPlaceholder: "Search...",
        addBtn: "Add Operator",
        table: {
          user: "User",
          email: "Email",
          updatedAt: "Updated At",
          updatedBy: "Updated By",
          actions: "Actions",
          system: "System"
        },
        modal: {
          title: "Add New Operator",
          searchPlaceholder: "Search by name or email...",
          noResults: "No matching users found",
          typeToSearch: "Type at least 2 letters...",
          add: "Add"
        }
      },
      users: {
        role: "Role",
        linkedOrgs: "Associated Businesses",
        unassigned: "Unassigned",
        siteEditor: "Editor",
        siteAdmin: "Admin",
        addOrg: "Link Business",
        searchOrg: "Search for business..."
      },
      orgs: {
        addBtn: "New Business Profile",
        table: {
          org: "Business",
          slug: "URL Slug",
          users: "Team",
          deactivate: "Deactivate",
          activate: "Activate"
        },
        modal: {
          title: "Create Business Profile",
          slug: "URL Slug (e.g. my-business)",
          nameHe: "Name (Hebrew)",
          nameEn: "Name (English)",
          logoSmall: "Small Logo URL",
          logoLarge: "Large Logo URL",
          businessInfo: "Business Description",
          save: "Create Profile",
          cancel: "Cancel"
        }
      }
    }
  },
  he: {
    // General
    dir: 'rtl',
    brandName: "Simple.",
    switchLang: "English",
    city: "תל אביב",
    temp: "בהיר",

    // Landing Page
    welcome: "הדרך החכמה ביותר לבנות אתר לעסק שלך",
    subtitle: "צור נוכחות מקצועית למותג שלך תוך דקות. פשוט, מודולרי ומעוצב לצמיחה.",
    login: "כניסה",
    register: "התחלו לבנות",
    demo: "צפו בדמו",
    noCode: "ללא צורך בקוד",
    multi: "אוטומטי, פשוט ואפקטיבי.",

    // Auth Flow
    email: "כתובת אימייל",
    password: "סיסמה",
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    phone: "מספר טלפון",
    noAccount: "חדשים כאן? ליצירת חשבון",
    hasAccount: "כבר רשומים? להתחברות",
    authError: "התחברות נכשלה",
    checkEmail: "בדקו את תיבת המייל לאישור ההרשמה",

    // Dashboard & Layout
    hi: "היי",
    welcomeBack: "שמחים לראות אותך שוב ב-Simple.",
    dashboard: "לוח בקרה",
    myOrganizations: "העסקים שלי",
    noOrgsTitle: "לא נמצאו עסקים משויכים",
    noOrgsSub: "כדי להתחיל לבנות את האתר, עליך ליצור פרופיל עסקי או להשתייך לאחד קיים.",
    contactSales: "יצירת קשר עם התמיכה",
    stats_visits: "כניסות לאתר",
    stats_menu: "מעורבות גולשים",
    stats_leads: "פניות מלקוחות",
    dailyInsight: "תובנה יומית",
    insightText: "תמונות איכותיות בדף הבית מעלות את מעורבות הגולשים ב-30%. כדאי לעדכן את הגלריה שלך!",
    whatsHappening: "ביצועים השבוע",
    upgrades: "פיצ'רים זמינים",
    add: "הוספה",
    upgrade: "שדרוג",

    // User Menu
    userMenu: {
      profile: "פרופיל",
      settings: "הגדרות",
      whatsNew: "מה חדש",
      contact: "תמיכה",
      adminArea: "ניהול פלטפורמה",
      systemAdmin: "ניהול מערכת",
      userOrgMgmt: "ניהול חשבונות ועסקים",
      logout: "התנתקות"
    },

    // Admin Management Area
    admin: {
      title: "ניהול חשבונות ועסקים",
      subtitle: "ניהול אופרייטורים, משתמשים ופרופילי עסקים ב-Simple.",
      tabs: {
        operators: "אופרייטורים",
        users: "משתמשים",
        orgs: "עסקים"
      },
      operators: {
        title: "אופרייטורים במערכת",
        countSuffix: "רשומות",
        searchPlaceholder: "חיפוש...",
        addBtn: "הוספת אופרייטור",
        table: {
          user: "משתמש",
          email: "מייל",
          updatedAt: "תאריך עדכון",
          updatedBy: "עודכן על ידי",
          actions: "פעולות",
          system: "מערכת"
        },
        modal: {
          title: "הוספת אופרייטור חדש",
          searchPlaceholder: "חיפוש לפי שם או אימייל...",
          noResults: "לא נמצאו משתמשים מתאימים",
          typeToSearch: "הקלד לפחות 2 אותיות...",
          add: "הוספה"
        }
      },
      users: {
        role: "תפקיד",
        linkedOrgs: "עסקים מקושרים",
        unassigned: "ללא שיוך",
        siteEditor: "עורך אתר",
        siteAdmin: "מנהל אתר",
        addOrg: "שיוך לעסק",
        searchOrg: "חפש עסק..."
      },
      orgs: {
        addBtn: "פרופיל עסקי חדש",
        table: {
          org: "עסק",
          slug: "מזהה URL",
          users: "צוות",
          deactivate: "השבת",
          activate: "הפעל"
        },
        modal: {
          title: "יצירת פרופיל עסקי",
          slug: "מזהה URL (למשל my-business)",
          nameHe: "שם בעברית",
          nameEn: "שם באנגלית",
          logoSmall: "קישור ללוגו קטן",
          logoLarge: "קישור ללוגו גדול",
          businessInfo: "תיאור העסק",
          save: "צור פרופיל",
          cancel: "ביטול"
        }
      }
    }
  }
};