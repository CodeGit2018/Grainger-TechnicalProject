import { useEffect, useState } from 'react';
import { createProduct, fetchProducts } from './api';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadProducts() {
    setIsLoading(true);
    setError('');

    try {
      setProducts(await fetchProducts());
    } catch {
      setError('Could not load products. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Enter a product name before adding it.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const product = await createProduct(trimmedName);
      setProducts((currentProducts) => [...currentProducts, product]);
      setName('');
    } catch {
      setError('Could not create the product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Grainger Products home">
          <span className="brand-mark">G</span>
          <span>Grainger / Products</span>
        </a>
        <span className="status-pill"><span className="status-dot" /> Live catalog</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Inventory workspace</p>
          <h1 id="page-title">Products, ready when you are.</h1>
          <p className="hero-description">
            Keep the essential catalog close at hand. Browse what is available or add the next item in seconds.
          </p>
        </div>
        <div className="hero-stamp" aria-hidden="true">
          <span>CATALOG</span>
          <strong>{products.length.toString().padStart(2, '0')}</strong>
          <span>ITEMS</span>
        </div>
      </section>

      <section className="workspace" aria-label="Product management">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Current inventory</p>
            <h2>Available products</h2>
          </div>
          <button className="refresh-button" type="button" onClick={loadProducts} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh list'}
          </button>
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}

        {isLoading ? (
          <div className="state-message">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="state-message empty-state">No products yet. Add the first one below.</div>
        ) : (
          <div className="product-grid">
            {products.map((product, index) => (
              <article className="product-card" key={product.id || `${product.name}-${index}`}>
                <span className="product-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{product.name}</h3>
                <p>Product record</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="add-panel" aria-labelledby="add-heading">
        <div>
          <p className="eyebrow">New record</p>
          <h2 id="add-heading">Add a product</h2>
          <p className="panel-description">Create a new item in the catalog with a single required field.</p>
        </div>
        <form className="product-form" onSubmit={handleSubmit}>
          <label htmlFor="product-name">Product name</label>
          <div className="form-row">
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Safety Gloves"
              maxLength="120"
              disabled={isSaving}
            />
            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Adding...' : 'Add product'}
            </button>
          </div>
        </form>
      </section>

      <footer>Grainger Products Service <span>•</span> Connected to PostgreSQL</footer>
    </main>
  );
}

export default App;