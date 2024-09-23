// /src/utils/themeInitializer.ts

import { initializeTeamColors } from './updateTeamColors';

if (typeof window !== 'undefined') {
  // This check ensures the code only runs in the browser
  initializeTeamColors();
}