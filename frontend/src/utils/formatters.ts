export interface NutritionRow {
    label: string;
    per100: string;
    perPortion: string;
}

/**
 * Parses description string into bullet points.
 */
export const parseDescription = (rawDescription: string): string[] => {
    if (!rawDescription) return [];

    return rawDescription.split(/,(?!\s)/).map(s => s.trim()).filter(s => s.length > 0);
};