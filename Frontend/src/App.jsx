import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Skeleton from './components/Skeleton'

const Register = lazy(() => import('./pages/RegisterCustomer.jsx'))
const Invoice = lazy(() => import('./pages/Invoice.jsx'))
const Payment = lazy(() => import('./pages/Payment.jsx'))
const Tax = lazy(() => import('./pages/Tax.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Reports = lazy(() => import('./pages/Reports.jsx'))
const CustomerList = lazy(() => import('./pages/CustomerList.jsx'))
const UsersList = lazy(() => import('./pages/UsersList.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))

import Layout from './components/Layout.jsx'
const IndexRedirect = () => {
  const authUserStr = localStorage.getItem("authUser");
  if (!authUserStr) return <Navigate to="/login" replace />;
  
  return <Navigate to="/dashboard" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
              <div className="w-full max-w-[440px] bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-10 space-y-6">
                <div className="flex flex-col items-center space-y-3">
                  <Skeleton variant="circular" width={48} height={48} />
                  <Skeleton variant="text" width="120px" className="h-6" />
                  <Skeleton variant="text" width="180px" className="h-3" />
                </div>
                <div className="space-y-4">
                  <div>
                    <Skeleton variant="text" width="80px" className="h-3 mb-2" />
                    <Skeleton variant="rounded" className="w-full h-11" />
                  </div>
                  <div>
                    <Skeleton variant="text" width="80px" className="h-3 mb-2" />
                    <Skeleton variant="rounded" className="w-full h-11" />
                  </div>
                  <Skeleton variant="rounded" className="w-full h-12 pt-2" />
                </div>
              </div>
            </div>
          }>
            <Login />
          </Suspense>
        } 
      />
      
      {/* Protected Routes wrapped in Layout */}
      <Route element={<Layout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<IndexRedirect />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/tax" element={<Tax />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App