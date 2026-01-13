import '../styles/CategorySkeleton.css';

const CategorySkeleton = () => {
    return (
        <div className="category-skeleton-container" >
            <h2 className="skeleton-header" >Kategoriat</h2>
            <div className="skeleton-container" >
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton" >
                        <div className="image-skeleton" />
                        <div className="text-skeleton" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategorySkeleton;