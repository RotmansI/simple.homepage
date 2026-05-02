// src/lib/translations/editor/groups.ts

export const groupsTranslations = {
  en: {
    addElement: {
      title: "Add Element",
      instruction: "Select an element to inject it into your section",
      labels: {
        heading: "Heading",
        paragraph: "Text",
        button: "Button",
        spacer: "Spacer",
        image: "Image",
        divider: "Divider"
      }
    },
    dimensions: {
      title: "Section Dimensions",
      heightLabel: "Section Height",
      heightDesc: "Set the maximum height in pixels",
      min: "Min",
      max: "Max"
    },
    boxModel: {
      title: "Spacing & Layout",
      padding: "Padding",
      margin: "Margin",
      sides: {
        all: "All Sides",
        top: "Top",
        bottom: "Bottom",
        left: "Left",
        right: "Right"
      }
    },
    contentManager: {
      addNew: "Add New Element",
      structure: "Elements Structure",
      empty: "Canvas is empty",
      galleryFixed: "Gallery Layout",
      galleryCore: "Core Element",
      fixed: "Fixed",
      actions: {
        duplicate: "Duplicate",
        remove: "Remove"
      }
    },
    edgeEffects: {
      title: "Edge Effects",
      fadeTitle: "{type} Fade Effect",
      colorLabel: "Fade Color",
      spreadLabel: "Spread (Size)",
      opacityLabel: "Fade Opacity",
      sides: {
        top: "Top",
        bottom: "Bottom"
      }
    },
    frame: {
      titles: {
        text: "Text Stroke",
        frame: "Frame & Borders"
      },
      borderRadius: "Corner Radius",
      radiusFull: "FULL",
      styles: {
        text: "Stroke Style",
        frame: "Border Style",
        solid: "Solid",
        dashed: "Dashed",
        dotted: "Dotted"
      },
      width: "Width",
      color: {
        text: "Stroke Color",
        frame: "Border Color"
      }
    },
    heroSlider: {
      title: "Hero Slider Management",
      slidesLabel: "Slides",
      addSlide: "Add Slide",
      slidePlaceholder: "Slide {index}",
      noSlides: "No slides added yet",
      clickToAdd: "Click to add first slide",
      overlay: {
        title: "Slider Overlay",
        color: "Overlay Color",
        opacity: "Overlay Opacity"
      }
    },
    imageLayout: {
      title: "Image Layout",
      alignment: "Alignment",
      width: "Component Width",
      sizes: {
        small: "Small",
        medium: "Medium",
        full: "Full Width"
      }
    },
    interactions: {
      title: "Interactions",
      hover: {
        title: "Hover Effect",
        types: {
          scale_up: "Scale Up",
          zoom_in: "Zoom In",
          colors_swap: "Colors Swap",
          image_swap: "Image Swap",
          wrapping_lines: "Wrapping Lines",
          glow: "Glow Effect"
        },
        settings: {
          maxScale: "Max Scale",
          zoomLevel: "Zoom Level",
          transitionTime: "Transition Time",
          textColor: "Hover Text Color",
          borderColor: "Hover Border Color",
          bgColor: "Hover Background Color",
          glowColor: "Glow Color",
          imageAsset: "Hover Image Asset",
          replace: "Replace",
          selectMedia: "Select Hover Media",
          swapAnimation: "Swap Animation",
          animations: {
            none: "Simple",
            fade: "Fade",
            slide: "Slide"
          }
        }
      },
      click: {
        title: "Click Action (Link)",
        urlLabel: "Destination URL",
        urlPlaceholder: "https://...",
        newTab: "Open in new tab"
      }
    },
    menuColors: {
      title: "Menu Color Palette",
      selectLabel: "Select Element to Color",
      adjusting: "Adjusting: {label}",
      opacity: "Background Opacity",
      quickView: "Quick Overview",
      fields: {
        bgColor: "Section Background",
        navBg: "Navigation Bar",
        activeNavBg: "Active Tab Background",
        activeNavText: "Active Tab Text",
        navText: "Inactive Tab Text",
        titleColor: "Menu Title",
        categoryColor: "Category Names",
        itemNameColor: "Dish Name",
        itemDescColor: "Dish Description",
        priceColor: "Price Tag"
      }
    },
    menuItemImage: {
      title: "Item Default Image",
      description: "This image will be displayed for any menu item that doesn't have its own specific image URL.",
      selectMedia: "Select Media",
      browse: "Click to browse assets",
      reset: "Reset to Default Icon",
      previewAlt: "Default Preview"
    },
    menuLayout: {
      title: "Menu Scale",
      sliderLabel: "Menu Scale",
      description: "Smaller scale allows more items per row"
    },
    sectionBackground: {
      title: "Background & Overlay",
      image: {
        label: "Background Image",
        remove: "Remove",
        upload: "Upload or Choose Image",
        change: "Change Image",
        alt: "Background"
      },
      overlay: {
        titleOverlay: "Overlay Settings",
        titleSolid: "Background Solid Color",
        colorLabel: "Select Color",
        opacity: "Opacity",
        note: "Note: This color acts as an overlay on top of your selected image."
      }
    },
    sectionBasic: {
      title: "Section Identity",
      nameLabel: "Internal Name",
      namePlaceholder: "e.g., Summer Promotion Hero",
      nameHelper: "Visible in structure sidebar and breadcrumbs",
      descLabel: "Internal Description",
      descPlaceholder: "What is this section about? Information here is for internal use and is not published"
    },
    shadow: {
      title: "Elevation & Shadows",
      intensity: "Shadow Intensity",
      levels: ["None", "Subtle", "Medium", "Strong"],
      color: "Shadow Color",
      tintLabel: "Select Shadow Tint"
    },
    spacer: {
      title: "Spacer Settings",
      height: "Height",
      appearance: "Appearance",
      modes: {
        transparent: "Transparent",
        solid: "Solid Color"
      },
      colorLabel: "Spacer Color",
      opacity: "Opacity"
    },
    typography: {
      title: "Typography & Text",
      content: "Content",
      fontSize: "Font Size",
      weight: "Weight",
      weights: {
        light: "Light",
        regular: "Regular",
        semiBold: "Semi Bold",
        bold: "Bold",
        black: "Black"
      },
      textColor: "Text Color",
      alignment: "Alignment",
      formatting: "Formatting",
      letterSpacing: "Letter Spacing",
      lineSpacing: "Line Spacing"
    },
    visualExtras: {
      title: "Button Styling",
      outline: {
        label: "Outline Style",
        helper: "40% Alpha Glass effect"
      },
      colors: {
        theme: "Theme Color",
        background: "Background Color",
        text: "Text Color"
      },
      pickers: {
        background: "Background",
        theme: "Theme Color"
      }
    },
  },
  he: {
    addElement: {
      title: "הוספת אלמנט",
      instruction: "לחצו על אלמנט כדי להוסיף אותו לסקשן",
      labels: {
        heading: "כותרת",
        paragraph: "טקסט",
        button: "כפתור",
        spacer: "הפרדה",
        image: "תמונה",
        divider: "קו מפריד"
      }
    },
    boxModel: {
      title: "מרווחים ופריסה",
      padding: "מרווח פנימי (Padding)",
      margin: "מרווח חיצוני (Margin)",
      sides: {
        all: "כל הצדדים",
        top: "עליון",
        bottom: "תחתון",
        left: "שמאל",
        right: "ימין"
      }
    },
    dimensions: {
      title: "מידות הסקשן",
      heightLabel: "גובה הסקשן",
      heightDesc: "קביעת הגובה המקסימלי בפיקסלים",
      min: "מינימום",
      max: "מקסימום"
    },
    contentManager: {
      addNew: "הוספת אלמנט חדש",
      structure: "מבנה האלמנטים",
      empty: "הקנבס ריק",
      galleryFixed: "פריסת גלריה",
      galleryCore: "אלמנט ליבה",
      fixed: "קבוע",
      actions: {
        duplicate: "שכפול",
        remove: "מחיקה"
      }
    },
    edgeEffects: {
      title: "אפקטים ושוליים",
      fadeTitle: "אפקט טשטוש {type}",
      colorLabel: "צבע הטשטוש",
      spreadLabel: "מרחק התפשטות",
      opacityLabel: "שקיפות האפקט",
      sides: {
        top: "עליון",
        bottom: "תחתון"
      }
    },
    frame: {
      titles: {
        text: "קו מתאר",
        frame: "מסגרת וגבולות"
      },
      borderRadius: "עידון פינות",
      radiusFull: "מלא",
      styles: {
        text: "סגנון קו",
        frame: "סגנון מסגרת",
        solid: "רציף",
        dashed: "מקווקו",
        dotted: "נקודות"
      },
      width: "עובי",
      color: {
        text: "צבע הקו",
        frame: "צבע המסגרת"
      }
    },
    heroSlider: {
      title: "ניהול סליידר ראשי",
      slidesLabel: "שקופיות",
      addSlide: "הוספת תמונה",
      slidePlaceholder: "שקופית {index}",
      noSlides: "עדיין לא נוספו תמונות",
      clickToAdd: "לחצו להוספת התמונה הראשונה",
      overlay: {
        title: "שכבת על",
        color: "צבע שכבת העל",
        opacity: "שקיפות שכבת העל"
      }
    },
    imageLayout: {
      title: "פריסת תמונה",
      alignment: "יישור",
      width: "רוחב האלמנט",
      sizes: {
        small: "קטן",
        medium: "בינוני",
        full: "רוחב מלא"
      }
    },
    interactions: {
      title: "אינטראקציה",
      hover: {
        title: "אפקט מעבר (Hover)",
        types: {
          scale_up: "הגדלה",
          zoom_in: "זום פנימה",
          colors_swap: "החלפת צבעים",
          image_swap: "החלפת תמונה",
          wrapping_lines: "הבלטת גבולות",
          glow: "אפקט זוהר"
        },
        settings: {
          maxScale: "רמת הגדלה",
          zoomLevel: "רמת זום",
          transitionTime: "זמן מעבר",
          textColor: "צבע טקסט בריחוף",
          borderColor: "צבע מסגרת בריחוף",
          bgColor: "צבע רקע בריחוף",
          glowColor: "צבע זוהר",
          imageAsset: "תמונת ריחוף חלופית",
          replace: "החלפה",
          selectMedia: "בחירת קובץ",
          swapAnimation: "אנימציית החלפה",
          animations: {
            none: "פשוט",
            fade: "עמעום",
            slide: "החלקה"
          }
        }
      },
      click: {
        title: "פעולת לחיצה (קישור)",
        urlLabel: "כתובת יעד (URL)",
        urlPlaceholder: "https://...",
        newTab: "פתיחה בטאב חדש"
      }
    },
    menuColors: {
      title: "פלטת צבעי תפריט",
      selectLabel: "בחירת אלמנט לצביעה",
      adjusting: "מכוון: {label}",
      opacity: "אטימות רקע",
      quickView: "מבט מהיר",
      fields: {
        bgColor: "רקע הסקשן",
        navBg: "סרגל ניווט",
        activeNavBg: "רקע טאב פעיל",
        activeNavText: "טקסט טאב פעיל",
        navText: "טקסט טאב לא פעיל",
        titleColor: "כותרת התפריט",
        categoryColor: "שמות קטגוריות",
        itemNameColor: "שם הפריט",
        itemDescColor: "תיאור הפריט",
        priceColor: "תגית מחיר"
      }
    },
    menuItemImage: {
      title: "תמונת ברירת מחדל לפריט",
      description: "תמונה זו תוצג עבור כל פריט בתפריט שאין לו כתובת URL מוגדרת משלו.",
      selectMedia: "בחירת מדיה",
      browse: "לחצו לעיון בגלריה",
      reset: "איפוס לאייקון ברירת מחדל",
      previewAlt: "תצוגה מקדימה"
    },
    menuLayout: {
      title: "קנה מידה של התפריט",
      sliderLabel: "גודל התצוגה",
      description: "קנה מידה קטן יותר מאפשר להציג יותר פריטים בכל שורה"
    },
    sectionBackground: {
      title: "רקע ושכבות",
      image: {
        label: "תמונת רקע",
        remove: "הסרה",
        upload: "העלאה או בחירת תמונה",
        change: "החלפת תמונה",
        alt: "רקע"
      },
      overlay: {
        titleOverlay: "הגדרות שכבת על (Overlay)",
        titleSolid: "צבע רקע מלא",
        colorLabel: "בחירת צבע",
        opacity: "אטימות",
        note: "צבע זה משמש כשכבת כיסוי מעל תמונת הרקע שבחרתם"
      }
    },
    sectionBasic: {
      title: "זהות הסקשן",
      nameLabel: "שם פנימי",
      namePlaceholder: "לדוגמה: הירו מבצע קיץ",
      nameHelper: "מופיע בסרגל המבנה ובנתיבי הניווט (Breadcrumbs)",
      descLabel: "תיאור פנימי",
      descPlaceholder: "על מה הסקשן הזה? המידע פה הוא לשימוש פנימי ואינו מוצג באתר"
    },
    shadow: {
      title: "הצללה ועומק",
      intensity: "עוצמת הצל",
      levels: ["ללא", "עדין", "בינוני", "חזק"],
      color: "צבע הצל",
      tintLabel: "בחירת גוון הצל"
    },
    spacer: {
      title: "הגדרות מרווח",
      height: "גובה",
      appearance: "מראה",
      modes: {
        transparent: "שקוף",
        solid: "צבע מלא"
      },
      colorLabel: "צבע המרווח",
      opacity: "אטימות"
    },
    typography: {
      title: "טיפוגרפיה וטקסט",
      content: "תוכן הטקסט",
      fontSize: "גודל גופן",
      weight: "משקל",
      weights: {
        light: "קל",
        regular: "רגיל",
        semiBold: "חצי מודגש",
        bold: "מודגש",
        black: "כבד"
      },
      textColor: "צבע הטקסט",
      alignment: "יישור",
      formatting: "עיצוב",
      letterSpacing: "ריווח אותיות",
      lineSpacing: "ריווח שורות"
    },
    visualExtras: {
      title: "עיצוב כפתור",
      outline: {
        label: "סגנון מסגרת (Outline)",
        helper: "אפקט זכוכית עם 40% שקיפות"
      },
      colors: {
        theme: "צבע נושא",
        background: "צבע רקע",
        text: "צבע טקסט"
      },
      pickers: {
        background: "רקע",
        theme: "צבע נושא"
      }
    },
  }
};