import React, { InputHTMLAttributes, SelectHTMLAttributes, useState } from 'react';

// --- Tooltip Component ---
export const Tooltip: React.FC<{ content: string }> = ({ content }) => (
  <div className="relative inline-flex ml-1.5 group align-middle">
    <svg className="w-4 h-4 text-gray-400 hover:text-aws-link cursor-help transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-[#1f2937] text-white text-xs rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none leading-relaxed font-normal">
      {content}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1f2937]"></div>
    </div>
  </div>
);

// --- Accordion ---
export const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-200 shadow-card mb-5 rounded-lg overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 bg-white flex justify-between items-center hover:bg-gray-50/80 transition-colors focus:outline-none group"
      >
        <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg text-gray-800 tracking-tight group-hover:text-aws-link transition-colors">{title}</span>
        </div>
        <div className={`p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 ${isOpen ? 'bg-gray-100' : ''}`}>
            <svg 
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </button>
      
      <div 
        className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-6 pt-2 border-t border-gray-100 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Form Primitives ---

export const FormSection: React.FC<{ label: string; info?: string; tooltip?: string; children: React.ReactNode }> = ({ label, info, tooltip, children }) => (
  <div className="mb-6">
    <div className="flex flex-col mb-2.5">
      <div className="flex items-center">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {tooltip && <Tooltip content={tooltip} />}
      </div>
      {info && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{info}</p>}
    </div>
    {children}
  </div>
);

export const AWSInput: React.FC<InputHTMLAttributes<HTMLInputElement> & { label?: string, unit?: string, tooltip?: string }> = ({ label, unit, tooltip, className = "", ...props }) => (
  <div className={`flex flex-col ${className}`}>
    {label && (
        <div className="flex items-center mb-1.5">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {tooltip && <Tooltip content={tooltip} />}
        </div>
    )}
    <div className="relative group">
      <input 
        className="w-full h-10 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md 
        shadow-sm placeholder-gray-400 
        transition-all duration-200 ease-in-out
        hover:border-gray-400
        focus:border-aws-link focus:ring-4 focus:ring-aws-link/20 focus:outline-none 
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
        {...props}
      />
      {unit && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 text-sm font-medium bg-white pl-2">{unit}</span>
        </div>
      )}
    </div>
  </div>
);

export const AWSSelect: React.FC<SelectHTMLAttributes<HTMLSelectElement> & { label?: string, tooltip?: string }> = ({ label, children, tooltip, className = "", ...props }) => (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <div className="flex items-center mb-1.5">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {tooltip && <Tooltip content={tooltip} />}
        </div>
      )}
      <div className="relative">
        <select 
            className="w-full h-10 pl-3 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-md 
            shadow-sm appearance-none cursor-pointer
            transition-all duration-200 ease-in-out
            hover:border-gray-400
            focus:border-aws-link focus:ring-4 focus:ring-aws-link/20 focus:outline-none"
            {...props}
        >
            {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </div>
      </div>
    </div>
  );

export const AWSSlider: React.FC<{ 
  value: number; 
  min: number; 
  max: number; 
  onChange: (val: number) => void; 
  unit: string;
  labels?: string[];
}> = ({ value, min, max, onChange, unit, labels }) => {
  return (
    <div className="w-full py-3">
      <div className="flex justify-between items-end mb-3">
         <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold text-gray-800 tracking-tight">{value}</span>
            <span className="text-sm font-medium text-gray-500">{unit}</span>
         </div>
         <div className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-500">
             Max: {max}
         </div>
      </div>
      <div className="relative h-6 flex items-center">
        <input 
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-aws-primary/50"
        />
      </div>
      <div className="flex justify-between text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wide">
        {labels ? labels.map((l, i) => <span key={i}>{l}</span>) : (
            <>
                <span>{min}</span>
                <span>{Math.floor(max/2)}</span>
                <span>{max}</span>
            </>
        )}
      </div>
    </div>
  );
};

export const AWSToggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string; tooltip?: string }> = ({ checked, onChange, label, tooltip }) => (
    <div className="flex items-center">
        <label className="flex items-center cursor-pointer group p-2 -ml-2 rounded hover:bg-gray-50 transition-colors">
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
                <div className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-200 ease-in-out ${checked ? 'bg-aws-primary' : 'bg-gray-200 group-hover:bg-gray-300'}`}></div>
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700 select-none group-hover:text-gray-900">{label}</span>
        </label>
        {tooltip && <Tooltip content={tooltip} />}
    </div>
);

export const AWSButton: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' | 'link'; onClick?: () => void, className?: string, fullWidth?: boolean }> = ({ children, variant = 'primary', onClick, className = '', fullWidth }) => {
  const baseClass = "px-4 py-2.5 text-sm font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 inline-flex items-center justify-center";
  const variants = {
    primary: "bg-aws-primary text-white hover:bg-aws-primaryHover border border-transparent focus:ring-aws-primary",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-200",
    link: "bg-transparent text-aws-link hover:underline shadow-none px-0 py-0 font-normal focus:ring-0"
  };
  
  return (
    <button className={`${baseClass} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export const PresetCard: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    description: string; 
    active: boolean; 
    onClick: () => void 
}> = ({ title, icon, description, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center p-4 border rounded-xl transition-all duration-200 w-full text-center relative overflow-hidden
        ${active 
            ? 'bg-blue-50/50 border-aws-link shadow-md ring-1 ring-aws-link' 
            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
        }`}
    >
        {active && <div className="absolute top-0 left-0 w-full h-1 bg-aws-link"></div>}
        <div className={`mb-3 p-2 rounded-full ${active ? 'bg-blue-100 text-aws-link' : 'bg-gray-100 text-gray-500'} transition-colors`}>
            {icon}
        </div>
        <span className={`text-sm font-bold mb-1 ${active ? 'text-gray-900' : 'text-gray-700'}`}>{title}</span>
        <span className="text-xs text-gray-500 leading-snug">{description}</span>
    </button>
);