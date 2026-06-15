import React, { useState, useEffect } from "react";
import Api from "./Api.js";
import Skeleton from '../components/Skeleton';

const Invoice = () => {
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [form, setForm] = useState({
        client:'',
        number:'',
        year:'',
        status:'draft',
        date:'',
        expire_date:'',
        note:'',
        item:'',
        description:'',
        quantity:'',
        price:'',
        total:''
    })

    const fetchInvoices = async () => {
        try {
            setLoading(true)
            const res = await Api.get("/customer/get-invoices")
            setInvoices(res.data.invoices || [])
        } catch (error) {
            console.error("Error fetching invoices:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInvoices()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                client: form.client,
                Number: Number(form.number),
                Year: Number(form.year),
                status: form.status,
                Date: form.date,
                expire_date: form.expire_date,
                note: form.note,
                items: form.item,
                description: form.description,
                price: Number(form.price),
                Quentity: String(form.quantity),
                total: Number(form.total)
            }
            const res = await Api.post("/customer/add-invoice", payload)
            alert("Invoice generated successfully!")
            
            // Auto-print the newly generated invoice
            handlePrint({
                ...payload,
                client: form.client,
                Number: form.number,
                Date: form.date,
                status: form.status,
                items: form.item,
                description: form.description,
                Quentity: form.quantity,
                price: form.price,
                total: form.total,
                note: form.note
            });

            setForm({
                client:'',
                number:'',
                year:'',
                status:'draft',
                date:'',
                expire_date:'',
                note:'',
                item:'',
                description:'',
                quantity:'',
                price:'',
                total:''
            })
            setShowForm(false)
            fetchInvoices()
        } catch (error) {
            console.error("Invoice generation error:", error)
            alert(error.response?.data?.message || "Invoice generation failed. Please try again.")
        }
    }
    const handleChange=(e)=>{
        const{name,value}=e.target;
        setForm((prev)=>({...prev,[name]:value}))
    }

    const handlePrint = (inv) => {
        const printWindow = window.open('', '', 'width=800,height=800');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice #${inv.Number || inv.number}</title>
                    <style>
                        body { font-family: system-ui, -apple-system, sans-serif; color: #334155; padding: 40px; max-width: 800px; margin: 0 auto; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 32px; }
                        .title { font-size: 32px; font-weight: 800; color: #4f46e5; letter-spacing: -0.02em; }
                        .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { padding: 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
                        th { background-color: #f8fafc; font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; tracking: wider; }
                        .total-row td { font-weight: 700; font-size: 18px; color: #0f172a; border-bottom: none; padding-top: 24px; }
                        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background: #e0e7ff; color: #3730a3; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <div class="title">INVOICE</div>
                            <div style="color: #64748b; margin-top: 8px; font-weight: 500;">#${inv.Number || inv.number}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="badge">${(inv.status || 'draft')}</div>
                            <div style="margin-top: 12px; font-size: 14px;"><strong>Date:</strong> ${inv.Date ? new Date(inv.Date).toLocaleDateString() : 'N/A'}</div>
                            ${inv.expire_date ? `<div style="margin-top: 4px; font-size: 14px;"><strong>Due:</strong> ${new Date(inv.expire_date).toLocaleDateString()}</div>` : ''}
                        </div>
                    </div>
                    <div class="details">
                        <div>
                            <div style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.05em;">Billed To</div>
                            <div style="font-size: 18px; font-weight: 600; color: #0f172a;">${inv.client}</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-weight: 500; color: #0f172a;">${inv.items || inv.item || 'Service'}</td>
                                <td style="color: #64748b;">${inv.description || '-'}</td>
                                <td>${inv.Quentity || inv.quantity || 1}</td>
                                <td>$${inv.price || inv.total || 0}</td>
                                <td style="text-align: right; font-weight: 500; color: #0f172a;">$${inv.total || 0}</td>
                            </tr>
                            <tr class="total-row">
                                <td colspan="4" style="text-align: right;">Total Amount Due:</td>
                                <td style="text-align: right; color: #4f46e5;">$${inv.total || 0}</td>
                            </tr>
                        </tbody>
                    </table>
                    ${inv.note ? `<div style="margin-top: 48px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;"><div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 8px;">Notes</div><div style="font-size: 14px; color: #334155;">${inv.note}</div></div>` : ''}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);
    };

    const filteredInvoices = invoices.filter(inv => {
        const query = searchQuery.toLowerCase();
        const clientStr = String(inv.client || '').toLowerCase();
        const numberStr = String(inv.Number || '').toLowerCase();
        const matchesSearch = clientStr.includes(query) || numberStr.includes(query);
        const matchesFilter = filterStatus ? inv.status === filterStatus : true;
        return matchesSearch && matchesFilter;
    })

    return (
        <>
            <div className="max-w-6xl w-full mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Invoices</h2>
                        <p className="text-xs text-slate-400 mt-1">Manage and track all generated client invoices.</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(true)} 
                        className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-150"
                    >
                        + Generate New Invoice
                    </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search by client or invoice number..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                        />
                    </div>
                    <div className="sm:w-64">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200 cursor-pointer"
                        >
                            <option value="">All Statuses</option>
                            <option value="draft">Draft</option>
                            <option value="final">Final</option>
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice #</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="hover:bg-slate-50/20 transition-colors">
                                        <td className="py-4 px-5"><Skeleton variant="text" width="40%" className="h-4" /></td>
                                        <td className="py-4 px-5"><Skeleton variant="text" width="70%" className="h-4" /></td>
                                        <td className="py-4 px-5"><Skeleton variant="text" width="50%" className="h-4" /></td>
                                        <td className="py-4 px-5"><Skeleton variant="text" width="30%" className="h-4 font-semibold" /></td>
                                        <td className="py-4 px-5"><Skeleton variant="rounded" width={55} className="h-6" /></td>
                                        <td className="py-4 px-5 text-right"><Skeleton variant="rounded" width={80} className="h-8 ml-auto inline-block" /></td>
                                    </tr>
                                ))
                            ) : filteredInvoices.length > 0 ? (
                                filteredInvoices.map((inv, idx) => (
                                    <tr key={inv._id || idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-5 text-sm font-semibold text-slate-800">#{inv.Number}</td>
                                        <td className="py-4 px-5 text-sm text-slate-600">{inv.client}</td>
                                        <td className="py-4 px-5 text-sm text-slate-600">{inv.Date ? new Date(inv.Date).toLocaleDateString() : 'N/A'}</td>
                                        <td className="py-4 px-5 text-sm font-semibold text-slate-900">${inv.total}</td>
                                        <td className="py-4 px-5 text-sm">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                inv.status === 'final' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {inv.status ? inv.status.charAt(0).toUpperCase() + inv.status.slice(1) : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-sm text-right">
                                            <button 
                                                onClick={() => handlePrint(inv)}
                                                className="text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                                Print/PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium">No invoices found.</p>
                                            <p className="text-slate-400 text-xs mt-1">Click "Generate New Invoice" to create one.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div 
                        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-fadeIn"
                        onClick={() => setShowForm(false)}
                    ></div>
                    <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-slideIn">
                        <div className="p-8 flex-1">
                            <div className="mb-6 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Generate Invoice</h2>
                                    <p className="text-xs text-slate-400 mt-1">Configure and generate a client billing invoice details.</p>
                                </div>
                                <button 
                                    onClick={() => setShowForm(false)} 
                                    className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="border-b border-slate-100 mb-6"></div>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Customer ID</label>
                                        <input 
                                        type='text'
                                        name='client'
                                        value={form.client}
                                        placeholder='Customer id'
                                        onChange={handleChange}  
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Invoice Number</label>
                                        <input 
                                        type="number"
                                        name="number"
                                        value={form.number}
                                        placeholder='number'
                                        onChange={handleChange}    
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Year</label>
                                        <input 
                                        type="number"
                                        name="year"
                                        value={form.year}
                                        placeholder='Year'
                                        onChange={handleChange}    
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                                        <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}    
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="final">Final</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Issue Date</label>
                                        <input type="date"
                                        name="date"
                                        value={form.date}
                                        placeholder='Date'
                                        onChange={handleChange}    
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Expiry Date</label>
                                        <input
                                        type="date"
                                        name='expire_date'
                                        value={form.expire_date}
                                        placeholder='Expire Date'
                                        onChange={handleChange}    
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Note</label>
                                        <input
                                        type='text'
                                        name='note'
                                        value={form.note}
                                        placeholder='Note'
                                        onChange={handleChange}    
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
                                        <input 
                                        type='text'
                                        name='item'
                                        value={form.item}
                                        placeholder='Item Name'
                                        onChange={handleChange}    
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Item Description</label>
                                        <input
                                        type='text'
                                        name='description'
                                        value={form.description}
                                        placeholder='Description Name'
                                        onChange={handleChange}    
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quantity</label>
                                        <input 
                                        type='number'
                                        name='quantity'
                                        value={form.quantity}
                                        placeholder='Quantity'
                                        onChange={handleChange}    
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Price</label>
                                        <input 
                                        type='number'
                                        name='price'
                                        value={form.price}
                                        placeholder='Price'
                                        onChange={handleChange}    
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Amount</label>
                                        <input
                                        type='number'
                                        name='total'
                                        value={form.total}
                                        placeholder='Total'
                                        onChange={handleChange}    
                                        className="w-full px-4 py-2.5 bg-indigo-50/20 border border-indigo-150 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200 font-semibold"
                                        />
                                    </div>
                                </div>
                                <button type='submit' className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0">
                                    Generate Invoice
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default Invoice
