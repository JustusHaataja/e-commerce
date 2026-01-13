import React, { useMemo } from 'react';
import { parseDescription } from '../utils/formatters';
import '../styles/ProductDescription.css';

interface ProductDescriptionProps {
    description: string | null | undefined;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
    const points = useMemo(() => parseDescription(description || ""), [description]);

    if (points.length === 0) return null;

    return (
        <div className="product-description-container" >
            <h2 className="detail-header2" >Tuote lyhyesti</h2>
            <ul className="detail-desc-list" >
                {points.map((point, index) => (
                    <li key={index} >
                        {point}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductDescription