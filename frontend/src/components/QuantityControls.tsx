import React from 'react';
import '../styles/QuantityControls.css';

interface QuantityControlsProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    disabled?: boolean;
    min?: number;
}

const QuantityControls: React.FC<QuantityControlsProps> = ({ 
    quantity, 
    onIncrease, 
    onDecrease, 
    disabled = false,
    min = 1 
}) => {
    return (
        <div className="quantity-controls" >
            <button 
                onClick={onDecrease}
                disabled={disabled || quantity <= min}
                type="button"
            >
                -
            </button>
            <span>{quantity}</span>
            <button 
                onClick={onIncrease}
                disabled={disabled}
                type="button"
            >
                +
            </button>
        </div>
    );
};

export default QuantityControls