import React from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const authUserStr = localStorage.getItem("authUser");
    const authUser = authUserStr ? JSON.parse(authUserStr) : null;
    
    const role = authUser?.role || 'admin';
    const name = authUser?.name || 'User';

    const getRoleBadge = (roleName) => {
        switch(roleName) {
            case 'admin':
                return <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider">Admin</span>;
            case 'manager':
                return <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">Manager</span>;
            case 'accountant':
                return <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">Accountant</span>;
            case 'customer':
                return <span className="px-3 py-1 bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">Customer</span>;
            default:
                return <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider">{roleName}</span>;
        }
    }

    return (
        <div className="max-w-5xl w-full mx-auto">
            {/* Welcome Banner */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 relative overflow-hidden transition-colors duration-200">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-950/10 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 dark:bg-blue-950/10 rounded-full blur-3xl -ml-10 -mb-10 opacity-50 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back, {name}!</h1>
                            {getRoleBadge(role)}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Here is what's happening with your finance portal today.</p>
                    </div>
                </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4 transition-colors duration-200">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Your Account</p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 capitalize">{role} Access</p>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4 transition-colors duration-200">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">System Status</p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">All Systems Operational</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
