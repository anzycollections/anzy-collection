export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  insured: boolean;
  description: string;
}

export const DEFAULT_SHIPPING_PRICES: Record<string, number> = {
  "Bénin": 2000,
  "Burkina Faso": 35000,
  "Cap-Vert": 60000,
  "Côte d'Ivoire": 45000,
  "Gambie": 55000,
  "Ghana": 30000,
  "Guinée": 45000,
  "Guinée-Bissau": 55000,
  "Liberia": 50000,
  "Mali": 50000,
  "Mauritanie": 60000,
  "Niger": 45000,
  "Nigeria": 40000,
  "Sénégal": 65000,
  "Sierra Leone": 50000,
  "Togo": 25000,
  "France": 15000,
};

export const SHIPPING_ZONES = [
  {
    name: "Afrique de l'Ouest",
    countries: [
      "Bénin",
      "Burkina Faso",
      "Cap-Vert",
      "Côte d'Ivoire",
      "Gambie",
      "Ghana",
      "Guinée",
      "Guinée-Bissau",
      "Liberia",
      "Mali",
      "Mauritanie",
      "Niger",
      "Nigeria",
      "Sénégal",
      "Sierra Leone",
      "Togo"
    ],
    options: [
      { id: "dhl_ao", name: "DHL Express (Assuré)", price: 15000, insured: true, description: "Livraison express sécurisée" },
      { id: "terrestre_ao", name: "Transport Terrestre", price: 0, insured: false, description: "Tarif calculé selon la distance" },
    ],
  },
  {
    name: "Europe",
    countries: ["France", "Belgique", "Suisse", "Allemagne", "Italie", "Espagne", "Portugal", "Royaume-Uni"],
    options: [
      { id: "dhl_eu", name: "DHL Express Europe (Assuré)", price: 15000, insured: true, description: "Livraison express prioritaire" },
    ],
  },
];

export function getShippingOptionsForCountry(countryName: string, customPrices: Record<string, number> = DEFAULT_SHIPPING_PRICES): ShippingOption[] {
  const prices = { ...DEFAULT_SHIPPING_PRICES, ...customPrices };

  if (countryName.toLowerCase() === "bénin") {
    return [{ id: "benin_std", name: "Livraison Standard (Bénin)", price: prices["Bénin"] ?? 2000, insured: false, description: "Livraison locale au Bénin" }];
  }

  const foundZone = SHIPPING_ZONES.find((zone) =>
    zone.countries.map(c => c.toLowerCase()).includes(countryName.toLowerCase())
  );

  if (!foundZone) return [{ id: "dhl_other", name: "DHL International", price: 25000, insured: true, description: "Livraison internationale" }];

  return foundZone.options.map(opt => {
    if (opt.id === "terrestre_ao") {
      return { ...opt, price: prices[countryName] ?? 50000 };
    }
    return opt;
  });
}
