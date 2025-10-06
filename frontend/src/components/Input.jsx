import React from 'react';

const Input = ({
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
  );
};

export default Input;
