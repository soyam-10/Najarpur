export type VillageConfig = {
  name: string;
  nameNepali: string;
  tagline: string;               // one-line poetic description
  location: string;              // district · province · Nepal
  locationShort: string;         // e.g. "Rautahat" — shown on landmark overlay
  mapImage: string;              // path under /images/map/
  accentColor: string;           // hex — unique per village (used as CSS var)
  footerAttribution: string;     // village · district, Nepal
  loadingLabel: string;          // text shown while 3D map loads
};

// ─── Najarpur ────────────────────────────────────────────────────────────────
export const najarpur: VillageConfig = {
  name: "Najarpur",
  nameNepali: "नजरपुर",
  tagline: "A Pranami village in the Terai plains",
  location: "Chandrapur · Rautahat · Nepal",
  locationShort: "Rautahat",
  mapImage: "/images/map/najarpur-map.png",
  accentColor: "#C97F2A",    // saffron — Pranami devotional gold
  footerAttribution: "Najarpur Village · Chandrapur, Rautahat, Nepal",
  loadingLabel: "Najarpur",
};

export const village: VillageConfig = najarpur;
