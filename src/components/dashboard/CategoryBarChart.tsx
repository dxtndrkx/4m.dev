import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryBarChartProps {
  data: { name: string; time: number }[];
}

const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="name" stroke="#aaaaaa" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#aaaaaa" fontSize={12} tickLine={false} axisLine={false} unit="h" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1b1b1b',
              borderColor: '#2a2a2a',
              borderRadius: '12px',
            }}
            labelStyle={{ color: '#ffffff' }}
            cursor={{ fill: 'rgba(170, 170, 170, 0.1)' }}
          />
          <Bar dataKey="time" fill="#666666" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBarChart;
