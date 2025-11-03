import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

export const StatsCard = ({ title, value, change, icon: Icon, trend = 'up' }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change !== undefined && (
        <div className={`px-5 py-3 ${trend === 'up' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="text-sm">
            <span className={`inline-flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? (
                <ArrowUpIcon className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center" />
              ) : (
                <ArrowDownIcon className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center" />
              )}
              {change}%
            </span>
            <span className="ml-2 text-gray-500">vs last period</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
