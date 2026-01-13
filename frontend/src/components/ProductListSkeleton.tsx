import '../styles/ProductListSkeleton.css'

const ProductListSkeleton = () => {
    const skeletonCards = Array(4).fill(0);
    const loadingText = "Etsitään tuotteita...".split("");
    
    return (
        <div className="product-skeleton-container" >
            <div className="skeleton-header" >
                {loadingText.map((char, index) => (
                    <span
                        key={index}
                        className="wave-char"
                        style={{ animationDelay: `${index * 0.1}s`}}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </div>

            <div className="skeleton-grid" >
                {skeletonCards.map((_, index) => (
                    <div key={index} className="skeleton-card">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-details"></div>
                        <div className="skeleton-row"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductListSkeleton