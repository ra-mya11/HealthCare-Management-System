import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const ShapChart = ({ featureImportance, shapValues }) => {
  const data = Object.entries(featureImportance).map(([name, value], idx) => ({
    name: name.replace(/_/g, ' '),
    value: value,
    shapValue: shapValues[idx]
  }));

  return (
    <div className="shap-chart">
      <h4>Feature Importance</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4CAF50">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.shapValue > 0 ? '#f44336' : '#4CAF50'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShapChart;
