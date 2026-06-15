import React, { useState, useEffect } from 'react'
import Api from './Api.js'
import Skeleton from '../components/Skeleton'
import Pagination from '../components/Pagination'

const CustomerList = () => {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterCountry, setFilterCountry] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [form, setform] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        country: ''
    })

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const res = await Api.get("/customer/get-customer")
            setCustomers(res.data.customers || [])
        } catch (error) {
            console.error("Error fetching customers:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, filterCountry])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await Api.post("/customer/add-customer", form)
            alert("User Added successfully!");
            setform({
                name: '',
                email: '',
                phone: '',
                address: '',
                country: ''
            })
            setShowForm(false)
            fetchCustomers()
        } catch (error) {
            console.error("Registration error:", error)
            alert(error.response?.data?.message || "Registration failed. Please try again.")
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setform((prev) => ({
            ...prev, [name]: value
        }))
    }

    const filteredCustomers = customers.filter(c => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = String(c.name || '').toLowerCase().includes(query) || 
                              String(c.email || '').toLowerCase().includes(query) || 
                              String(c.phone || '').toLowerCase().includes(query);
        const matchesFilter = filterCountry ? c.country === filterCountry : true;
        return matchesSearch && matchesFilter;
    });

    const uniqueCountries = [...new Set(customers.map(c => c.country).filter(Boolean))];

    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <div className="max-w-5xl w-full mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-colors duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customers</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Manage all your registered users and clients.</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(true)} 
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
                    <div className="sm:w-64">
                        <select 
                            value={filterCountry}
                            onChange={(e) => setFilterCountry(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200 cursor-pointer"
                        >
                            <option value="">All Countries</option>
                            {uniqueCountries.map((country, idx) => (
                                <option key={idx} value={country}>{country}</option>
                            ))}
                        </select>
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
                                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Country</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10 transition-colors">
                                        <td className="py-4 px-5"><Skeleton variant="text" width="60%" className="h-4" /></td>
                                        <td className="py-4 px-5"><Skeleton variant="text" width="80%" className="h-4" /></td>
                                        <td className="py-4 px-5"><Skeleton variant="text" width="50%" className="h-4" /></td>
                                        <td className="py-4 px-5"><Skeleton variant="text" width="90%" className="h-4" /></td>
                                        <td className="py-4 px-5"><Skeleton variant="text" width="40%" className="h-4" /></td>
                                    </tr>
                                ))
                            ) : paginatedCustomers.length > 0 ? (
                                paginatedCustomers.map((customer, idx) => (
                                    <tr key={customer._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="py-4 px-5 text-sm font-semibold text-slate-800 dark:text-slate-200">{customer.name}</td>
                                        <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400">{customer.email}</td>
                                        <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400">{customer.phone}</td>
                                        <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{customer.address}</td>
                                        <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400">{customer.country}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No users found.</p>
                                            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Click "Add New User" to create your first user.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination 
                    currentPage={currentPage}
                    totalItems={filteredCustomers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>

            {/* Drawer */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div 
                        className="absolute inset-0 bg-slate-900/20 dark:bg-slate-950/45 backdrop-blur-sm animate-fadeIn"
                        onClick={() => setShowForm(false)}
                    ></div>
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col overflow-y-auto animate-slideIn transition-colors duration-200">
                        <div className="p-8 flex-1">
                            <div className="mb-6 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New User</h2>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Enter profile details for the new user.</p>
                                </div>
                                <button 
                                    onClick={() => setShowForm(false)} 
                                    className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="border-b border-slate-100 dark:border-slate-800 mb-6"></div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">User Name</label>
                                    <input
                                        type='text'
                                        name='name'
                                        required
                                        value={form.name}
                                        placeholder='Enter Name'
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-705 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                    <input
                                        type='email'
                                        name='email'
                                        required
                                        value={form.email}
                                        placeholder='example@gmail.com'
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-705 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input
                                        type='text'
                                        name='phone'
                                        required
                                        value={form.phone}
                                        placeholder='Enter Phone Number'
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-705 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Address</label>
                                    <input
                                        type='text'
                                        name='address'
                                        required
                                        value={form.address}
                                        placeholder='Enter Address'
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-705 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Country</label>
                                    <input
                                        type='text'
                                        name='country'
                                        required
                                        value={form.country}
                                        placeholder='Enter Country'
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-705 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                                    />
                                </div>
                                <button type='submit' className="w-full mt-6 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0">
                                    Save User
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default CustomerList
