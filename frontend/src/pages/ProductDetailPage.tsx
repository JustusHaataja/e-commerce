import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById, type Product } from '../api/products';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductDescription from '../components/ProductDescription';
import NutritionTable from '../components/NutritionTable';
import QuantityControls from '../components/QuantityControls';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetail.css';

const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState<number>(0);

    const { addToCart, loading: cartLoading } = useCart();

    useEffect(() => {
        const loadProduct = async () => {
            if (!id) return;
            try {
                const product = await fetchProductById(Number(id));
                setProduct(product);

            } catch (err) {
                setError("Failed to load product details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (product) {
            await addToCart(product.id, quantity);
        }
    };

    if (loading) return <div style={{ height: "100vh", marginTop: "100px", textAlign: "center" }}>Ladataan...</div>
    if (!product) return <div style={{ height: "100vh", marginTop: "100px", textAlign: "center" }}>Tuotetta ei löytynyt</div>
    if (error) return <div style={{ height: "100vh", marginTop: "100px", textAlign: "center" }}>{error}</div>

    return (
        <div className="product-detail-page" >
            <Breadcrumbs 
                ItemName={product.name}
                categoryId={product.category_id}
            />

            <div className="product-detail-container" >
                <div className="product-hero" >
                    <div className="hero-image-container" >
                        <img 
                            src={product.images[selectedImage]?.image_url}
                            alt={product.name}
                            className={`main-product-image ${selectedImage === 0 ? "contain" : "cover"}`}
                        />
                        
                        {/* Thumbnail selector */}
                        {product.images.length > 1 && (
                            <div className="thumbnail-selector" >
                                {product.images.map((img, index) => (
                                    <img 
                                        key={index}
                                        src={img.image_url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hero-info" >
                        <h1 className="detail-header" >{product.name}</h1>
                        
                        <div className="main-details" >
                            {/* Price Logic */}
                            {product.sale_price ? (
                                <div className="price-container" >
                                    <span className="product-sale-price" >{product.sale_price}</span>
                                    <span className="product-price-original" >{product.price}</span>
                                </div>
                            ) : (
                                <p className="product-price" >{product.price}</p>
                            )}

                            {/* Cart actions */}
                            <div className="purchase-actions" >
                                <QuantityControls 
                                    quantity={quantity}
                                    onIncrease={() => setQuantity(prev => prev + 1)}
                                    onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={cartLoading}
                                />

                                <button
                                    className="add-to-cart-btn"
                                    onClick={handleAddToCart}
                                    disabled={cartLoading}
                                >
                                    {cartLoading ? "Lisätään..." : "LISÄÄ KORIIN"}
                                </button>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="content-section" >
                            <ProductDescription description={product.description} />
                        </div>
                    </div>
                </div>

                {/* Nutrition Section with Image */}
                {product.nutrition && (
                    <div className="nutrition-section" >
                        <div className="nutrition-content" >
                            <NutritionTable 
                                nutritionData={product.nutrition}
                                product_category={product.category_id}    
                            />
                        </div>
                        
                        {product.images[1] && (
                            <div className="nutrition-image" >
                                <img 
                                    src={product.images[1].image_url}
                                    alt={`${product.name} - additional view`}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductPage