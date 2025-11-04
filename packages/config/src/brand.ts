export type BrandKey = "europcar" | "goldcar";

export interface BrandConfig {
  key: BrandKey;
  prefix: string;
  primary: string;
  primaryRgb: string;
  logo: string;
  displayName: string;
  companyName: string;
  vatNumber: string;
  address: string;
  emailFrom: string;
  emailReplyTo: string;
  defaultVatRate: number;
}

export const BRANDS: Record<BrandKey, BrandConfig> = {
  europcar: {
    key: "europcar",
    prefix: "ECP",
    primary: "#0EAD00",
    primaryRgb: "14, 173, 0",
    logo: "/logos/europcar.svg",
    displayName: "Europcar Greece",
    companyName: "Europcar Greece S.A.",
    vatNumber: "EL999999999",
    address: "Heraklion Airport, Crete, Greece",
    emailFrom: "Europcar Greece",
    emailReplyTo: "heraklion.airport@europcargreece.com",
    defaultVatRate: 24,
  },
  goldcar: {
    key: "goldcar",
    prefix: "GLD",
    primary: "#FFD400",
    primaryRgb: "255, 212, 0",
    logo: "/logos/goldcar.svg",
    displayName: "Goldcar Greece",
    companyName: "Goldcar Greece S.A.",
    vatNumber: "EL888888888",
    address: "Heraklion Airport, Crete, Greece",
    emailFrom: "Goldcar Greece",
    emailReplyTo: "info@goldcar-greece.com",
    defaultVatRate: 24,
  },
} satisfies Record<BrandKey, BrandConfig>;

export function getBrandConfig(brand: BrandKey): BrandConfig {
  return BRANDS[brand];
}
