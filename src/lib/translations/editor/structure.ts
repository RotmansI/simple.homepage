// src/lib/translations/editor/structure.ts

export const structureTranslations = {
  en: {
    tabs: {
      pages: "Structure",
      nav: "Top Nav Bar",
      settings: "Site Settings",
      tools: "Tool Box"
    },
    assetsTool: {
      title: "Assets Selection Tool",
      back: "Back"
    },
    pagesPanel: {
      pagesTitle: "Pages",
      sectionsTitle: "Sections",
      elementsTitle: "Elements",
      addSection: "ADD SECTION",
      suggestedPages: "Suggested Pages",
      quickAddPlaceholder: "Add Customized Page",
      customPagesTitle: "Custom Pages",
      customPagePlaceholder: "Enter page name...",
      customPageNote: "* Creating a custom page will generate a blank canvas for your own structure.",
      duplicate: "Duplicate",
      delete: "Delete"
    },
    navbarPanel: {
      headerTitle: "Navigation Bar Settings",
      headerSubtitle: "Brand identity, layout, colors and links",
      sections: {
        brand: "Brand Identity",
        theme: "Navigation Theme",
        actions: "Action Buttons",
        contact: "Contact Channels",
        location: "Location & Navigation"
      },
      brand: {
        textMode: "TEXT",
        logoMode: "LOGO",
        noLogo: "No Logo Set",
        changeLogo: "CHANGE LOGO",
        selectLogo: "SELECT LOGO",
        recommended: "Recommended:",
        logoNote: "PNG with transparent background. Height: 120px.",
        brandNameLabel: "Brand Name",
        typographyLabel: "Font"
      },
      theme: {
        selectElement: "Select Element to Edit",
        colorLegend: "Active Colors Legend",
        colorLabels: {
          bg_color: "Navbar Background",
          link_color: "Link Color (Default)",
          link_hover_color: "Link Color (Hover)",
          link_active_color: "Link Color (Active)"
        }
      },
      actions: {
        bookingUrl: "Booking URL",
        deliveryUrl: "Delivery & Takeout URL",
        note: "Buttons will only appear on the live site if a URL is provided."
      },
      contact: {
        phonePlaceholder: "Main Phone Number",
        igPlaceholder: "Instagram Profile Link",
        fbPlaceholder: "Facebook Business Page",
        whatsappTitle: "Enable WhatsApp",
        whatsappLabel: "WhatsApp Phone Number",
        whatsappNote: "Leave blank if same as contact number.",
        floatingIcon: "Enable Floating Icon",
        iconPosition: "Icon Position"
      },
      location: {
        addressLabel: "Address",
        addressPlaceholder: "Business Address",
        shortcuts: "Navigation Shortcuts",
        waze: "Waze",
        maps:"Maps"
      }
    },
    settingsPanel: {
      sections: {
        sitelang: "Site Language",
        typography: "Typography",
        branding: "Branding",
        openingHours: "Opening Hours",
        title: "Site Settings",
        subtitle: "Font, branding and working hours"
      },
      siteLanguage: {
      title: "Site Language",
      description: "Select the primary language for your website. This will affect text alignment (LTR/RTL), date formats, and public components like menus and forms.",
      label: "Selected Language",
      languages: {
        en: "English (LTR)",
        he: "Hebrew (RTL)"
      }
    },
      typography: {
        primaryLabel: "Primary Font (Headings)",
        secondaryLabel: "Secondary Font (Body)"
      },
      branding: {
        primary_color: "Primary Color",
        secondary_color: "Secondary Color",
        accent_color: "Accent Color",
        neutral_color: "Neutral Color"
      },
      days: {
        Sunday: "Sunday",
        Monday: "Monday",
        Tuesday: "Tuesday",
        Wednesday: "Wednesday",
        Thursday: "Thursday",
        Friday: "Friday",
        Saturday: "Saturday"
      },
      hoursPlaceholder: "12:00-23:00"
    },
    toolsPanel: {
      header: {
        label: "System Tools",
        title: "Management Centers"
      },
      assetManager: {
        title: "Asset Manager",
        subtitle: "Manage your assets"
      },
      menuManager: {
        title: "Menu Manager",
        subtitle: "Manage all your offers"
      },
      tip: {
        label: "Editor Tip",
        text: "Use the Asset Manager to organize your images into folders for better performance and easier selection during editing."
      }
    },
    assetsPanel: {
      openManager: "Open Asset Manager",
      searchPlaceholder: "Search Assets...",
      selectTitle: "Select Asset",
      itemsAvailable: "Items Available",
      noAssets: "No matching assets found in library",
      detailsModal: {
        title: "Asset Details",
        categoryLabel: "Category Mapping",
        selectBtn: "Select Image",
        deleteBtn: "Delete"
      }
    }
  },
  he: {
    tabs: {
      pages: "עמודי האתר",
      nav: "בר ניווט עליון",
      settings: "הגדרות אתר",
      tools: "ארגז כלים"
    },
    assetsTool: {
      title: "כלי בחירת פריט",
      back: "סגירה"
    },
    pagesPanel: {
      pagesTitle: "עמודים",
      sectionsTitle: "סקשנים",
      elementsTitle: "אלמנטים",
      addSection: "הוספת סקשן",
      suggestedPages: "הצעות מהירות",
      quickAddPlaceholder: "הוספת עמוד מהיר",
      customPagesTitle: "עמודים מותאמים",
      customPagePlaceholder: "שם העמוד...",
      customPageNote: "יצירת עמוד מותאם אישית תייצר קנבס ריק עבור המבנה שלך",
      duplicate: "שכפול",
      delete: "מחיקה"
    },
    navbarPanel: {
      headerTitle: "הגדרות בר ניווט",
      headerSubtitle: "זהות המותג, מבנה, צבעים וקישורים",
      sections: {
        brand: "זהות המותג",
        theme: "עיצוב התפריט",
        actions: "כפתורי פעולה",
        contact: "ערוצי התקשרות",
        location: "מיקום וניווט"
      },
      brand: {
        textMode: "טקסט",
        logoMode: "לוגו",
        noLogo: "לא הוגדר לוגו",
        changeLogo: "החלפת לוגו",
        selectLogo: "בחירת לוגו",
        recommended: "מומלץ: ",
        logoNote: "קובץ PNG עם רקע שקוף. גובה: 120 פיקסלים.",
        brandNameLabel: "שם המותג",
        typographyLabel: "גופן"
      },
      theme: {
        selectElement: "בחר אלמנט לעריכה",
        colorLegend: "מקרא צבעים פעילים",
        colorLabels: {
          bg_color: "רקע התפריט",
          link_color: "צבע קישור (ברירת מחדל)",
          link_hover_color: "צבע קישור (ריחוף)",
          link_active_color: "צבע קישור (פעיל)"
        }
      },
      actions: {
        bookingUrl: "קישור להזמנת מקום",
        deliveryUrl: "קישור למשלוחים",
        note: "הכפתורים יופיעו באתר רק אם יוזן קישור "
      },
      contact: {
        phonePlaceholder: "טלפון העסק",
        igPlaceholder: "קישור לפרופיל אינסטגרם",
        fbPlaceholder: "קישור לעמוד פייסבוק",
        whatsappTitle: "הפעלת וואטסאפ",
        whatsappLabel: "מספר וואטסאפ",
        whatsappNote: "השאר ריק אם זהו אותו מספר של העסק.",
        floatingIcon: "אייקון צף",
        iconPosition: "מיקום האייקון"
      },
      location: {
        addressLabel: "כתובת",
        addressPlaceholder: "כתובת העסק",
        shortcuts: "קיצורי דרך לניווט",
        waze: "Waze",
        maps: "Maps"
      }
    },
    settingsPanel: {
      sections: {
        sitelang: "שפת האתר",
        typography: "טיפוגרפיה",
        branding: "צבעי מותג",
        openingHours: "שעות פעילות",
        title: "הגדרות אתר",
        subtitle: "הגדרות גופן, צבעי מותג, שעות פעילות"
      },
      siteLanguage: {
      description: "בחרו את השפה המרכזית של האתר שלכם. הגדרה זו תשפיע על כיוון הטקסט (ימין-שמאל או שמאל-ימין), פורמט תאריכים ורכיבים ציבוריים כמו תפריטים וטפסים.",
      label: "שפה נבחרת",
      languages: {
        en: "אנגלית",
        he: "עברית"
      }
    },
      typography: {
        primaryLabel: "פונט ראשי (כותרות)",
        secondaryLabel: "פונט משני (טקסט רץ)"
      },
      branding: {
        primary_color: "צבע ראשי",
        secondary_color: "צבע משני",
        accent_color: "צבע דגש",
        neutral_color: "צבע ניטרלי"
      },
      days: {
        Sunday: "ראשון",
        Monday: "שני",
        Tuesday: "שלישי",
        Wednesday: "רביעי",
        Thursday: "חמישי",
        Friday: "שישי",
        Saturday: "שבת"
      },
      hoursPlaceholder: "12:00-23:00"
    },
    toolsPanel: {
  header: {
    label: "כלי מערכת",
    title: "מרכזי ניהול"
  },
  assetManager: {
    title: "ניהול מדיה",
    subtitle: "ניהול קבצי המדיה שלך והנכסים שלך"
  },
  menuManager: {
    title: "ניהול הצעות",
    subtitle: "ניהול כלל ההצעות והתפריטים"
  },
  tip: {
    label: "טיפ מהעורך",
    text: "השתמש בניהול הנכסים כדי לארגן את התמונות שלך בתיקיות לביצועים טובים יותר ובחירה קלה יותר בזמן העריכה."
  }
},
assetsPanel: {
  openManager: "פתיחת מנהל המדיה",
  searchPlaceholder: "חיפוש מדיה...",
  selectTitle: "בחירת פריט",
  itemsAvailable: "פריטים זמינים",
  noAssets: "לא נמצאו פריטים תואמים בספריה",
  detailsModal: {
    title: "מידע מורחב",
    categoryLabel: "שיוך לקטגוריה",
    selectBtn: "בחירת תמונה",
    deleteBtn: "מחיקה"
  }
}
  }
};