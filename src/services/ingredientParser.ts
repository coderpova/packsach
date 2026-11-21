import { ADDITIVES_DATABASE } from '../data/additivesData';
import { ParsedIngredient } from '../types/product';

// Comprehensive list of hidden sugar aliases commonly used on Indian packaged food labels
export const SUGAR_ALIASES = [
  'sugar',
  'invert sugar',
  'invert syrup',
  'liquid glucose',
  'glucose syrup',
  'dextrose',
  'maltodextrin',
  'malt extract',
  'barley malt extract',
  'high fructose corn syrup',
  'corn syrup',
  'sucrose',
  'fructose',
  'caramel',
  'brown sugar',
  'jaggery',
  'honey',
  'cane juice crystals',
  'concentrated fruit juice',
  'apple juice concentrate',
  'grape juice concentrate',
  'golden syrup',
  'molasses',
  'treacle',
  'ethyl maltol',
  'lactose',
  'agave nectar'
];

export const PALM_OIL_ALIASES = [
  'palm oil',
  'palmolein',
  'refined palmolein',
  'refined palm oil',
  'fractionated palm oil',
  'palm kernel oil',
  'hydrogenated palm oil',
  'vegetable fat (palm)',
  'edible vegetable oil (palmolein)',
  'edible vegetable oil (palm)',
  'edible vegetable fat (palm oil)',
  'palm olein'
];

export const TRANS_FAT_ALIASES = [
  'partially hydrogenated vegetable oil',
  'partially hydrogenated oil',
  'hydrogenated vegetable oil',
  'vanaspati',
  'margarine',
  'bakery shortening',
  'interesterified vegetable fat'
];

export function parseIngredientsText(rawText: string): ParsedIngredient[] {
  if (!rawText || !rawText.trim()) return [];

  // Split ingredients by comma or semicolon, handling nested parentheses e.g. "Edible Vegetable Oil (Palmolein)"
  const cleaned = rawText
    .replace(/^ingredients\s*:\s*/i, '')
    .replace(/^contains\s*:\s*/i, '')
    .trim();

  // Regex split on commas that are not inside parentheses
  const tokens: string[] = [];
  let current = '';
  let parenDepth = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === '(' || char === '[') parenDepth++;
    else if (char === ')' || char === ']') parenDepth = Math.max(0, parenDepth - 1);
    else if ((char === ',' || char === ';' || char === '•' || char === '\n') && parenDepth === 0) {
      if (current.trim()) tokens.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) tokens.push(current.trim());

  return tokens.map((token, index) => {
    const lower = token.toLowerCase();
    const rank = index + 1;

    // Check palm oil
    const isPalmOil = PALM_OIL_ALIASES.some(alias => lower.includes(alias));

    // Check added sugar
    const isAddedSugar = SUGAR_ALIASES.some(alias => lower.includes(alias));

    // Check trans fat / partially hydrogenated
    const isTransFat = TRANS_FAT_ALIASES.some(alias => lower.includes(alias));

    // Check additives / E-numbers / INS numbers
    let isAdditive = false;
    let foundENumber: string | undefined = undefined;
    let explanation: string | undefined = undefined;
    let regulatoryStatus: string | undefined = undefined;
    let functionalClass: string | undefined = undefined;
    let scientificEvidence: string | undefined = undefined;
    let riskLevel: 'safe' | 'moderate' | 'high' = 'safe';

    // Scan for matches in additives database
    for (const [key, data] of Object.entries(ADDITIVES_DATABASE)) {
      const matchPattern = new RegExp(`\\b${key.replace(' ', '\\s*')}\\b|\\b${data.name.toLowerCase()}\\b`, 'i');
      if (matchPattern.test(token)) {
        isAdditive = true;
        foundENumber = data.code;
        explanation = `${data.name}: ${data.concern}`;
        regulatoryStatus = data.regulatoryStatus;
        functionalClass = data.category;
        scientificEvidence = data.scientificContext;
        riskLevel = data.risk;
        break;
      }
    }

    // Generic INS/E number regex if not in DB
    if (!foundENumber) {
      const eRegex = /(?:ins|e)[-–\s]?(\d{3,4}[a-z]?)/i;
      const match = token.match(eRegex);
      if (match) {
        isAdditive = true;
        foundENumber = `INS ${match[1].toUpperCase()}`;
        explanation = `Food additive code ${foundENumber}. Permitted functional class under FSSAI schedule.`;
        regulatoryStatus = 'Permitted under FSSAI food additive regulations';
        functionalClass = 'Functional Additive';
        scientificEvidence = 'Regulated within Maximum Permitted Levels (MPL) or Good Manufacturing Practice (GMP).';
        riskLevel = 'moderate';
      }
    }

    // Assign risk levels for sugar & palm oil
    if (isPalmOil && rank <= 3) {
      riskLevel = 'moderate';
      explanation = `Palm oil appears at rank #${rank} (top 3 ingredients by weight at manufacture). High in saturated palmitic acid (~45-50%). Exact percentage is not declared without QUID.`;
      functionalClass = 'Processing Fat / Lipid Base';
      regulatoryStatus = 'FSSAI permitted edible vegetable oil';
      scientificEvidence = 'FSSAI labelling rules require descending order by weight at manufacture. Position indicates primary fat source, though exact percentage cannot be calculated from rank alone.';
    } else if (isPalmOil) {
      riskLevel = 'moderate';
      explanation = `Contains refined palm oil/palmolein at rank #${rank}. Secondary fat source; exact percentage undeclared.`;
      functionalClass = 'Edible Vegetable Oil';
      regulatoryStatus = 'FSSAI permitted';
      scientificEvidence = 'Qualitative ingredient ranking under FSSAI Chapter 2.';
    } else if (isTransFat) {
      riskLevel = 'high';
      explanation = 'Contains partially hydrogenated vegetable fat/vanaspati — source of industrial trans-fatty acids.';
      functionalClass = 'Hydrogenated Fat';
      regulatoryStatus = 'FSSAI trans fat limit: max 2% in fats/oils since Jan 2022; WHO REPLACE framework targets global elimination.';
      scientificEvidence = 'Industrial trans fatty acids increase LDL cholesterol and decrease HDL cholesterol.';
    } else if (isAddedSugar && rank <= 3) {
      riskLevel = 'moderate';
      explanation = `Added sugar/sweetener (${token}) ranked #${rank} in ingredients. Serves as a primary bulking and sweetening agent by weight at manufacture.`;
      functionalClass = 'Caloric Sweetener';
      regulatoryStatus = 'FSSAI mandatory ingredient listing';
      scientificEvidence = 'FSSAI ingredient order indicates relative weight at batch formulation. Gram quantity must be verified against the nutrition panel.';
    }

    return {
      name: token.replace(/\.$/, '').trim(),
      originalText: token,
      isPalmOil,
      isAddedSugar,
      isTransFat,
      isAdditive,
      eNumber: foundENumber,
      riskLevel,
      explanation,
      regulatoryStatus,
      functionalClass,
      scientificEvidence,
      rank
    };
  });
}
