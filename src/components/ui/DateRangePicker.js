import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { classNames } from '../../utils/classNames';
import { Popover } from '@headlessui/react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangePicker = ({
  value = [null, null],
  onChange,
  placeholder = 'Select date range',
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: value[0],
      endDate: value[1],
      key: 'selection',
    },
  ]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setState([{ startDate, endDate, key: 'selection' }]);
    
    if (startDate && endDate) {
      onChange([startDate, endDate]);
      setIsOpen(false);
    }
  };

  const displayValue = () => {
    if (!state[0].startDate || !state[0].endDate) {
      return placeholder;
    }
    return `${format(state[0].startDate, 'MMM d, yyyy')} - ${format(
      state[0].endDate,
      'MMM d, yyyy'
    )}`;
  };

  return (
    <div className={classNames('relative', className)}>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={classNames(
                'flex items-center justify-between w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-left text-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'shadow-sm',
                open ? 'ring-2 ring-blue-500 border-blue-500' : ''
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={classNames('truncate', !state[0].startDate ? 'text-gray-500' : 'text-gray-900')}>
                {displayValue()}
              </span>
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </Popover.Button>

            <Popover.Panel className="absolute z-10 mt-1 w-auto bg-white rounded-md shadow-lg">
              <div className="p-2">
                <DateRange
                  editableDateInputs={true}
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  ranges={state}
                  months={2}
                  direction="horizontal"
                  rangeColors={['#3b82f6']}
                  className="border-0"
                />
                <div className="flex justify-end p-2 border-t border-gray-200">
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setState([{ startDate: null, endDate: null, key: 'selection' }]);
                      onChange([null, null]);
                      setIsOpen(false);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
};

export default DateRangePicker;
