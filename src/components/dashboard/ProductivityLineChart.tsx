import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ProductivityLineChartProps {
  data: { date: string; completed: number }[];
}

const ProductivityLineChart: React.FC<ProductivityLineChartProps> = ({ data }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#666666" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#666666" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="date" stroke="#aaaaaa" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#aaaaaa" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1b1b1b',
              borderColor: '#2a2a2a',
              borderRadius: '12px',
            }}
            labelStyle={{ color: '#ffffff' }}
          />
          <Area type="monotone" dataKey="completed" stroke="#aaaaaa" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductivityLineChart;
