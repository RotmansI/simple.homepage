// src/lib/translations/editor/modals.ts

export const modalTranslations = {
  en: {
    assetManager: {
      title: "Asset Manager",
      modes: {
        select: "Selection",
        manage: "Manager Mode"
      },
      actions: {
        newFolder: "New Folder",
        upload: "Upload Assets",
        refresh: "Refresh"
      },
      errors: {
        loadFailed: "Failed to load assets"
      },
      navigation: {
        home: "Home"
      },
      assetGrid: {
        loading: "Scanning Library...",
        emptyFolder: "Empty Folder",
        items: "Items",
        uses: "Uses",
        available: "Available",
        deleteFolderConfirm: "Are you sure you want to delete the folder",
        deleteSuccess: "Folder deleted successfully",
        deleteInconsistent: "Folder structure is inconsistent, could not find .keep file",
        deleteFailed: "Failed to delete folder"
      },
      assetDetail: {
        back: "Back to Library",
        openOriginal: "Open original",
        controlTitle: "Asset Control",
        controlSubtitle: "Metadata & Live Status",
        renameLabel: "Rename File",
        renamePlaceholder: "Enter new name...",
        moveLabel: "Move Path",
        usageLabel: "Usage Locations",
        hits: "Hits",
        notInUse: "Not in use on your site.",
        technical: {
          uploaded: "Uploaded",
          format: "Format"
        },
        updateBtn: "Update Asset",
        deleteBtn: "Delete Asset",
        errors: {
          emptyName: "File name cannot be empty",
          updateFailed: "Update failed",
          deleteFailed: "Failed to delete"
        },
        success: {
          updated: "Asset updated successfully",
          deleted: "Asset deleted permanently"
        },
        confirmDelete: "Are you sure you want to permanently delete"
      },
      createFolder: {
        title: "New Folder",
        subtitle: "Structure your library",
        label: "Folder Name",
        placeholder: "e.g. Banners, Summer-Sale...",
        locationLabel: "Target Location",
        rootLocation: "Root Library",
        filesPrefix: "Files",
        cancel: "Cancel",
        create: "Create Folder",
        success: "Folder created successfully",
        validationNote: "Only English letters and hyphens (-) are allowed",
        error: "Failed to create folder"
      },
      uploadPreview: {
        title: "Confirm Upload",
        subtitle: "Adding to your library",
        destLabel: "Destination Folder",
        rootLocation: "Root Library",
        nameLabel: "Asset Name",
        namePlaceholder: "Give this file a name...",
        finishBtn: "Finish & Upload",
        errors: {
          emptyName: "Please enter a file name",
          uploadFailed: "Upload failed"
        },
    }
    },
    menuManager: {
      title: "Menu Center",
      subtitle: "Global Assets Management",
      libraryLabel: "Library",
      tabs: {
        content: "Content",
        availability: "Availability"
      },
      actions: {
        import: "Import JSON",
        create: "Create Menu",
        save: "Save Menu",
        saving: "Saving...",
        addItem: "Add Item",
        addCategory: "Add Category",
        deleteConfirm: "Are you sure? This will delete the entire menu."
      },
      placeholders: {
        menuName: "Menu Name",
        description: "Add a short description...",
        categoryName: "Category Name",
        dishName: "Dish Name",
        dishDescription: "Description...",
        imageUrl: "Image URL (https://...)",
        importPrompt: "Enter a name for the imported menu:",
        importedMenuDefault: "Imported Menu"
      },
      defaults: {
        newMenu: "New Menu",
        newCategory: "New Category",
        newItem: "New Item",
        unnamedCategory: "Unnamed Category",
        unnamedItem: "Unnamed Item"
      },
      availability: {
        from: "From",
        until: "Until"
      },
      emptyState: {
        title: "Ready to serve?",
        subtitle: "Select a menu or create a new one to get started."
      },
      toasts: {
        loadError: "Error loading menus",
        importSuccess: "Menu imported!",
        createSuccess: "New menu created!",
        createError: "Failed to create menu",
        noJsonData: "No data found in JSON",
        parseError: "Failed to parse JSON file",
        saveSuccess: "All changes saved to cloud",
        saveError: "Error saving changes",
        deleteSuccess: "Menu deleted permanently"
      }
    },
    colorPicker: {
    tooltips: {
      eyeDropper: "Pick color from screen"
    },
    sections: {
      branding: "Branding Palette",
      recent: "Used in Page"
    },
    errors: {
      noEyeDropper: "Your browser does not support the EyeDropper API"
    }
  },
  fontPicker: {
      defaultFont: "Select Font",
      triggerSubtitle: "Click to change typography"
    },
    fontPickerModal: {
      title: "Typography Library",
      subtitle: "Select a font for your project",
      tabs: {
        hebrew: "Hebrew",
        all: "All Fonts"
      },
      searchPlaceholder: "Search for a font name...",
      loading: "Fetching Library...",
      previewText: "Preview",
      loadMore: "Load More Typography",
      badges: {
        hebrew: "Hebrew"
      }
    },
    addSection: {
      title: "Add Section",
      subtitle: "Craft your story",
      recommended: "Recommended",
      exploreAll: "Explore All",
      readyTitle: "Ready to add this section?",
      readySubtitle: "You can customize all content and colors later.",
      addBtn: "Add to Page",
      proTip: "Pro Tip",
      featuresTitle: "Top Features",
      proTipText: {
        top: "This section works best when placed at the top of your page to maintain visual flow.",
        middle: "This section works best when placed after a clean divider to maintain visual flow."
      },
      categories: {
        basics: "Basics",
        content: "Content",
        dividers: "Dividers",
        "split-views": "Split Views"
      },
sections: {
        flex: { 
          label: "Custom Canvas", 
          desc: "Free-form drag and drop canvas",
          features: ['Control section dimensions', 'Design the background', 'Add multi-elements', 'Call to action']
        },
        hero: { 
          label: "Hero Slider", 
          desc: "High impression at first sight",
          features: ['Create impressive image sliders', 'Add your logo or other images on top', 'Add titles, text and buttons', 'Show more, Speak less']
        },
        contact: { 
          label: "Contact Us", 
          desc: "Creates your contact page",
          features: ['Fully designed - Fully informative', 'All contact methods', 'Location widget', 'Socials Icons', 'Contact form']
        },
        form: { 
          label: "Lead Form", 
          desc: "Customized form for any purpose",
          features: ['Any Purpose', 'Customize fields', 'Choose what happens next']
        },
        gallery: { 
          label: "Image Gallery", 
          desc: "Responsive image grid",
          features: ['Lightbox', 'Grid/Slider']
        },
        menu: { 
          label: "Digital Menu", 
          desc: "Live food & drinks menu",
          features: ['Menu Manager sync']
        },
        table: { 
          label: "Data Table", 
          desc: "Structured pricing or info table",
          features: ['Rows/Cols', 'Styling options']
        },
        review: { 
          label: "Reviews", 
          desc: "Easy share real reviews",
          features: ['Star ratings', 'Avatars', 'Real-time reviews', 'Shuffle mode']
        },
        video: { 
          label: "Video Player", 
          desc: "Content Maximizes",
          features: ['Autoplay', 'Custom cover']
        },
        "divider-line": { 
          label: "Line Divider", 
          desc: "Simple thin line separator",
          features: ['Adjustable weight']
        },
        "divider-spacer": { 
          label: "Empty Spacer", 
          desc: "Blank vertical space",
          features: ['Height control']
        },
        "split-50": { 
          label: "50/50 Split", 
          desc: "Image and text side by side",
          features: ['Reversible', 'Balanced']
        },
        "split-card": { 
          label: "Card Split", 
          desc: "Content card over background",
          features: ['Floating effect']
        }
      }
    }
  },
  he: {
    assetManager: {
      title: "מנהל המדיה",
      modes: {
        select: "בחירה",
        manage: "מצב ניהול"
      },
      actions: {
        newFolder: "תיקייה חדשה",
        upload: "העלאת קבצים",
        refresh: "רענון"
      },
      errors: {
        loadFailed: "טעינת הקבצים נכשלה"
      },
      navigation: {
        home: "בית"
      },
      assetGrid: {
        loading: "סורק את הספרייה...",
        emptyFolder: "תיקייה ריקה",
        items: "פריטים",
        uses: "שימושים",
        available: "זמין",
        deleteFolderConfirm: "האם אתה בטוח שברצונך למחוק את התיקייה",
        deleteSuccess: "התיקייה נמחקה בהצלחה",
        deleteInconsistent: "מבנה התיקייה אינו עקבי, לא נמצא קובץ .keep",
        deleteFailed: "מחיקת התיקייה נכשלה"
      },
      assetDetail: {
        back: "חזרה לספריה",
        openOriginal: "פתח מקור",
        controlTitle: "ניהול קובץ",
        controlSubtitle: "מטא-דאטה וסטטוס",
        renameLabel: "שינוי שם קובץ",
        renamePlaceholder: "הזן שם חדש...",
        moveLabel: "העברה לנתיב אחר",
        usageLabel: "מוצג במקומות הבאים:",
        hits: "שימושים",
        notInUse: "לא בשימוש באתר שלך.",
        technical: {
          uploaded: "הועלה ב-",
          format: "פורמט"
        },
        updateBtn: "עדכון קובץ",
        deleteBtn: "מחיקת קובץ",
        errors: {
          emptyName: "שם הקובץ אינו יכול להיות ריק",
          updateFailed: "העדכון נכשל",
          deleteFailed: "המחיקה נכשלה"
        },
        success: {
          updated: "הקובץ עודכן בהצלחה",
          deleted: "הקובץ נמחק לצמיתות"
        },
        confirmDelete: "האם אתה בטוח שברצונך למחוק לצמיתות את הקובץ"
      },
      createFolder: {
        title: "תיקייה חדשה",
        subtitle: "ארגון מבנה הספרייה",
        label: "שם התיקייה",
        placeholder: "Banners, Summer-Sale...",
        locationLabel: "מיקום יעד",
        rootLocation: "ספרייה ראשית",
        filesPrefix: "קבצים",
        cancel: "ביטול",
        create: "יצירת תיקייה",
        success: "התיקייה נוצרה בהצלחה",
        error: "יצירת התיקייה נכשלה",
        validationNote: "ניתן להשתמש באותיות באנגלית ובמקף (-) בלבד",
      },
      uploadPreview: {
        title: "אישור העלאה",
        subtitle: "הוספה לספריית המדיה שלך",
        destLabel: "תיקיית יעד",
        rootLocation: "ספרייה ראשית",
        nameLabel: "שם הנכס",
        namePlaceholder: "תן שם לקובץ...",
        finishBtn: "סיום והעלאה",
        errors: {
          emptyName: "נא להזין שם לקובץ",
          uploadFailed: "ההעלאה נכשלה"
        },
    }
    },
menuManager: {
      title: "מרכז תפריטים",
      subtitle: "ניהול פריטים גלובלי",
      libraryLabel: "ספריה",
      tabs: {
        content: "תוכן",
        availability: "זמינות"
      },
      actions: {
        import: "ייבוא JSON",
        create: "יצירת תפריט",
        save: "שמירת תפריט",
        saving: "שומר...",
        addItem: "הוספת פריט",
        addCategory: "הוספת קטגוריה",
        deleteConfirm: "האם אתה בטוח? פעולה זו תמחק את כל התפריט."
      },
      placeholders: {
        menuName: "שם התפריט",
        description: "הוסף תיאור קצר...",
        categoryName: "שם הקטגוריה",
        dishName: "שם המנה",
        dishDescription: "תיאור המנה...",
        imageUrl: "קישור לתמונה (https://...)",
        importPrompt: "הזן שם עבור התפריט המיובא:",
        importedMenuDefault: "תפריט מיובא"
      },
      defaults: {
        newMenu: "תפריט חדש",
        newCategory: "קטגוריה חדשה",
        newItem: "מנה חדשה",
        unnamedCategory: "קטגוריה ללא שם",
        unnamedItem: "מנה ללא שם"
      },
      availability: {
        from: "מ-",
        until: "עד-"
      },
      emptyState: {
        title: "מוכנים להגיש?",
        subtitle: "בחר תפריט מהרשימה או צור אחד חדש כדי להתחיל."
      },
      toasts: {
        loadError: "שגיאה בטעינת תפריטים",
        importSuccess: "התפריט יובא בהצלחה!",
        createSuccess: "תפריט חדש נוצר!",
        createError: "יצירת התפריט נכשלה",
        noJsonData: "לא נמצאו נתונים בקובץ ה-JSON",
        parseError: "שגיאה בפענוח קובץ ה-JSON",
        saveSuccess: "השינויים נשמרו בענן",
        saveError: "שגיאה בשמירת השינויים",
        deleteSuccess: "התפריט נמחק לצמיתות"
      }
    },
    colorPicker: {
      tooltips: {
        eyeDropper: "דגום צבע מהמסך"
      },
      sections: {
        branding: "צבעי מותג",
        recent: "בשימוש בדף"
      },
      errors: {
        noEyeDropper: "הדפדפן שלך אינו תומך בדגימת צבע"
      }
    },
    fontPicker: {
      defaultFont: "בחר פונט",
      triggerSubtitle: "לחץ לשינוי טיפוגרפיה"
    },
    fontPickerModal: {
      title: "ספריית פונטים",
      subtitle: "בחר פונט עבור הפרויקט שלך",
      tabs: {
        hebrew: "עברית",
        all: "כל הפונטים"
      },
      searchPlaceholder: "חפש שם של פונט...",
      loading: "טוען ספריית פונטים...",
      previewText: "תצוגה מקדימה",
      loadMore: "טען פונטים נוספים",
      badges: {
        hebrew: "עברית"
      }
    },
    addSection: {
      title: "הוספת סקשן",
      subtitle: "בנו את הסיפור שלכם",
      recommended: "מומלצים",
      exploreAll: "כל הקטגוריות",
      readyTitle: "להוסיף את הסקשן לעמוד?",
      readySubtitle: "תוכלו לערוך את כל התוכן והצבעים בשלב מאוחר יותר.",
      addBtn: "הוסף לעמוד",
      proTip: "טיפ מקצועי",
      featuresTitle: "פיצ'רים מרכזיים",
      proTipText: {
        top: "הסקשן הזה עובד הכי טוב כשהוא ממוקם בראש העמוד כדי לשמור על זרימה ויזואלית.",
        middle: "הסקשן הזה עובד הכי טוב כשהוא ממוקם אחרי מפריד (Divider) נקי."
      },
      categories: {
        basics: "בסיסי",
        content: "תוכן",
        dividers: "מפרידים",
        "split-views": "תצוגה חצויה"
      },
sections: {
        flex: { 
          label: "קנבס חופשי", 
          desc: "משטח עבודה חופשי בגרירה והשלכה",
          features: ['שליטה במידות הסקשן', 'עיצוב רקע מותאם', 'הוספת אלמנטים מרובים', 'הנעה לפעולה (CTA)']
        },
        hero: { 
          label: "סליידר ראשי", 
          desc: "רושם ראשוני עוצמתי בכניסה לאתר",
          features: ['יצירת סליידר תמונות מרשים', 'הוספת לוגו ותמונות צפות', 'כותרות, טקסט וכפתורים', 'מינימום מילים, מקסימום רושם']
        },
        contact: { 
          label: "צור קשר", 
          desc: "יצירת דף צור קשר מלא ומעוצב",
          features: ['עיצוב מלא ואינפורמטי', 'כל דרכי ההתקשרות', 'ווידג׳ט מיקום (מפה)', 'אייקונים של רשתות חברתיות', 'טופס יצירת קשר']
        },
        form: { 
          label: "טופס לידים", 
          desc: "טופס מותאם אישית לכל מטרה",
          features: ['מתאים לכל צורך', 'התאמת שדות אישית', 'שליטה בפעולה לאחר שליחה']
        },
        gallery: { 
          label: "גלריית תמונות", 
          desc: "גריד תמונות רספונסיבי וחכם",
          features: ['תצוגת Lightbox', 'מצבי גריד או סליידר']
        },
        menu: { 
          label: "תפריט דיגיטלי", 
          desc: "תפריט אוכל ושתייה מסונכרן",
          features: ['סנכרון מלא מול מנהל התפריטים']
        },
        table: { 
          label: "טבלת נתונים", 
          desc: "טבלת מידע או מחירון מובנית",
          features: ['שורות ועמודות', 'אפשרויות סטיילינג מתקדמות']
        },
        review: { 
          label: "ביקורות", 
          desc: "שיתוף קל של ביקורות לקוחות",
          features: ['דירוג כוכבים', 'תמונות פרופיל', 'ביקורות בזמן אמת', 'מצב ערבוב (Shuffle)']
        },
        video: { 
          label: "נגן וידאו", 
          desc: "מיקסום התוכן הויזואלי באתר",
          features: ['ניגון אוטומטי', 'תמונת כיסוי מותאמת']
        },
        "divider-line": { 
          label: "קו מפריד", 
          desc: "מפריד קו דק ואלגנטי",
          features: ['שליטה בעובי הקו']
        },
        "divider-spacer": { 
          label: "מרווח ריק", 
          desc: "שטח אנכי ריק לאוורור העיצוב",
          features: ['שליטה בגובה המרווח']
        },
        "split-50": { 
          label: "חצוי 50/50", 
          desc: "תמונה וטקסט זה לצד זה",
          features: ['ניתן להיפוך צדדים', 'עיצוב מאוזן ונקי']
        },
        "split-card": { 
          label: "כרטיס צף", 
          desc: "כרטיס תוכן על רקע תמונה",
          features: ['אפקט ציפה מודרני']
        }
      }
    }
  }
};