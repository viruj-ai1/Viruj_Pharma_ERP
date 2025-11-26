
import React, { useState, useMemo } from 'react';
import { VENDORS, MATERIALS } from '../../services/mockData';
import { Vendor } from '../../types';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const VendorCard: React.FC<{ vendor: Vendor; onViewDetails: (id: string) => void }> = ({ vendor, onViewDetails }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div>
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">{vendor.name}</h3>
                <StarRating rating={vendor.rating} />
            </div>
            <p className="text-sm text-gray-500 mt-2">{vendor.contactPerson}</p>
            <p className="text-sm text-gray-600">{vendor.email}</p>
        </div>
        <button
            onClick={() => onViewDetails(vendor.id)}
            className="mt-6 w-full bg-primary-50 text-primary-700 font-semibold py-2 px-4 rounded-lg hover:bg-primary-100 transition duration-200"
        >
            View Performance
        </button>
    </div>
);

interface VendorsViewProps {
    onViewDetails: (vendorId: string) => void;
}

const VendorsView: React.FC<VendorsViewProps> = ({ onViewDetails }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [materialFilter, setMaterialFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('name-asc');

    const filteredAndSortedVendors = useMemo(() => {
        let vendors = VENDORS.filter(vendor =>
            vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (materialFilter !== 'All') {
            vendors = vendors.filter(vendor => vendor.suppliedMaterialIds.includes(materialFilter));
        }

        switch (sortOrder) {
            case 'name-asc':
                vendors.sort((a,b) => a.name.localeCompare(b.name));
                break;
            case 'rating-desc':
                vendors.sort((a,b) => b.rating - a.rating);
                break;
        }

        return vendors;
    }, [searchTerm, materialFilter, sortOrder]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Vendor Management</h1>

            <div className="mb-4 p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                 <input
                    type="text"
                    placeholder="Search by vendor or contact..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                 <div className="flex items-center space-x-4">
                     <div className="flex items-center space-x-2">
                        <label htmlFor="material-filter" className="text-sm font-medium text-gray-600">Material:</label>
                        <select id="material-filter" value={materialFilter} onChange={(e) => setMaterialFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                            <option value="All">All Materials</option>
                            {MATERIALS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                     <div className="flex items-center space-x-2">
                        <label htmlFor="sort-order" className="text-sm font-medium text-gray-600">Sort by:</label>
                        <select id="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                           <option value="name-asc">Name (A-Z)</option>
                           <option value="rating-desc">Rating (High-Low)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedVendors.map(vendor => (
                    <VendorCard key={vendor.id} vendor={vendor} onViewDetails={onViewDetails} />
                ))}
            </div>
             {filteredAndSortedVendors.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">No vendors found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default VendorsView;
