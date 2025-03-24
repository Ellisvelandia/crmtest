# CursorCRM Project Documentation

## 🏗 Project Structure
```
cursorcrm/
├── src/
│   ├── lib/                    # Core utilities and services
│   │   ├── api/               # API integration modules
│   │   │   ├── products.ts    # Products and warehouse management
│   │   │   └── ...
│   │   └── supabase/         # Supabase configuration and types
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   └── shared/           # Shared composite components
│   ├── pages/                # Page components
│   ├── routes/               # Route definitions
│   ├── types/                # TypeScript type definitions
│   ├── assets/              # Static assets
│   └── test/                # Test files
├── docs/                    # Documentation
└── public/                 # Public static files
```

## 🛠 Tech Stack

### Core Technologies
- **Frontend Framework**: React 19
- **Build Tool**: Vite 6.2.0
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 4.0.14
- **State Management**: React Hooks
- **Routing**: React Router DOM 7.3.0

### UI Components
- Radix UI primitives
- Shadcn UI components
- Framer Motion for animations
- Lucide React for icons
- Sonner for toast notifications

### Backend & Database
- Supabase for:
  - Database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### Form Management
- React Hook Form
- Zod for validation
- Date-fns for date handling

### Testing
- Vitest
- React Testing Library
- Jest DOM

## 📝 Code Conventions

### File Naming
- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Pages**: PascalCase with Page suffix (e.g., `ProductsPage.tsx`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Types**: PascalCase with Type/Interface suffix (e.g., `ProductType.ts`)
- **API modules**: camelCase (e.g., `products.ts`)

### Import Order
1. React and framework imports
2. Third-party libraries
3. Local components
4. Local utilities/hooks
5. Types
6. Assets

### Database Schema

#### Products Table
- id: uuid (PK)
- name: string
- sku: string (unique)
- description: string
- price_usd: numeric
- price_mxn: numeric
- category: string
- brand: string
- material: string
- purity: string
- weight: numeric
- is_active: boolean
- metadata: jsonb
- created_at: timestamp
- updated_at: timestamp

#### Warehouses Table
- id: uuid (PK)
- name: string
- code: string (unique)
- is_active: boolean
- is_default: boolean
- address: string
- phone: string
- email: string
- manager_name: string
- metadata: jsonb
- created_at: timestamp
- updated_at: timestamp

#### Warehouse_Products Table
- id: uuid (PK)
- warehouse_id: uuid (FK)
- product_id: uuid (FK)
- quantity: integer
- min_stock: integer
- max_stock: integer
- location: string
- last_counted_at: timestamp
- metadata: jsonb
- created_at: timestamp
- updated_at: timestamp

#### Warehouse_History Table
- id: uuid (PK)
- warehouse_id: uuid (FK)
- product_id: uuid (FK)
- action_type: string (STOCK_IN/STOCK_OUT)
- quantity_change: integer
- previous_quantity: integer
- new_quantity: integer
- reference_number: string
- user_id: uuid
- notes: string
- metadata: jsonb
- created_at: timestamp

## 🎨 UI/UX Guidelines

### Breakpoints
```typescript
const breakpoints = {
  'xs': '320px',   // Small phones
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablets
  'lg': '1024px',  // Laptops
  'xl': '1280px',  // Desktops
  '2xl': '1536px'  // Large screens
}
```

### Color Palette
```typescript
const colors = {
  primary: {
    DEFAULT: '#2563eb', // Blue
    light: '#60a5fa',
    dark: '#1e40af'
  },
  secondary: {
    DEFAULT: '#475569', // Slate
    light: '#94a3b8',
    dark: '#1e293b'
  },
  // ... other colors
}
```

### Typography Scale
```typescript
const typography = {
  xs: ['0.75rem', '1rem'],      // 12px
  sm: ['0.875rem', '1.25rem'],  // 14px
  base: ['1rem', '1.5rem'],     // 16px
  lg: ['1.125rem', '1.75rem'],  // 18px
  xl: ['1.25rem', '1.75rem'],   // 20px
  '2xl': ['1.5rem', '2rem'],    // 24px
  '3xl': ['1.875rem', '2.25rem'] // 30px
}
```

## 🔐 Security Practices

### Authentication
- Use Supabase Auth for user management
- Implement Row Level Security (RLS) policies
- Store sensitive data in environment variables
- Use HTTP-only cookies for session management

### API Security
- Input validation using Zod schemas
- Proper error handling and sanitization
- Rate limiting on sensitive endpoints
- CORS configuration

## 🚀 Development Workflow

### Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Environment variables are already configured with Supabase credentials
4. Run development server: `npm run dev`

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Environment Configuration
The project is already configured with Supabase:
- Database URL: kyvojzhfbfigmnsrecqu.supabase.co
- Authentication and RLS are properly set up
- Real-time subscriptions are enabled
- Row Level Security (RLS) policies are in place

## 📚 Additional Resources
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/) 