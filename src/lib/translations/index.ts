// src/lib/translations/index.ts
import { dashboardTranslations } from './dashboard';
import { shellTranslations } from './editor/shell';
import { structureTranslations } from './editor/structure';
import { modalTranslations } from './editor/modals';
import { sidebarTranslations } from './editor/sidebar';
import { groupsTranslations } from './editor/groups'; // הייבוא החדש
import { publicTranslations } from './public';
import { canvasTranslations } from './editor/canvas';

export type Language = 'en' | 'he';

export const translations = {
  en: {
    ...publicTranslations.en,
    ...dashboardTranslations.en,
    editor: {
      shell: shellTranslations.en,
      structure: structureTranslations.en,
      modals: modalTranslations.en,
      sidebar: sidebarTranslations.en,
      groups: groupsTranslations.en, // הוספה למבנה האנגלי
      canvas: canvasTranslations.en,
    },
    
  },
  he: {
    ...publicTranslations.he,
    ...dashboardTranslations.he,
    editor: {
      shell: shellTranslations.he,
      structure: structureTranslations.he,
      modals: modalTranslations.he,
      sidebar: sidebarTranslations.he,
      groups: groupsTranslations.he, // הוספה למבנה העברי
      canvas: canvasTranslations.he,
    }
  }
};