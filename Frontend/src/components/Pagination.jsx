import React from 'react';

const Pagination = ({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange, 
    onItemsPerPageChange 
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calculate start and end indices of shown items
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Build array of pages to render
    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 4) {
                pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pageNumbers;
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
            {/* Left Column: Entries info & Dropdown Selector */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                    <span>Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            onItemsPerPageChange(Number(e.target.value));
                            onPageChange(1); // Reset to first page
                        }}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors cursor-pointer"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span>entries</span>
                </div>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
                <span>
                    Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{startItem}</span> to{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{endItem}</span> of{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{totalItems}</span> entries
                </span>
            </div>

            {/* Right Column: Page Numbers Navigation */}
            {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center p-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                            currentPage === 1
                                ? 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed bg-slate-50/50 dark:bg-slate-900/50'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 active:scale-95'
                        }`}
                        title="Previous Page"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {getPageNumbers().map((number, idx) => {
                        if (number === '...') {
                            return (
                                <span key={idx} className="px-2 text-slate-400 dark:text-slate-600 font-medium select-none">
                                    ...
                                </span>
                            );
                        }

                        const isActive = currentPage === number;
                        return (
                            <button
                                key={idx}
                                onClick={() => onPageChange(number)}
                                className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-150 ${
                                    isActive
                                        ? 'bg-indigo-600 border border-indigo-600 text-white shadow-sm shadow-indigo-500/10'
                                        : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 active:scale-95'
                                }`}
                            >
                                {number}
                            </button>
                        );
                    })}

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center p-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                            currentPage === totalPages
                                ? 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed bg-slate-50/50 dark:bg-slate-900/50'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 active:scale-95'
                        }`}
                        title="Next Page"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pagination;
