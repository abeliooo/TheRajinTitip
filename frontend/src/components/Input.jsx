import React from 'react';

const Input = ({
  label, 
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false, 
}) => {
  return (
    <div>
      {/* Tampilkan label jika ada */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-800 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default Input;