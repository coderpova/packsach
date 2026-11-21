export interface AdditiveInfo {
  code: string;
  name: string;
  category: 'Preservative' | 'Color' | 'Sweetener' | 'Flavor Enhancer' | 'Emulsifier' | 'Acidity Regulator' | 'Antioxidant' | 'Thickener' | 'Raising Agent';
  risk: 'high' | 'moderate' | 'safe';
  concern: string;
  regulatoryStatus: string; // e.g. "FSSAI Permitted / JECFA ADI / US FDA GRAS"
  scientificContext: string; // Nuanced explanation distinguishing presence vs. high-dose hazard
  bannedIn?: string;
}

export const ADDITIVES_DATABASE: Record<string, AdditiveInfo> = {
  'E621': {
    code: 'E621 / INS 621',
    name: 'Monosodium Glutamate (MSG)',
    category: 'Flavor Enhancer',
    risk: 'moderate',
    regulatoryStatus: 'Permitted under FSSAI (GMP), US FDA GRAS, JECFA (ADI "not specified")',
    concern: 'Umami flavor enhancer. Generally recognized as safe by JECFA/US FDA; transient symptoms (MSG symptom complex: headaches/flushing) reported in a small subset of sensitive individuals during acute challenge doses.',
    scientificContext: 'Glutamate is an amino acid naturally present in tomatoes, aged cheeses, and human metabolism. Not an acute toxin at dietary levels; excessive presence often signals reliance on ultra-processed savory formulations.'
  },
  'E627': {
    code: 'E627 / INS 627',
    name: 'Disodium Guanylate',
    category: 'Flavor Enhancer',
    risk: 'safe',
    regulatoryStatus: 'Permitted under FSSAI & Codex Alimentarius (GMP)',
    concern: 'Nucleotide flavor booster synergistic with glutamates. Metabolized to purines, so individuals with hyperuricemia or gout are advised to moderate intake.',
    scientificContext: 'Derived from yeast extract or tapioca fermentation. Safe within customary dietary levels (JECFA ADI not specified).'
  },
  'E631': {
    code: 'E631 / INS 631',
    name: 'Disodium Inosinate',
    category: 'Flavor Enhancer',
    risk: 'safe',
    regulatoryStatus: 'Permitted under FSSAI & Codex Alimentarius (GMP)',
    concern: 'Naturally occurring purine ribonucleotide that magnifies umami taste. Safe for general population; caution for individuals sensitive to purines.',
    scientificContext: 'Widely used alongside vegetable extracts to impart savory depth in seasonings and instant noodles without standalone MSG.'
  },
  'E635': {
    code: 'E635 / INS 635',
    name: 'Disodium 5\'-Ribonucleotides',
    category: 'Flavor Enhancer',
    risk: 'moderate',
    regulatoryStatus: 'Permitted under FSSAI & Codex (GMP)',
    concern: 'Synergistic combination of disodium inosinate and disodium guanylate. Caution advised for individuals managing uric acid or gout.',
    scientificContext: 'Enhances salty/savory taste perception, allowing reduction of table salt, but often marks ultra-processed savory snack matrixes.'
  },
  'INS 150d': {
    code: 'INS 150d / E150d',
    name: 'Caramel Color Class IV (Sulfite Ammonia Caramel)',
    category: 'Color',
    risk: 'moderate',
    regulatoryStatus: 'Permitted under FSSAI, US FDA & EFSA (Group ADI: 0–300 mg/kg bw/day)',
    concern: 'Manufactured by thermal processing with ammonia and sulfite compounds. Produces trace reaction byproduct 4-methylimidazole (4-MEI).',
    scientificContext: 'While IARC classified 4-MEI as Group 2B (possible human carcinogen) based on rodent bioassays, global regulators enforce strict manufacturing limits (EFSA max 250 mg/kg caramel solids; FSSAI compliance). Actual dietary exposure at regulated food levels is within established safety margins.'
  },
  'INS 150c': {
    code: 'INS 150c / E150c',
    name: 'Caramel Color Class III (Ammonia Caramel)',
    category: 'Color',
    risk: 'safe',
    regulatoryStatus: 'Permitted under FSSAI & EFSA (ADI: 0–100 mg/kg bw/day)',
    concern: 'Ammonia caramel used in baked goods, malt beverages, and gravies. Subject to strict regulatory limits on 2-acetyl-4-tetrahydroxybutylimidazole (THI).',
    scientificContext: 'Standard food colorant evaluated as safe by JECFA within established ADI.'
  },
  'E102': {
    code: 'E102 / Tartrazine',
    name: 'Tartrazine (FD&C Yellow 5)',
    category: 'Color',
    risk: 'moderate',
    regulatoryStatus: 'Permitted in India under FSSAI (up to 100 mg/kg in specified foods); EU warning label required',
    concern: 'Synthetic azo dye. The EU mandates an advisory label ("may have an adverse effect on activity and attention in children") following the 2007 Southampton study.',
    scientificContext: 'EFSA re-evaluated tartrazine (2014) and confirmed safety within an ADI of 0–7.5 mg/kg bw/day. Cross-sensitivity can occur in aspirin-sensitive individuals (urticaria/rhinitis).'
  },
  'E110': {
    code: 'E110 / Sunset Yellow FCF',
    name: 'Sunset Yellow FCF (Yellow 6)',
    category: 'Color',
    risk: 'moderate',
    regulatoryStatus: 'Permitted in India under FSSAI (up to 100 mg/kg in specified foods); EU warning label required',
    concern: 'Petroleum-derived sulfonated azo dye. Included in the EU mandatory warning list for childhood behavioral considerations.',
    scientificContext: 'EFSA re-assessed Sunset Yellow (2014) establishing an ADI of 0–4 mg/kg bw/day. While non-genotoxic, clean label reformulation seeks natural carotenes or paprika extracts.'
  },
  'E129': {
    code: 'E129 / Allura Red AC',
    name: 'Allura Red AC (Red 40)',
    category: 'Color',
    risk: 'moderate',
    regulatoryStatus: 'Permitted under FSSAI (up to 100 mg/kg) and US FDA; EU warning label required',
    concern: 'Azo dye commonly added to strawberry/berry flavored beverages and snacks. Sensitivity reactions observed in sensitive populations.',
    scientificContext: 'Evaluated by JECFA and EFSA with an ADI of 0–7 mg/kg bw/day. Non-carcinogenic in standardized assays; restricted in some European schools to minimize synthetic color exposure.'
  },
  'E211': {
    code: 'E211 / Sodium Benzoate',
    name: 'Sodium Benzoate',
    category: 'Preservative',
    risk: 'moderate',
    regulatoryStatus: 'Permitted under FSSAI (up to 120-600 ppm depending on product category), JECFA ADI: 0–5 mg/kg bw/day',
    concern: 'Antimicrobial preservative. In acidic beverages containing ascorbic acid (Vitamin C), trace benzene formation can occur under heat/light exposure.',
    scientificContext: 'Beverage manufacturers formulate with chelating agents (EDTA) or lower temperatures to prevent benzene synthesis. Safe within regulated maximum limits; high doses can cause mild gastric irritation.'
  },
  'E202': {
    code: 'E202 / Potassium Sorbate',
    name: 'Potassium Sorbate',
    category: 'Preservative',
    risk: 'safe',
    regulatoryStatus: 'Permitted under FSSAI, US FDA GRAS, EFSA (ADI: 0–11 mg/kg bw/day)',
    concern: 'Widely used anti-fungal preservative that metabolizes like natural fatty acids in the human digestive system.',
    scientificContext: 'Extensively studied by JECFA; lowest toxicological concern among synthetic antimicrobial preservatives.'
  },
  'E320': {
    code: 'E320 / BHA',
    name: 'Butylated Hydroxyanisole (BHA)',
    category: 'Antioxidant',
    risk: 'moderate',
    regulatoryStatus: 'Permitted under FSSAI and Codex (up to 200 mg/kg fat basis); JECFA ADI: 0–0.5 mg/kg bw/day',
    concern: 'Synthetic phenolic antioxidant used to prevent rancidity in edible fats. High-dose rodent studies caused forestomach hyperplasia; human dietary exposure is monitored.',
    scientificContext: 'Forestomach toxicity in rodents does not directly translate to humans due to anatomical differences (humans lack a forestomach). Maintained within safe ADIs by international food safety bodies.'
  },
  'INS 319': {
    code: 'INS 319 / TBHQ',
    name: 'Tertiary Butylhydroquinone (TBHQ)',
    category: 'Antioxidant',
    risk: 'moderate',
    regulatoryStatus: 'Permitted under FSSAI, US FDA & Codex (up to 200 mg/kg in fats/oils); JECFA ADI: 0–0.7 mg/kg bw/day',
    concern: 'Highly effective antioxidant added to frying oils and palmolein to prolong shelf life. Strictly regulated to prevent excessive cumulative consumption.',
    scientificContext: 'EFSA (2004) and JECFA re-confirmed safety within 0.7 mg/kg bw/day. Consumer concern arises because it is frequently used to stabilize heavily processed, fried snack foods.'
  },
  'E322': {
    code: 'E322 / INS 322',
    name: 'Soya / Sunflower Lecithin',
    category: 'Emulsifier',
    risk: 'safe',
    regulatoryStatus: 'Permitted under FSSAI (GMP), US FDA GRAS, JECFA (ADI not limited)',
    concern: 'Naturally occurring phospholipid extracted from soybeans or sunflower seeds. Harmless unless the individual has a severe soy allergy.',
    scientificContext: 'Essential lipid component that maintains smooth texture in chocolates and baked goods, preventing fat bloom.'
  },
  'E330': {
    code: 'E330 / Citric Acid',
    name: 'Citric Acid',
    category: 'Acidity Regulator',
    risk: 'safe',
    regulatoryStatus: 'Permitted under FSSAI (GMP), US FDA GRAS, JECFA (ADI not limited)',
    concern: 'Organic fruit acid that naturally controls pH and microbial growth. Harmless; frequent prolonged contact with teeth can contribute to enamel erosion.',
    scientificContext: 'Identical to the citric acid produced naturally in human cellular respiration (Krebs cycle).'
  },
  'E471': {
    code: 'E471 / Mono- and Diglycerides of Fatty Acids',
    name: 'Mono- and Diglycerides of Fatty Acids',
    category: 'Emulsifier',
    risk: 'safe',
    regulatoryStatus: 'Permitted under FSSAI (GMP), US FDA GRAS, JECFA (ADI not limited)',
    concern: 'Commonly synthesized from plant oils (often palm oil) or seed oils to stabilize moisture-fat emulsions in breads and biscuits.',
    scientificContext: 'Metabolized by the human body similarly to natural dietary triglycerides. Quality standards enforce strict trans-fat and heavy-metal ceilings.'
  },
  'E472e': {
    code: 'E472e / DATEM',
    name: 'Diacetyl Tartaric Acid Esters of Mono- and Diglycerides',
    category: 'Emulsifier',
    risk: 'safe',
    regulatoryStatus: 'Permitted under FSSAI & US FDA GRAS (ADI: 0–50 mg/kg bw/day)',
    concern: 'Dough conditioner utilized in industrial baking to build gluten volume in packaged sliced breads.',
    scientificContext: 'Hydrolyzed in the gastrointestinal tract into natural tartaric acid, acetic acid, and fatty acids with negligible toxicological risk.'
  },
  'E951': {
    code: 'E951 / Aspartame',
    name: 'Aspartame',
    category: 'Sweetener',
    risk: 'moderate',
    regulatoryStatus: 'Permitted under FSSAI & US FDA; JECFA reaffirmed ADI of 0–40 mg/kg bw/day (July 2023)',
    concern: 'Intense non-nutritive sweetener. Strictly contraindicated for individuals with Phenylketonuria (PKU). IARC designated Group 2B in 2023 based on limited evidence.',
    scientificContext: 'JECFA simultaneously concluded that current evidence does not justify changing the safe daily intake of 40 mg/kg body weight (equivalent to 9–14 cans of diet soda daily for an adult).'
  },
  'E950': {
    code: 'E950 / Acesulfame Potassium',
    name: 'Acesulfame Potassium (Ace-K)',
    category: 'Sweetener',
    risk: 'moderate',
    regulatoryStatus: 'Permitted under FSSAI, US FDA & EFSA (ADI: 0–9 mg/kg bw/day)',
    concern: 'High-intensity heat-stable sweetener often blended with aspartame or sucralose to mask bitter aftertastes.',
    scientificContext: 'Excreted unchanged by the kidneys without being metabolized. Extensively reviewed by JECFA with established safe daily allowances.'
  },
  'E955': {
    code: 'E955 / Sucralose',
    name: 'Sucralose',
    category: 'Sweetener',
    risk: 'safe',
    regulatoryStatus: 'Permitted under FSSAI, US FDA & EFSA (ADI: 0–15 mg/kg bw/day)',
    concern: 'Chlorinated sucrose derivative that is 600 times sweeter than table sugar with zero caloric yield.',
    scientificContext: 'Over 100 safety studies over 20 years confirm lack of genotoxicity or carcinogenicity within the ADI. Active research explores minor interactions with gut microbiota.'
  },
  'INS 500(ii)': {
    code: 'INS 500(ii) / Sodium Bicarbonate',
    name: 'Sodium Bicarbonate (Baking Soda)',
    category: 'Raising Agent',
    risk: 'safe',
    regulatoryStatus: 'Permitted under FSSAI (GMP), US FDA GRAS',
    concern: 'Standard household culinary leavening agent that releases carbon dioxide when heated.',
    scientificContext: 'Completely safe; contributes mildly to total sodium consumption.'
  },
  'INS 503(ii)': {
    code: 'INS 503(ii) / Ammonium Bicarbonate',
    name: 'Ammonium Bicarbonate (Baker\'s Ammonia)',
    category: 'Raising Agent',
    risk: 'safe',
    regulatoryStatus: 'Permitted under FSSAI (GMP), US FDA GRAS',
    concern: 'Traditional baker\'s leavener for thin crisp crackers and biscuits. Completely thermalized and dissipated during high-heat baking.',
    scientificContext: 'Leaves no chemical residue in dry baked goods with moisture below 5%.'
  }
};
