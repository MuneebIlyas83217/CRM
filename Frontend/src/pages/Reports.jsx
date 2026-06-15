import React, { useState, useEffect } from 'react'
import Api from './Api.js'
import Pagination from '../components/Pagination'

const Reports = () => {
    const [invoices, setInvoices] = useState([])
    const [downloadLimit, setDownloadLimit] = useState('all') // 'all', '10', '50', '100'
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const fetchInvoices = async () => {
        try {
            const res = await Api.get("/customer/get-invoices")
            // Sort by date descending (newest first)
            const sorted = (res.data.invoices || []).sort((a, b) => new Date(b.Date || 0) - new Date(a.Date || 0))
            setInvoices(sorted)
        } catch (error) {
            console.error("Error fetching invoices:", error)
        }
    }

    useEffect(() => {
        fetchInvoices()
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [downloadLimit])

    // Get the subset of invoices based on the filter
    const getInvoicesToDownload = () => {
        if (downloadLimit === 'all') return invoices;
        return invoices.slice(0, parseInt(downloadLimit, 10));
    }

    const invoicesToDownload = getInvoicesToDownload();

    const paginatedInvoices = invoicesToDownload.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleBulkPrint = () => {
        if (invoicesToDownload.length === 0) {
            alert("No invoices to download.");
            return;
        }

        setLoading(true);
        const printWindow = window.open('', '', 'width=800,height=800');
        
        let htmlContent = `
            <html>
                <head>
                    <title>Bulk Invoice Report</title>
                    <style>
                        body { font-family: system-ui, -apple-system, sans-serif; color: #334155; margin: 0; padding: 0; }
                        .invoice-page { padding: 40px; max-width: 800px; margin: 0 auto; page-break-after: always; }
                        .invoice-page:last-child { page-break-after: auto; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 32px; }
                        .title { font-size: 32px; font-weight: 800; color: #4f46e5; letter-spacing: -0.02em; }
                        .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { padding: 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
                        th { background-color: #f8fafc; font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
                        .total-row td { font-weight: 700; font-size: 18px; color: #0f172a; border-bottom: none; padding-top: 24px; }
                        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background: #e0e7ff; color: #3730a3; }
                    </style>
                </head>
                <body>
        `;

        invoicesToDownload.forEach((inv) => {
            htmlContent += `
                <div class="invoice-page">
                    <div class="header">
                        <div>
                            <div class="title">INVOICE</div>
                            <div style="color: #64748b; margin-top: 8px; font-weight: 500;">#${inv.Number || inv.number || 'N/A'}</div>
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
                            <div style="font-size: 18px; font-weight: 600; color: #0f172a;">${inv.client || 'Unknown'}</div>
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
                </div>
            `;
        });

        htmlContent += `
                </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
            setLoading(false);
        }, 500);
    }

    return (
        <div className="max-w-6xl w-full mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-colors duration-200">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reports & Downloads</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Bulk export and download your generated invoices.</p>
                </div>
                <button 
                    onClick={handleBulkPrint}
                    disabled={loading || invoicesToDownload.length === 0}
                    className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-150 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    {loading ? 'Processing...' : `Download ${invoicesToDownload.length} Invoices as PDF`}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 items-center justify-between transition-colors">
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Filter Invoices for Download</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select how many recent invoices you want to include in the bulk export.</p>
                </div>
                <div className="sm:w-64">
                    <select 
                        value={downloadLimit}
                        onChange={(e) => setDownloadLimit(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                        <option value="all">All Invoices ({invoices.length})</option>
                        <option value="10">Last 10 Invoices</option>
                        <option value="50">Last 50 Invoices</option>
                        <option value="100">Last 100 Invoices</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 mt-6 transition-colors duration-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 transition-colors">
                            <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoice #</th>
                            <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client</th>
                            <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
                        {paginatedInvoices.length > 0 ? (
                            paginatedInvoices.map((inv, idx) => (
                                <tr key={inv._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="py-4 px-5 text-sm font-semibold text-slate-800 dark:text-slate-200">#{inv.Number || inv.number}</td>
                                    <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400">{inv.client}</td>
                                    <td className="py-4 px-5 text-sm text-slate-600 dark:text-slate-400">{inv.Date ? new Date(inv.Date).toLocaleDateString() : 'N/A'}</td>
                                    <td className="py-4 px-5 text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            inv.status === 'final' ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400'
                                        }`}>
                                            {inv.status ? inv.status.charAt(0).toUpperCase() + inv.status.slice(1) : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 text-sm font-semibold text-slate-900 dark:text-white text-right">${inv.total}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No invoices available.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                currentPage={currentPage}
                totalItems={invoicesToDownload.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
            />
        </div>
    )
}

export default Reports
