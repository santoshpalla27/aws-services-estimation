import React, { useState, useEffect, useRef } from 'react';
import { ServiceType } from '../../types';
import { SERVICE_GROUPS, getServiceDisplayName, getServiceDescription } from '../../utils/serviceMetadata';

interface ServiceCatalogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (service: ServiceType) => void;
}

export const ServiceCatalogModal: React.FC<ServiceCatalogModalProps> = ({ isOpen, onClose, onSelect }) => {
    const [search, setSearch] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setSearch('');
            // Small timeout to allow render before focusing
            setTimeout(() => inputRef.current?.focus(), 50);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Filter logic
    const filteredGroups = Object.entries(SERVICE_GROUPS).reduce((acc, [category, services]) => {
        const filteredServices = services.filter(s => {
            const name = getServiceDisplayName(s).toLowerCase();
            const id = s.toLowerCase();
            const desc = getServiceDescription(s).toLowerCase();
            const term = search.toLowerCase();
            return name.includes(term) || id.includes(term) || desc.includes(term);
        });
        if (filteredServices.length > 0) {
            acc[category] = filteredServices;
        }
        return acc;
    }, {} as Record<string, ServiceType[]>);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-200" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Select a Service</h2>
                        <p className="text-sm text-gray-500 mt-1">Choose a service to configure cost parameters</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                
                {/* Search */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </div>
                        <input 
                            ref={inputRef}
                            type="text" 
                            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-aws-primary focus:border-aws-primary sm:text-sm transition duration-150 ease-in-out shadow-sm"
                            placeholder="Find a service (e.g. EC2, Lambda, Database...)"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {Object.keys(filteredGroups).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-lg font-medium">No services found</p>
                            <p className="text-sm">Try adjusting your search terms</p>
                        </div>
                    ) : (
                        <div className="space-y-8 pb-10">
                            {Object.entries(filteredGroups).map(([category, services]) => (
                                <div key={category}>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 ml-1 flex items-center">
                                        <span className="bg-gray-200 h-px flex-1 mr-3"></span>
                                        {category}
                                        <span className="bg-gray-200 h-px flex-1 ml-3"></span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {services.map(service => (
                                            <button
                                                key={service}
                                                onClick={() => { onSelect(service); onClose(); }}
                                                className="flex items-start p-4 bg-white border border-gray-200 rounded-lg hover:border-aws-primary hover:shadow-md transition-all text-left group relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 left-0 w-1 h-full bg-aws-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200"></div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="font-bold text-gray-900 group-hover:text-aws-primary transition-colors">
                                                            {getServiceDisplayName(service)}
                                                        </div>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-aws-primary">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                        {getServiceDescription(service)}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Footer Tip */}
                <div className="bg-gray-100 px-6 py-3 text-xs text-gray-500 border-t border-gray-200 flex justify-between items-center">
                    <span>Pro Tip: You can search by service name, abbreviation (e.g. "EC2"), or functionality keywords.</span>
                    <button onClick={onClose} className="font-semibold text-gray-700 hover:text-gray-900">Close Esc</button>
                </div>
            </div>
        </div>
    );
};