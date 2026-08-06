export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  carrier: "DHL" | "Terrestre";
  insured: boolean;
  canAddInsurance?: boolean;
}

export interface CountryZone {
  code: string;
  name: string;
  zone: "AO" | "AF_AUTRE" | "EU" | "AM" | "AUTRE";
}

export const COUNTRIES: CountryZone[] = [
  // Afrique de l'Ouest (Option Terrestre ou DHL)
  { code: "BJ", name: "Bénin", zone: "AO" },
  { code: "TG", name: "Togo", zone: "AO" },
  { code: "CI", name: "Côte d'Ivoire", zone: "AO" },
  { code: "SN", name: "Sénégal", zone: "AO" },
  { code: "BF", name: "Burkina Faso", zone: "AO" },
  { code: "ML", name: "Mali", zone: "AO" },
  { code: "NE", name: "Niger", zone: "AO" },
  { code: "GH", name: "Ghana", zone: "AO" },
  { code: "NG", name: "Nigeria", zone: "AO" },

  // Reste de l'Afrique (DHL uniquement)
  { code: "CM", name: "Cameroun", zone: "AF_AUTRE" },
  { code: "GA", name: "Gabon", zone: "AF_AUTRE" },
  { code: "CD", name: "RDC", zone: "AF_AUTRE" },
  { code: "CG", name: "Congo", zone: "AF_AUTRE" },

  // Europe (DHL uniquement)
  { code: "FR", name: "France", zone: "EU" },
  { code: "BE", name: "Belgique", zone: "EU" },
  { code: "CH", name: "Suisse", zone: "EU" },

  // Amérique & Autres (DHL uniquement)
  { code: "CA", name: "Canada", zone: "AM" },
  { code: "US", name: "États-Unis", zone: "AM" },
];

export const TERRESTRE_BASE_PRICE = 62000;
export const TERRESTRE_INSURANCE_PRICE = 8000;

export function getShippingOptions(countryCode: string): ShippingOption[] {
  const country = COUNTRIES.find((c) => c.code === countryCode);
  if (!country) return [];

  if (country.zone === "AO") {
    return [
      {
        id: "dhl_express",
        name: "DHL Express (Assuré & Rapide)",
        price: 15000,
        carrier: "DHL",
        insured: true,
      },
      {
        id: "terrestre_standard",
        name: "Livraison Terrestre Standard",
        price: TERRESTRE_BASE_PRICE,
        carrier: "Terrestre",
        insured: false,
        canAddInsurance: true,
      },
    ];
  }

  const prices: Record<string, number> = {
    AF_AUTRE: 25000,
    EU: 35000,
    AM: 45000,
    AUTRE: 40000,
  };

  return [
    {
      id: "dhl_express",
      name: "DHL Express International (Assuré)",
      price: prices[country.zone] || 40000,
      carrier: "DHL",
      insured: true,
    },
  ];
}