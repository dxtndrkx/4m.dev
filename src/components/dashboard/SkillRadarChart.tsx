import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SkillRadarChartProps {
  data: { subject: string; value: number; fullMark: number }[];
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#2a2a2a" />
          <PolarAngleAxis dataKey="subject" stroke="#aaaaaa" fontSize={12} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#2a2a2a" axisLine={false} tick={false} />
          <Radar name="Focus" dataKey="value" stroke="#aaaaaa" fill="#666666" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadarChart;
