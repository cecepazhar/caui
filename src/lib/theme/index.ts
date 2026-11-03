export interface AppThemeInfo {
  id: string;
  name: string;
  role: string;
  /** Brand accent (hex). Source: tokens.json → apps[]. */
  color: string;
  glow: string;
  /** AA-compliant text colour on top of `color`. */
  contrast: string;
  characteristics: string;
}

export { CA_APPS_THEMES, type CaAppId } from './apps.generated';
