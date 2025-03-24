import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, Search } from 'lucide-react';
import type { ProductFiltersProps } from '../types';

export function ProductFilters({ filters, warehouses, onFilterChange }: ProductFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
      <div className="relative">
        <Label htmlFor="product-search" className="sr-only">Search products</Label>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="product-search"
          type="text"
          placeholder="Search products..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>
      <Select
        value={filters.warehouse}
        onValueChange={(value) => onFilterChange({ warehouse: value })}
      >
        <SelectTrigger 
          className="border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white group transition-colors"
          aria-label="Select warehouse"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
            <SelectValue placeholder="Select Warehouse" />
          </div>
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
              All Warehouses
            </SelectItem>
            {warehouses.map((warehouse) => (
              <SelectItem 
                key={warehouse.id} 
                value={warehouse.id}
                className="hover:bg-emerald-50 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer transition-colors"
              >
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
} 