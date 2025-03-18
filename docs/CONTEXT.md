# CRM Jewelry Store App Documentation

## Table of Contents
- [Overview](#overview)
- [Client Management](#client-management)
- [Products Management](#products-management)
- [Sales Process](#sales-process)
- [Additional Features](#additional-features)

## Overview

The application provides a streamlined dashboard interface for jewelry store management. Users can access the system through email authentication, leading to the main dashboard titled:

## Tech Stack

- Front end: React + Vite with typeScript , react router dom and tailwindcss v4
- Backend: Supabase

## Database Schema

### Tables

#### users
- id: uuid (primary key)
- email: string (unique)
- created_at: timestamp
- updated_at: timestamp
- role: enum ('admin', 'manager', 'staff')

#### clients
- id: uuid (primary key)
- customer_id: string (unique)
- first_name: string
- last_name: string
- email: string
- phone: string
- date_of_birth: date
- address: text
- created_at: timestamp
- updated_at: timestamp

#### products
- id: uuid (primary key)
- inventory_number: string (unique)
- name: string
- description: text
- category: string
- price_usd: decimal
- price_mxn: decimal
- warehouse_id: uuid (foreign key)
- created_at: timestamp
- updated_at: timestamp

#### warehouses
- id: uuid (primary key)
- name: string
- is_active: boolean
- created_at: timestamp
- updated_at: timestamp

#### sales
- id: uuid (primary key)
- client_id: uuid (foreign key)
- total_amount: decimal
- currency: enum ('USD', 'MXN')
- payment_method: enum ('CASH_PESOS', 'CASH_DOLARES', 'CREDIT_CARD', 'DEBIT_CARD', 'OTROS')
- status: enum ('completed', 'pending', 'cancelled')
- created_at: timestamp
- updated_at: timestamp

#### sale_items
- id: uuid (primary key)
- sale_id: uuid (foreign key)
- product_id: uuid (foreign key)
- quantity: integer
- unit_price: decimal
- currency: enum ('USD', 'MXN')
- created_at: timestamp

#### inventory_movements
- id: uuid (primary key)
- product_id: uuid (foreign key)
- warehouse_id: uuid (foreign key)
- quantity: integer
- movement_type: enum ('in', 'out')
- created_at: timestamp
- created_by: uuid (foreign key to users)

## Project Structure

```
src/
├── assets/                 # Static assets (images, fonts, etc.)
├── components/            # Reusable UI components
│   ├── common/           # Shared components (buttons, inputs, etc.)
│   ├── layout/           # Layout components (header, footer, etc.)
│   └── features/         # Feature-specific components
├── config/               # Configuration files
├── constants/            # Constants and enums
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and services
│   ├── api/            # API integration
│   ├── supabase/       # Supabase client and utilities
│   └── utils/          # Helper functions
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   ├── clients/       # Client management pages
│   ├── products/      # Product management pages
│   └── sales/         # Sales pages
├── styles/            # Global styles and Tailwind config
├── types/             # TypeScript type definitions
└── App.tsx            # Root component

public/                # Public static files
├── index.html
└── favicon.ico

docs/                 # Documentation
├── CONTEXT.md        # Project context and requirements
└── API.md           # API documentation

tests/               # Test files
├── unit/
├── integration/
└── e2e/

scripts/             # Build and deployment scripts
```

**SOLICITUD DE MODIFICACIONES Y PENDIENTES POS JOYERÍA EL ZAFIRO**

## Client Management

### Search Functionality
- Search clients using unique customer ID numbers
- Quick access to existing customer profiles

### Client Registration
#### New Registration Form Updates
- ✨ Added: "Fecha de Cumpleaños" (Date of Birth) field
- 🗑️ Removed: "Número de Impuesto" field
- ✅ New: Direct customer ID registration within the form

### Birthday Management
- Generate comprehensive birthday reports
- Export birthday calendar
- Filter and sort capabilities

## Products Management

### Warehouse Configuration
- Default warehouse: "PLAZA REAL"
- Configuration options:
  - Ability to disable "MATRIZ" warehouse
  - Preserve historical data when modifying warehouse settings

### Product Pricing
- Clear currency indicators:
  - USD (Dollars) 
  - MXN (Pesos)
- Visual distinction between currencies in all product views

## Sales Process

### Scanning Optimization
- Streamlined inventory scanning process
- Direct inventory number capture
- Simplified data entry requirements

### iPad Interface Improvements
#### Display Optimization
- Full-screen transaction view
- Enhanced quantity management
- Simplified product editing

#### UI Enhancements
- 🔄 Remove non-functional ring logo arrows
- 🛑 Auto-hide product catalog post-purchase
- 📱 iPad-specific layout optimizations

### Payment Methods

#### Updates
- ✅ Added: "Tarjeta de Débito"
- 🗑️ Removed: "WESTERN UNION"
- 🔄 Renamed payment options:
  - "CASH PESOS" → MXN payments
  - "CASH DOLARES" → USD payments

#### Known Issues
- ⚠️ "CREDIT CARD" payment error: "Fallido. Cuenta de tarjeta de crédito no disponible"
- Review necessity of "OTROS" payment option

### Receipt Management
- Currency type display (MXN/USD)
- Single-page receipt optimization
- Print layout improvements

## Additional Features

### Data Management
- Bulk client import functionality
- Supported formats:
  - CSV
  - Excel spreadsheets

### Training Resources
- Inventory management guides
- System usage documentation
- Best practices

### Hardware Integration
#### Barcode Scanner Requirements
- Compatible scanner specifications
- Setup guidelines
- Usage recommendations

---

## Support
For technical assistance or feature requests, please contact system administration.
