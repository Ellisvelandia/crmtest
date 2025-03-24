import { useNavigate } from 'react-router-dom';
import { useProducts } from './hooks/useProducts';
import { ProductHeader } from './components/ProductHeader';
import { ProductFilters } from './components/ProductFilters';
import { ProductList } from './components/ProductList';

export default function ProductsPage() {
  const navigate = useNavigate();
  const { products, filteredProducts, warehouses, loading, filters, updateFilters } = useProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-emerald-100/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100/50 space-y-6">
          <ProductHeader
            totalProducts={products.length}
            shownProducts={filteredProducts.length}
            onAddProduct={() => navigate('/products/new')}
          />
          <ProductFilters
            filters={filters}
            warehouses={warehouses}
            onFilterChange={updateFilters}
          />
        </div>

        <ProductList
          products={filteredProducts}
          loading={loading}
          onProductClick={(id) => navigate(`/products/${id}`)}
        />
      </div>
    </div>
  );
}
