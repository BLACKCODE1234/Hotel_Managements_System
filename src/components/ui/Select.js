import React from 'react';
import { classNames } from '../../utils/classNames';

const Select = ({
  options = [],
  value,
  onChange,
  className = '',
  placeholder = 'Select an option',
  ...props
}) => {
  return (
    <select
      className={classNames(
        'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
        'bg-white border text-gray-700 py-2 px-3',
        className
      )}
      value={value}
      onChange={onChange}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
