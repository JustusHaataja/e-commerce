import Breadcrumbs from '../components/Breadcrumbs';
import ProductsHero from '../components/ProductsHero';
import CategoryHeader, { CATEGORY_INFO } from '../components/CategoryHeader';
import ProductList from '../components/ProductList';
import { useSearchParams } from 'react-router-dom';

const ProductListPage = () => {
    const [searchParams] = useSearchParams();
    const categoryIDParam = searchParams.get("category_id");
    const categoryID = categoryIDParam ? Number(categoryIDParam) : null;

    const currentTitle = categoryID ? CATEGORY_INFO[categoryID]?.title : undefined;

    return (
        <div style={{ marginTop: "100px"}}>
            <Breadcrumbs ItemName={currentTitle} />

            {!categoryID ? (
                <ProductsHero />
            ) : (
                <CategoryHeader categoryID={categoryID} />
            )}
            
            <ProductList />
        </div>
    )
}

export default ProductListPage