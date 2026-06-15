import React, { Suspense, useState, useEffect } from 'react'
import { Outlet, NavLink, Navigate } from 'react-router-dom'
import PageSkeleton from './PageSkeleton'

const Layout = () => {
    // Check if user is authenticated
    const authUserStr = localStorage.getItem("authUser");
    
    // If not authenticated, redirect to login page
    if (!authUserStr) {
        return <Navigate to="/login" replace />;
    }

    const authUser = JSON.parse(authUserStr);
    const role = authUser.role || 'admin'; // fallback if undefined

    // Theme state initialization and side effect
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // RBAC Security Checks based on current path
    const path = window.location.pathname;

    if (role === 'accountant') {
        // Accountant can only access /payment and /invoice and /dashboard
        if (!['/payment', '/invoice', '/dashboard'].includes(path) && path !== '/') {
            return <Navigate to="/dashboard" replace />;
        }
    } else if (role === 'customer') {
        // Customer can only access /payment, /invoice, and /tax and /dashboard
        if (!['/payment', '/invoice', '/tax', '/dashboard'].includes(path) && path !== '/') {
            return <Navigate to="/dashboard" replace />;
        }
    } else if (role === 'manager') {
        // Manager can access everything EXCEPT /users
        if (path === '/users') {
            return <Navigate to="/dashboard" replace />;
        }
    }

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem("authUser");
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased font-sans flex flex-row transition-colors duration-200">
            {/* Left Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-250/40 dark:border-slate-800/80 flex flex-col h-screen sticky top-0 px-4 py-6 shadow-sm/50 transition-colors duration-200">
                {/* Branding header */}
                <div className="flex items-center gap-2.5 px-2.5 mb-8">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                        F
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Finance Manager
                    </span>
                </div>

                {/* Navigation links */}
                <nav className="flex flex-col gap-1.5 flex-grow">
                    {/* Everyone can see the Dashboard */}
                    <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/30 shadow-sm/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        Dashboard
                    </NavLink>

                    {/* Admin and Manager can see Customers */}
                    {role !== 'accountant' && role !== 'customer' && (
                        <NavLink to="/customers" className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/30 shadow-sm/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                            Customers
                        </NavLink>
                    )}

                    {/* ONLY Admin can see Users */}
                    {role === 'admin' && (
                        <NavLink to="/users" className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/30 shadow-sm/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                            Users
                        </NavLink>
                    )}

                    {/* ALL roles can see Invoices and Payments */}
                    <NavLink to="/invoice" className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/30 shadow-sm/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        Invoices
                    </NavLink>
                    <NavLink to="/payment" className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/30 shadow-sm/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        Payments
                    </NavLink>

                    {/* Admin, Manager, and Customer can see Tax */}
                    {role !== 'accountant' && (
                        <NavLink to="/tax" className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/30 shadow-sm/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                            Taxes
                        </NavLink>
                    )}
                    
                    {/* Admin and Manager can see Reports */}
                    {role !== 'accountant' && role !== 'customer' && (
                        <NavLink to="/reports" className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/30 shadow-sm/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                            Reports
                        </NavLink>
                    )}
                </nav>

                {/* Footer info & Logout & Theme Toggle */}
                <div className="px-2 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto flex flex-col gap-3 transition-colors duration-200">
                    {/* Day/Night Theme Toggle Switch */}
                    <button 
                        onClick={toggleTheme}
                        className="w-full text-left flex items-center justify-between px-2.5 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200"
                        title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
                    >
                        <span className="flex items-center gap-2">
                            {theme === 'light' ? (
                                <>
                                    <svg className="w-4.5 h-4.5 text-amber-500 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.46 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
                                    </svg>
                                    <span>Day Mode</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4.5 h-4.5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                    <span>Night Mode</span>
                                </>
                            )}
                        </span>
                        <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5 transition-colors duration-200 relative flex items-center">
                            <div className={`w-3.5 h-3.5 bg-white dark:bg-slate-100 rounded-full shadow-sm transform duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-3.5' : 'translate-x-0'}`} />
                        </div>
                    </button>

                    <button 
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-2.5 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-red-500"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Logout
                    </button>
                    
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-650 px-1">
                        System Online • v1.0.0
                    </span>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow overflow-y-auto p-12 flex flex-col justify-start">
                <Suspense fallback={<PageSkeleton />}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    )
}

export default Layout
