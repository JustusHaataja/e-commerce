import { Link, useLocation } from 'react-router-dom';
import '../styles/Breadcrumbs.css';

// Define props to accept a custom name and category
interface BreadcrumbsProps {
    ItemName?: string;
    categoryName?: string;
    categoryId?: number;
}

const routeNameMap: { [key: string] : string } = {
    "products": "Tuotteet",
    "about": "Meistä",
    "cart": "Ostoskori",
}

const categoryNameMap: { [key: number]: string } = {
    1: "Energiajuomat",
    2: "Elektrolyytit",
    3: "Kombuchat",
    4: "Proteiinit"
}

const Breadcrumbs = ({ ItemName, categoryName, categoryId }: BreadcrumbsProps) => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    // Get category name from ID
    const finalCategoryName = categoryName || (categoryId ? categoryNameMap[categoryId] : undefined);

    return (
        <nav className="breadcrumbs" aria-label="breadcrumb" >
            <ol>
                <li>
                    <Link to="/" >Etusivu</Link>
                </li>

                {/* Dynamic Links */}
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    
                    let displayName = routeNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

                    // Skip rendering the last item if we have a category (we'll render it separately)
                    if (isLast && ItemName && finalCategoryName) {
                        return null;
                    }

                    if (isLast && ItemName) {
                        displayName = ItemName;
                    }

                    return (
                        <li key={to} >
                            <span className="separator" >/</span>
                            {isLast ? (
                                <span className="current" >{displayName}</span>
                            ) : (
                                <Link to={to} >{displayName}</Link>
                            )}
                        </li>
                    )
                })}

                {/* Insert Category before product name on product detail pages */}
                {finalCategoryName && categoryId && (
                    <li>
                        <span className="separator" >/</span>
                        <Link to={`/products?category_id=${categoryId}`} >{finalCategoryName}</Link>
                    </li>
                )}

                {/* Render product name last if category exists */}
                {ItemName && finalCategoryName && (
                    <li>
                        <span className="separator" >/</span>
                        <span className="current" >{ItemName}</span>
                    </li>
                )}
            </ol>
        </nav>
    );
};

export default Breadcrumbs