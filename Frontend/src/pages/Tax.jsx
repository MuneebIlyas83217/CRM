import React, { useState, useEffect } from 'react'
import Api from './Api.js'
import Pagination from '../components/Pagination'

const Tax=()=>{
    const [taxes, setTaxes] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterEnabled, setFilterEnabled] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [form, setForm] = useState({
        name: "",
        value: "",
        enabled: false,
        default_mode: false
    })

    const fetchTaxes = async () => {
        try {
            const res = await Api.get("/customer/get-taxes")
            setTaxes(res.data.taxes || [])
        } catch (error) {
            console.error("Error fetching taxes:", error)
        }
    }

    useEffect(() => {
        fetchTaxes()
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, filterEnabled])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                name: form.name,
                value: parseFloat(form.value) || 0,
                enabled: form.enabled,
                default: form.default_mode
            }
            const res = await Api.post("/customer/add-tax", payload)
            alert("Tax configuration created successfully!")
            setForm({
                name: "",
                value: "",
                enabled: false,
                default_mode: false
            })
            setShowForm(false)
            fetchTaxes()
        } catch (error) {
            console.error("Tax creation error:", error)
            alert(error.response?.data?.message || "Tax creation failed. Please try again.")
        }
    }
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const filteredTaxes = taxes.filter(t => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = t.name?.toLowerCase().includes(query);
        const matchesFilter = filterEnabled === '' ? true : (filterEnabled === 'true' ? t.enabled === true : t.enabled === false);
        return matchesSearch && matchesFilter;
    })

    const paginatedTaxes = filteredTaxes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <div className="max-w-5xl w-full mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-colors duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Taxes</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Manage all your tax configurations and percentages.</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(true)} 
                        className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-150"
                    >
                        + Add New Tax
                    </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400 dark:text-slate-555" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search by tax name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                        />
                    </div>
                    <div className="sm:w-64">
                        <select 
                            value={filterEnabled}
                            onChange={(e) => setFilterEnabled(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200 cursor-pointer"
                        >
                            <option value="">All Statuses</option>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 transition-colors">
                                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tax Name</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Value (%)</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enabled</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Default Mode</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
                            {paginatedTaxes.length > 0 ? (
                                paginatedTaxes.map((taxItem, idx) => (
                                    <tr key={taxItem._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="py-4 px-5 text-sm font-semibold text-slate-800 dark:text-slate-200">{taxItem.name}</td>
                                        <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400">{taxItem.value}%</td>
                                        <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${taxItem.enabled ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                                {taxItem.enabled ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${taxItem.default ? 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                                {taxItem.default ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg>
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No tax configurations found.</p>
                                            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Click "Add New Tax" to create one.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination 
                    currentPage={currentPage}
                    totalItems={filteredTaxes.length}
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
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Tax Configuration</h2>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Set up new custom tax configurations and percentage rates.</p>
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
                                    <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Tax Name</label>
                                    <input type="text"
                                        name='name'
                                        required
                                        value={form.name}
                                        placeholder='Name'
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Tax Value (%)</label>
                                    <input type="text"
                                        name='value'
                                        required
                                        value={form.value}
                                        placeholder='Value'
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                                    />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-all select-none">
                                        <span className="text-sm font-semibold text-slate-750 dark:text-slate-300">Enabled</span>
                                        <input type="checkbox"
                                            name='enabled'
                                            checked={form.enabled}
                                            onChange={handleChange}
                                            className="w-5 h-5 rounded text-indigo-600 border-slate-350 focus:ring-indigo-500 cursor-pointer"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-all select-none">
                                        <span className="text-sm font-semibold text-slate-750 dark:text-slate-300">Default Mode</span>
                                        <input type="checkbox"
                                            name='default_mode'
                                            checked={form.default_mode}
                                            onChange={handleChange}
                                            className="w-5 h-5 rounded text-indigo-600 border-slate-350 focus:ring-indigo-500 cursor-pointer"
                                        />
                                    </label>
                                </div>
                                <button type='submit' className="w-full mt-6 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Tax