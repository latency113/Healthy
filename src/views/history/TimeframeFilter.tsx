import React from 'react';

interface TimeframeFilterProps {
  timeframe: 'daily' | '7days' | '30days';
  setTimeframe: (val: 'daily' | '7days' | '30days') => void;
}

export const TimeframeFilter: React.FC<TimeframeFilterProps> = ({ timeframe, setTimeframe }) => {
  return (
    <div className="bg-white p-1 rounded-xl border border-pink-100 flex gap-1 relative z-10 select-none">
      {/* Sliding background indicator pill */}
      <div
        className="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] bg-pink-500 rounded-lg transition-transform duration-300 ease-out shadow-sm"
        style={{
          transform: timeframe === 'daily' 
            ? 'translateX(0)' 
            : timeframe === '7days' 
              ? 'translateX(calc(100% + 4px))' 
              : 'translateX(calc(200% + 8px))',
        }}
      />

      <button
        onClick={() => setTimeframe('daily')}
        className={`flex-1 py-2 text-xs font-semibold text-center rounded-lg transition-colors duration-300 cursor-pointer relative z-10 ${
          timeframe === 'daily' ? 'text-white font-bold' : 'text-gray-500 hover:text-pink-500'
        }`}
      >
        รายวัน
      </button>
      <button
        onClick={() => setTimeframe('7days')}
        className={`flex-1 py-2 text-xs font-semibold text-center rounded-lg transition-colors duration-300 cursor-pointer relative z-10 ${
          timeframe === '7days' ? 'text-white font-bold' : 'text-gray-500 hover:text-pink-500'
        }`}
      >
        7 วันย้อนหลัง
      </button>
      <button
        onClick={() => setTimeframe('30days')}
        className={`flex-1 py-2 text-xs font-semibold text-center rounded-lg transition-colors duration-300 cursor-pointer relative z-10 ${
          timeframe === '30days' ? 'text-white font-bold' : 'text-gray-500 hover:text-pink-500'
        }`}
      >
        30 วันย้อนหลัง
      </button>
    </div>
  );
};
