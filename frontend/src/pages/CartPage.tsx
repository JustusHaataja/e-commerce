import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProductById, type Product } from '../api/products';
import QuantityControls from '../components/QuantityControls'; // Import here
import shoppingcart from '../assets/shoppingcart.svg';
import '../styles/CartPage.css';


const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, loading: cartLoading } = useCart();
    const [products, setProducts] = useState<Record<number, Product>>({});
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Fetch details for products in the cart
    useEffect(() => {
        const loadProductDetails = async () => {
            setLoadingProducts(true);
            const newProducts: Record<number, Product> = { ...products };
            
            // Only fetch products we don't have yet
            const uniqueIds = [...new Set(cartItems.map(item => item.product_id))];
            
            await Promise.all(uniqueIds.map(async (id) => {
                if (!newProducts[id]) {
                    try {
                        const product = await fetchProductById(id);
                        newProducts[id] = product;
                    } catch (err) {
                        console.error(`Failed to load product ${id}`, err);
                    }
                }
            }));

            setProducts(newProducts);
            setLoadingProducts(false);
        };

        if (cartItems.length > 0) {
            loadProductDetails();
        } else {
            setLoadingProducts(false);
        }
    }, [cartItems]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const product = products[item.product_id];
            if (!product) return total;
            
            // Use sale price if available
            const price = product.sale_price || product.price;
            return total + (Number(price) * item.quantity);
        }, 0);
    };

    if (loadingProducts && cartItems.length > 0) {
        return <div className="cart-page-loading" >Ladataan ostoskoria...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty-state" >
                <h2>Ostoskorisi on tyhjä</h2>
                <p>Löydä omat suosikkisi laajasta valikoimastamme!</p>
                <Link to="/products" className="continue-shopping-btn" >Selaa tuotteita</Link>
            </div>
        );
    }

    return (
        <div className="cart-page" >
            <h1 className="cart-header" >
                <img 
                    src={shoppingcart} 
                    alt="Cart" 
                />
                {cartItems.length} {cartItems.length === 1 ? 'tuote' : 'tuotetta'}
            </h1>
            
            <div className="cart-layout" >
                <div className="cart-items-list" >
                    {cartItems.map(item => {
                        const product = products[item.product_id];
                        if (!product) return null;

                        const price = product.sale_price || product.price;
                        const hasDiscount = !!product.sale_price;
                        const totalItemPrice = (Number(price) * item.quantity).toFixed(2);

                        return (
                            <div key={item.product_id} className="cart-item" >
                                <Link 
                                    to={`/products/${product.id}`}
                                    className="cart-item-image-link"
                                >
                                    <img 
                                        src={product.images[0]?.image_url} 
                                        alt={product.name} 
                                        className="cart-item-image" 
                                    />
                                </Link>
                                
                                <div className="cart-item-info" >
                                    <Link 
                                        to={`/products/${product.id}`}
                                        className="cart-item-title"
                                    >
                                        <h3>{product.name}</h3>
                                    </Link>
                                    <div className="cart-item-price-row">
                                        <span 
                                            className={`cart-item-price ${hasDiscount ? 'sale-text' : ''}`}
                                        >
                                            {price} €
                                        </span>
                                        {hasDiscount && (
                                            <span 
                                                className="cart-item-original-price"
                                            >
                                                {product.price} €
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="cart-item-actions" >
                                    <QuantityControls 
                                        quantity={item.quantity}
                                        onIncrease={() => updateQuantity(item.product_id, item.quantity + 1)}
                                        onDecrease={() => updateQuantity(item.product_id, item.quantity - 1)}
                                        disabled={cartLoading}
                                    />
                                    
                                    <button 
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item.product_id)}
                                        disabled={cartLoading}
                                    >
                                        Poista
                                    </button>
                                </div>

                                <div className="cart-item-total" >
                                    {totalItemPrice} €
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="cart-summary" >
                    <h2>Yhteenveto</h2>
                    <div className="summary-row" >
                        <span>Välisumma</span>
                        <span>{calculateTotal().toFixed(2)} €</span>
                    </div>
                    <div className="summary-row" >
                        <span>Toimitus</span>
                        <span>0.00 €</span>
                    </div>
                    <div className="summary-total" >
                        <span>Yhteensä</span>
                        <span>{calculateTotal().toFixed(2)} €</span>
                    </div>
                    <button className="checkout-btn" >Siirry kassalle</button>
                </div>
            </div>
        </div>
    );
};

export default CartPage