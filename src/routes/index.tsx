import { createBrowserRouter, Navigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import DashboardPage from '../pages/dashboard'
import ClientsPage from '../pages/clients'
import NewClientPage from '../pages/clients/new'
import ClientDetailsPage from '../pages/clients/[id]'
import ProductsPage from '../pages/products'
import SalesPage from '../pages/sales'
import ErrorPage from '../pages/error'
import LoginPage from '../pages/auth/login'
import SignUpPage from '../pages/auth/signup'
import ForgotPasswordPage from '../pages/auth/forgot-password'
import ResetPasswordPage from '../pages/auth/reset-password'
import AuthCallback from '../pages/auth/callback'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { PublicRoute } from '../components/auth/PublicRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <SignUpPage />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/auth/reset-password',
    element: (
      <PublicRoute>
        <ResetPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'clients',
        children: [
          {
            index: true,
            element: <ClientsPage />
          },
          {
            path: 'new',
            element: <NewClientPage />
          },
          {
            path: ':id',
            element: <ClientDetailsPage />
          }
        ]
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'sales',
        element: <SalesPage />
      }
    ]
  }
]) 