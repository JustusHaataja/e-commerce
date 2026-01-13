import '../styles/CategoryHeader.css';

export const CATEGORY_INFO: Record<number, { title: string, description: string }> = {
    1: { 
        title: "Energiajuomat", 
        description: "Puhdasta energiaa luonnollisista lähteistä ilman turhia lisäaineita." 
    },
    2: { 
        title: "Elektrolyytit", 
        description: "Optimaalista nesteytystä ja suorituskykyä treeniin ja arkeen." 
    },
    3: { 
        title: "Kombucha", 
        description: "Hyvää tekevät kuplat ja probiootit vatsasi hyvinvointiin." 
    },
    4: { 
        title: "Proteiinit", 
        description: "Laadukkaat proteiinit lihaskasvuun ja palautumiseen." 
    }
}

interface CategoryHeaderProps {
    categoryID: number;
}

const CategoryHeader = ({ categoryID }: CategoryHeaderProps) => {
    const info = CATEGORY_INFO[categoryID];

    if (!info) return null;

    return (
        <div className="category-header" >
            <h1>{info.title}</h1>
            <p>{info.description}</p>
        </div>
    )
}

export default CategoryHeader;