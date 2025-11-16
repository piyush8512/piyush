// export const APPLINK_VARIANTS = {
//   PRIMARY: 'PRIMARY',
//   SECONDARY: 'SECONDARY',
//   TERTIARY: 'TERTIARY',
// };

// export const ORIENTATION = {
//   HORIZONTAL: 'HORIZONTAL',
//   VERTICAL: 'VERTICAL',
// };

// Define values as constant objects
export const APPLINK_VARIANTS = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
  TERTIARY: 'TERTIARY',
} as const;

export const ORIENTATION = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
} as const;

// Derive union types from the constant values
export type AppLinkVariant = keyof typeof APPLINK_VARIANTS;
export type Orientation = keyof typeof ORIENTATION;
