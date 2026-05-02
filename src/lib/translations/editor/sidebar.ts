// src/lib/translations/editor/sidebar.ts

export const sidebarTranslations = {
  en: {
    pageSettings: {
      groupTitle: "General",
      panelTitle: "Page Settings",
      internalName: "Internal Page Name",
      urlSlug: "URL Slug",
      appearance: "Page Appearance",
      actions: {
        delete: "Delete Page",
        confirmDelete: "Are you sure you want to delete this page?"
      }
    },
    sectionProperties: {
      breadcrumbHome: "Home", // ברירת מחדל אם אין שם עמוד
      sectionTitle: "Section Settings",
      elementTitle: "Element Settings",
      defaultElementName: "Element",
      backToPage: "Back to Page"
    },
    inputs: {
      placeholder: "Type here...",
      fontSelect: "Select Font",
      colorSelect: "Select Color"
    },
    sections: {
      backToPage: "Back to",
      page: "Page",
      groups: {
        dimensions: "Dimensions",
        slider: "Slider",
        background: "Background & Style",
        effects: "Edge Effects",
        elements: "Section Elements",
        galleryDesigner: "Gallery Designer",
        galleryImages: "Gallery Images",
        galleryContent: "Content",
        frames: "Frames & Borders",
        shadows: "Shadow Effects",
        menuLayout: "Menu Layout",
        menuColors: "Menu Colors",
        menuImages: "Item Images"
      },
      defaults: {
        title: "New Title",
        description: "New text...",
        button: "Click Me",
      },
      gallery: {
      layouts: {
        classic: "Classic",
        carousel: "Carousel",
        mosaic: "Mosaic"
      },
      carouselStatus: {
        title: "Carousel Status",
        active: "Loop mode active",
        needed: "Add {count} more images for loop"
      },
      scale: "Component Scale",
      maxImages: "Max 30 images per gallery"
    },
    menu: {
      title: "Menu Selection",
      loading: "Loading menus...",
      displayLabel: "Display in this section:",
      noMenus: "No menus found for this site",
      managerBtn: "Menu Manager Tool",
      errorMissing: "Settings missing section ref"
    },
    elementTypes: {
      heading: "Heading",
      paragraph: "Text",
      button: "Button",
      image: "Image",
      spacer: "Spacer",
      element: "Element"
    },
    elementEditor: {
      backTo: "Back to",
      settingsSuffix: "Settings",
      buttonContent: {
        label: "Button Content",
        placeholder: "Button label"
      },
      imageAsset: {
        label: "Image Asset",
        select: "Select Media",
        browse: "Click to browse assets",
        remove: "Remove Asset"
      }
    },
    },
    ui: {
    inputs: {
      typePlaceholder: "Type {label}...",
      setPlaceholder: "Set {label}..."
    }
  },
  },
  he: {
    pageSettings: {
      groupTitle: "כללי",
      panelTitle: "הגדרות עמוד",
      internalName: "שם עמוד פנימי",
      urlSlug: "כתובת עמוד (Slug)",
      appearance: "נראות העמוד",
      actions: {
        delete: "מחיקת עמוד",
        confirmDelete: "האם אתה בטוח שברצונך למחוק את העמוד?"
      }
    },
    sectionProperties: {
      breadcrumbHome: "בית",
      sectionTitle: "הגדרות סקשן",
      elementTitle: "הגדרות אלמנט",
      defaultElementName: "אלמנט",
      backToPage: "חזרה לעמוד"
    },
    inputs: {
      placeholder: "הקלד כאן...",
      fontSelect: "בחר פונט",
      colorSelect: "בחר צבע"
    },
    sections: {
      backToPage: "חזרה לעמוד",
      page: "עמוד",
      groups: {
        dimensions: "מידות",
        slider: "סליידר",
        background: "רקע וסטייל",
        effects: "אפקטי קצוות",
        elements: "תוכן",
        galleryDesigner: "עיצוב גלריה",
        galleryImages: "תמונות הגלריה",
        galleryContent: "תוכן",
        frames: "מסגרות וגבולות",
        shadows: "אפקטי צל",
        menuLayout: "מבנה התפריט",
        menuColors: "צבעי התפריט",
        menuImages: "תמונות פריטים"
      },
      defaults: {
        title: "כותרת חדשה",
        description: "טקסט חדש...",
        button: "לחץ כאן",
      },
      gallery: {
      layouts: {
        classic: "קלאסי",
        carousel: "קרוסלה",
        mosaic: "פסיפס"
      },
      carouselStatus: {
        title: "מצב קרוסלה",
        active: "מצב לופ פעיל",
        needed: "הוסיפו עוד {count} תמונות ללופ"
      },
      scale: "קנה מידה",
      maxImages: "מקסימום 30 תמונות לגלריה"
    },
    menu: {
      title: "בחירת תפריטים",
      loading: "טוען תפריטים...",
      displayLabel: "הצגה בסקשן זה:",
      noMenus: "לא נמצאו תפריטים לאתר זה",
      managerBtn: "כלי ניהול תפריטים",
      errorMissing: "חסר ייחוס לסקשן בהגדרות"
    },
    elementTypes: {
      heading: "כותרת",
      paragraph: "טקסט",
      button: "כפתור",
      image: "תמונה",
      spacer: "הפרדה",
      element: "אלמנט"
    },
    elementEditor: {
      backTo: "חזרה להגדרות",
      settingsSuffix: " ", // בעברית המשפט נבנה אחרת
      buttonContent: {
        label: "תוכן הכפתור",
        placeholder: "טקסט הכפתור"
      },
      imageAsset: {
        label: "נכס מדיה (תמונה)",
        select: "בחירת מדיה",
        browse: "לחצו לעיון בגלריה",
        remove: "הסרת תמונה"
      }
    },
    },
    ui: {
    inputs: {
      typePlaceholder: "הזינו {label}...",
      setPlaceholder: "הגדירו {label}..."
    }
  },
  }
};