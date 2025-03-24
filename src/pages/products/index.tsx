import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getProducts } from "@/lib/api/products";
import { Warehouse } from "@/lib/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Package2, Building2, ChevronDown, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

// Types for our component
interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price_usd: number;
  price_mxn: number;
  category: string;
  brand: string;
  material: string;
  purity: string;
  weight: number;
  is_active: boolean;
  metadata: {
    images?: string[];
    specifications?: Record<string, any>;
  };
  quantity?: number;
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, [selectedWarehouse]);

  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(
        selectedWarehouse === "all" ? undefined : selectedWarehouse
      );
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
      setWarehouses(data.warehouses || []);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-emerald-100/30 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden border border-emerald-100/50 shadow-sm animate-pulse"
              >
                <Skeleton className="h-64 w-full bg-emerald-50" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-3/4 bg-emerald-50" />
                  <Skeleton className="h-4 w-1/2 bg-emerald-50" />
                  <Skeleton className="h-8 w-24 bg-emerald-50" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-emerald-100/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100/50 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
              <p className="text-sm text-emerald-600 flex items-center gap-2">
                <Package2 className="h-4 w-4" />
                {filteredProducts.length} of {products.length} products shown
              </p>
            </div>
            <Button
              onClick={() => navigate("/products/new")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow group"
            >
              <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
              Add Product
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <Select
              value={selectedWarehouse}
              onValueChange={setSelectedWarehouse}
            >
              <SelectTrigger 
                className="border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white group transition-colors"
                aria-label="Select warehouse"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                  <SelectValue placeholder="Select Warehouse" />
                </div>
                <ChevronDown className="h-4 w-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-emerald-100 shadow-lg rounded-lg min-w-[220px]">
                <SelectGroup>
                  <SelectLabel className="text-xs font-medium text-emerald-600 px-2 py-1.5">
                    Warehouse Locations
                  </SelectLabel>
                  <SelectItem 
                    value="all"
                    className="hover:bg-emerald-50 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-emerald-500" />
                      All Warehouses
                    </div>
                  </SelectItem>
                  {warehouses.map((warehouse) => (
                    <SelectItem 
                      key={warehouse.id} 
                      value={warehouse.id}
                      className="hover:bg-emerald-50 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-emerald-500" />
                        {warehouse.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-emerald-100/50 hover:border-emerald-200 bg-white relative"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-emerald-50/50">
                {product.metadata?.images?.[0] ? (
                  <img
                    src={product.metadata.images[0]}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-emerald-400">
                    <Package2 className="h-12 w-12 opacity-50 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                )}
                {product.quantity !== undefined && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium shadow-sm backdrop-blur-sm transition-colors ${
                    product.quantity > 0
                      ? "bg-emerald-100/90 text-emerald-700"
                      : "bg-red-100/90 text-red-700"
                  }`}>
                    {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-medium text-lg text-emerald-700 whitespace-nowrap">
                      {formatPrice(product.price_usd)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  <span className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full transition-colors hover:bg-emerald-100 flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    {product.category}
                  </span>
                  {product.material && (
                    <span className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full transition-colors hover:bg-emerald-100">
                      {product.material} {product.purity}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto space-y-6">
              <div className="p-6 rounded-full bg-emerald-50 w-20 h-20 mx-auto flex items-center justify-center">
                <Package2 className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {searchQuery ? "No matching products" : "No products found"}
                </h3>
                <p className="text-sm text-gray-500">
                  {searchQuery 
                    ? "Try adjusting your search terms or filters"
                    : "Get started by adding your first product to the inventory."}
                </p>
              </div>
              <Button
                onClick={() => navigate("/products/new")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200 hover:shadow group"
              >
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                Add Product
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
