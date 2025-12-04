import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">{label}</label>}
      <input 
        className={`bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-lg rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none px-4 py-3 placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;