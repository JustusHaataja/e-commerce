import React, { useMemo } from 'react';
import '../styles/NutritionTable.css';

interface NutritionRow {
    label: string;
    per100: string;
    perPortion: string;
}

interface NutritionTableProps {
    nutritionData: string;
    product_category?: number;
}

const NutritionTable: React.FC<NutritionTableProps> = ({ nutritionData, product_category = 1 }) => {
    
    const parsedData = useMemo(() => {
        if (!nutritionData) return [];

        const formatValue = (val: string) => {
            if (!val || val === '-') return '-';
            
            // Add space between number and unit, but preserve commas in decimals
            // Match: number (with optional decimal comma) followed by unit letters
            return val
                .trim()
                .replace(/(\d+(?:,\d+)?)\s*([a-zA-Z]+)/g, "$1 $2");
        }

        const formatLabel = (label: string) => {
            const labelMap: { [key: string]: string } = {
                '-jostatyydyttynyttä': '- josta tyydyttynyttä',
                '-jostasokereita': '- josta sokereita',
                '-jostalaktoosia': '- josta laktoosia'
            };

            return labelMap[label.toLowerCase()] || label;
        }

        // ===== CATEGORY 1 =====
        // Format: "Energia/Energi,4kcal16kJ/13kcal53kJ|Rasva/Fett,0g/0g"
        if (product_category === 1) {
            return nutritionData.split('|').map(row => {
                const firstCommaIndex = row.indexOf(',');
                if (firstCommaIndex === -1) return null;

                const headerPart = row.substring(0, firstCommaIndex);
                const valuePart = row.substring(firstCommaIndex + 1);

                const rawLabel = headerPart.split('/')[0] || headerPart;
                const label = formatLabel(rawLabel);
                const values = valuePart.split('/');
                
                return {
                    label,
                    per100: formatValue(values[0] || '-'),
                    perPortion: formatValue(values[1] || '-')
                };
            }).filter((item): item is NutritionRow => item !== null);
        }

        // ===== CATEGORY 2 =====
        // Format: "Natrium,430mg,|Kalium,163mg,8%*"
        if (product_category === 2) {
            return nutritionData.split('|').map(row => {
                if (!row.trim()) return null;
                
                const parts = row.split(',');
                if (parts.length < 2) return null;

                const label = parts[0]?.trim() || '';
                const per100 = formatValue(parts[1]?.trim() || '-');
                const perPortion = parts[2]?.trim() || '-';

                return {
                    label,
                    per100,
                    perPortion
                };
            }).filter((item): item is NutritionRow => item !== null);
        }

        // ===== CATEGORY 3 =====
        // Format: ",100ml,annos|Energia/Energi,100kJ/24kcal,400kJ/ 96kcal|Hiilihydraatit/Kolhydrater,5,9g,23,6g"
        if (product_category === 3) {
            const rows = nutritionData.split('|');
            
            return rows.slice(1).map(row => {
                // Find label (before first comma)
                const firstCommaIndex = row.indexOf(',');
                if (firstCommaIndex === -1) return null;

                const headerPart = row.substring(0, firstCommaIndex);
                const valuePart = row.substring(firstCommaIndex + 1);

                if (!headerPart.trim()) return null;

                const rawLabel = headerPart.split('/')[0] || headerPart;
                const label = formatLabel(rawLabel);
                
                // Find the LAST occurrence of a pattern like ",XXg" or ",XXXkcal"
                // This helps us split correctly even with decimal commas
                const valuePattern = /,(\d+(?:,\d+)?[a-zA-Z\/\s]+)$/;
                const match = valuePart.match(valuePattern);
                
                if (match) {
                    const perPortion = match[1];
                    const per100 = valuePart.substring(0, valuePart.lastIndexOf(',' + perPortion));
                    
                    return {
                        label,
                        per100: formatValue(per100.trim()),
                        perPortion: formatValue(perPortion.trim())
                    };
                }
                
                // Fallback to last comma method
                const lastCommaIndex = valuePart.lastIndexOf(',');
                const per100 = valuePart.substring(0, lastCommaIndex);
                const perPortion = valuePart.substring(lastCommaIndex + 1);
                
                return {
                    label,
                    per100: formatValue(per100.trim()),
                    perPortion: formatValue(perPortion.trim())
                };
            }).filter((item): item is NutritionRow => item !== null);
        }

        // ===== CATEGORY 4 =====
        // Format: ",100g,50g|Energiaa,355 kcal/ 1505kJ,178 kcal/ 752kJ|Hiilihydraatteja,3,70g,1,0g"
        if (product_category === 4) {
            const rows = nutritionData.split('|');
            
            return rows.slice(1).map(row => {
                // Find label (before first comma)
                const firstCommaIndex = row.indexOf(',');
                if (firstCommaIndex === -1) return null;

                const headerPart = row.substring(0, firstCommaIndex);
                const valuePart = row.substring(firstCommaIndex + 1);

                if (!headerPart.trim()) return null;

                const label = formatLabel(headerPart.trim());
                
                // Find the LAST occurrence of a pattern like ",X,XXg" or ",XXg"
                // Match pattern: comma followed by optional < symbol, digits with optional decimal, unit
                const valuePattern = /,(<?\d+(?:,\d+)?\s*[a-zA-Z\/\s]+)$/;
                const match = valuePart.match(valuePattern);
                
                if (match) {
                    const perPortion = match[1];
                    const per100 = valuePart.substring(0, valuePart.lastIndexOf(',' + perPortion));
                    
                    return {
                        label,
                        per100: formatValue(per100.trim()),
                        perPortion: formatValue(perPortion.trim())
                    };
                }
                
                // Fallback to last comma method
                const lastCommaIndex = valuePart.lastIndexOf(',');
                const per100 = valuePart.substring(0, lastCommaIndex);
                const perPortion = valuePart.substring(lastCommaIndex + 1);
                
                return {
                    label,
                    per100: formatValue(per100.trim()),
                    perPortion: formatValue(perPortion.trim())
                };
            }).filter((item): item is NutritionRow => item !== null);
        }

        return [];
    }, [nutritionData, product_category]);

    const tableHeaders = useMemo(() => {
        if ((product_category === 3 || product_category === 4) && nutritionData.includes('|')) {
            const firstRow = nutritionData.split('|')[0];
            const values = firstRow.split(',');
            
            return {
                per100: values[1]?.trim() || 'Per 100ml',
                perPortion: values[2]?.trim() || 'Per annos'
            };
        }

        if (product_category === 2) {
            return {
                per100: 'Per annos',
                perPortion: 'RDA%'
            };
        }

        return {
            per100: 'Per 100ml',
            perPortion: 'Per annos'
        };
    }, [nutritionData, product_category]);

    if (parsedData.length === 0) return null;

    return (
        <div className="nutrition-container" >
            <h3 className="detail-header3">Ravintosisältö</h3>
            <table className="nutrition-table" >
                <thead>
                    <tr>
                        <th>Ravintoarvo</th>
                        <th>{tableHeaders.per100}</th>
                        <th>{tableHeaders.perPortion}</th>
                    </tr>
                </thead>
                <tbody>
                    {parsedData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.label}</td>
                            <td>{row.per100}</td>
                            <td>{row.perPortion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default NutritionTable