import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const LineChartComponent = ({ data, xKey, yKeys, colors, title }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors ? colors[index % colors.length] : `#${Math.floor(Math.random()*16777215).toString(16)}`}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;
