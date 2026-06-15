import React, { useState, useEffect } from 'react'
import Api from './Api.js'
import { useNavigate } from 'react-router-dom'
import Skeleton from '../components/Skeleton'
import Pagination from '../components/Pagination'

const UsersList = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const navigate = useNavigate()

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const res = await Api.get("/auth/users")
            setUsers(res.data.users || [])
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        
        try {
            await Api.delete("/auth/delete", { data: { id } })
            fetchUsers() // Refresh list after deletion
        } catch (error) {
            console.error("Error deleting user:", error)
            alert("Failed to delete user.")
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    const filteredUsers = users.filter(u => {
        const query = searchQuery.toLowerCase();
        return String(u.name || '').toLowerCase().includes(query) || 
               String(u.email || '').toLowerCase().includes(query) || 
               String(u.phone || '').toLowerCase().includes(query);
    });

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="max-w-5xl w-full mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-colors duration-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Users</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">View all registered administrative users in the system.</p>
                </div>
                <button 
                    onClick={() => navigate("/register")} 
                    className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-150"
                >
                    + Add New User
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400 dark:text-slate-555" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or phone..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 transition-colors">
                            <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                            <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                            <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</th>
                            <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Address</th>
                            <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <tr key={i} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10 transition-colors">
                                    <td className="py-4 px-5"><Skeleton variant="text" width="60%" className="h-4" /></td>
                                    <td className="py-4 px-5"><Skeleton variant="text" width="80%" className="h-4" /></td>
                                    <td className="py-4 px-5"><Skeleton variant="text" width="55%" className="h-4" /></td>
                                    <td className="py-4 px-5"><Skeleton variant="text" width="90%" className="h-4" /></td>
                                    <td className="py-4 px-5"><Skeleton variant="rounded" width={60} className="h-6" /></td>
                                    <td className="py-4 px-5 text-right"><Skeleton variant="circular" width={24} height={24} className="ml-auto inline-block" /></td>
                                </tr>
                            ))
                        ) : paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user, idx) => (
                                <tr key={user._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="py-4 px-5 text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</td>
                                    <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                                    <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400">{user.phone}</td>
                                    <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{user.address}</td>
                                    <td className="py-4 px-5 text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            user.isActive !== false ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                                        }`}>
                                            {user.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 text-sm text-right">
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                            title="Delete User"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No system users found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                currentPage={currentPage}
                totalItems={filteredUsers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
            />
        </div>
    )
}

export default UsersList
