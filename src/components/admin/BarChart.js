import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const BarChartComponent = ({ data, xKey, yKeys, colors, layout = 'vertical', title }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={layout}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {layout === 'vertical' ? (
              <>
                <XAxis type="number" />
                <YAxis dataKey={xKey} type="category" />
              </>
            ) : (
              <>
                <XAxis dataKey={xKey} />
                <YAxis />
              </>
            )}
            <Tooltip />
            <Legend />
            {yKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors ? colors[index % colors.length] : `#${Math.floor(Math.random()*16777215).toString(16)}`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
