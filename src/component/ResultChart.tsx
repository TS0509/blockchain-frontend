"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type VoteResult = {
  name: string;
  votes: number;
};

type ResultChartProps = {
  data: VoteResult[];
  colors: string[];
};

export default function ResultChart({ data, colors }: ResultChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-[250px] sm:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          layout={isMobile ? "vertical" : "horizontal"}
          margin={{
            top: 20,
            right: isMobile ? 0 : 20,
            left: isMobile ? 40 : 0,
            bottom: 5
          }}
        >
          {isMobile ? (
            <>
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 10, fill: '#010066' }}
                width={80}
              />
              <XAxis 
                type="number" 
                tick={{ fontSize: 10, fill: '#010066' }}
              />
            </>
          ) : (
            <>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#010066' }}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: 12, fill: '#010066' }}
              />
            </>
          )}
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: '#D4AF37',
              borderRadius: '0.5rem',
              fontSize: '14px',
              padding: '8px'
            }}
          />
          <Bar 
            dataKey="votes" 
            radius={[4, 4, 0, 0]}
            barSize={isMobile ? 20 : 40}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}