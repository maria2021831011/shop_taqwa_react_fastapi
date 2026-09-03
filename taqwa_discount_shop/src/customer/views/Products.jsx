import { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Extract unique categories from products
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock > 20) return { text: "In Stock", color: "#10b981", bg: "#d1fae5" };
    if (stock > 0) return { text: "Low Stock", color: "#f59e0b", bg: "#fef3c7" };
    return { text: "Out of Stock", color: "#ef4444", bg: "#fee2e2" };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="product-loading">
          <div className="loading-spinner"></div>
          <p>Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Header Section */}
      <div className="products-header">
        <div className="header-main">
          <h1>🛍️ Product Collection</h1>
          <div className="products-count">
            <span className="count-badge">{products.length} Products</span>
          </div>
        </div>
        <p className="header-subtitle">Discover amazing products at great prices</p>
      </div>

      {/* Controls Section */}
      <div className="products-controls">
        <div className="search-container">
          <div className="search-input">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="clear-search" 
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="category-filters">
          <div className="filter-label">Filter by Category:</div>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Products' : category}
                {selectedCategory === category && <span className="active-dot"></span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <button 
            className="reset-filters"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div key={product.id} className="cust-product-card">
                  {/* Product Image */}
                  <div className="cust-product-image">
                    <div className="image-placeholder">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                      ) : (
                        <span className="image-fallback">📦</span>
                      )}
                    </div>
                    {product.featured && (
                      <div className="featured-badge">Featured 🔥</div>
                    )}
                    <div className="cust-product-category">
                      {product.category || "Uncategorized"}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="cust-product-info">
                    <h3 className="cust-product-name">{product.name}</h3>
                    {product.description && (
                      <p className="product-description">
                        {product.description.length > 80
                          ? `${product.description.substring(0, 80)}...`
                          : product.description}
                      </p>
                    )}
                    
                    <div className="cust-product-price">
                      <span className="price-main">{formatPrice(product.price)}</span>
                      {product.original_price && (
                        <span className="price-original">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>

                    <div className="product-meta">
                      <div 
                        className="stock-status"
                        style={{ 
                          color: stockStatus.color,
                          backgroundColor: stockStatus.bg 
                        }}
                      >
                        {stockStatus.text}
                        <span className="stock-count"> ({product.stock})</span>
                      </div>
                      
                      {product.rating && (
                        <div className="product-rating">
                          <span className="rating-stars">
                            {"★".repeat(Math.floor(product.rating))}
                            {"☆".repeat(5 - Math.floor(product.rating))}
                          </span>
                          <span className="rating-value">{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  
                </div>
              );
            })}
          </div>

          {/* Results Info */}
          <div className="results-info">
            Showing <strong>{filteredProducts.length}</strong> of {products.length} products
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;