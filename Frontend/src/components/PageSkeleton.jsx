import React from 'react';
import Skeleton from './Skeleton';

/**
 * Premium PageSkeleton loader representing a generic dashboard / list page.
 * Used as a fallback during lazy page loads.
 */
const PageSkeleton = () => {
    return (
        <div className="max-w-5xl w-full mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Skeleton variant="text" width="150px" className="h-6" />
                    <Skeleton variant="text" width="250px" className="h-3 mt-2" />
                </div>
                <Skeleton variant="rounded" width="120px" className="h-10" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Skeleton variant="rounded" className="flex-1 h-10" />
                <Skeleton variant="rounded" width="160px" className="h-10" />
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100 animate-pulse">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="py-3.5 px-5"><Skeleton variant="text" width="40%" className="h-3" /></th>
                            <th className="py-3.5 px-5"><Skeleton variant="text" width="60%" className="h-3" /></th>
                            <th className="py-3.5 px-5"><Skeleton variant="text" width="50%" className="h-3" /></th>
                            <th className="py-3.5 px-5"><Skeleton variant="text" width="80%" className="h-3" /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[...Array(5)].map((_, i) => (
                            <tr key={i}>
                                <td className="py-4 px-5"><Skeleton variant="text" width="50%" className="h-4" /></td>
                                <td className="py-4 px-5"><Skeleton variant="text" width="70%" className="h-4" /></td>
                                <td className="py-4 px-5"><Skeleton variant="text" width="40%" className="h-4" /></td>
                                <td className="py-4 px-5"><Skeleton variant="text" width="80%" className="h-4" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PageSkeleton;
