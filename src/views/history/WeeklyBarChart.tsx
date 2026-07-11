import React from 'react';

interface WeeklyBarChartProps {
  dailyCalorieGoal: number;
  data: { label: string; calories: number; dateStr: string }[];
}

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({ dailyCalorieGoal, data }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-800">กราฟพลังงาน 7 วันย้อนหลัง</h2>
        <span className="text-xs text-gray-400 font-semibold">เป้าหมาย: {dailyCalorieGoal.toLocaleString()} kcal / วัน</span>
      </div>

      <div className="h-28 flex items-end justify-between gap-2 pt-2 px-1">
        {data.map((day, idx) => {
          const heightPercent = Math.min((day.calories / dailyCalorieGoal) * 100, 100);
          const isOver = day.calories > dailyCalorieGoal;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-1 bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                {day.calories} kcal
              </div>
              {/* Vertical bar */}
              <div className="w-full bg-gray-50 h-20 rounded-t-md flex items-end overflow-hidden border border-gray-100/50">
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isOver 
                      ? 'bg-gradient-to-t from-red-400 to-red-500 animate-pulse' 
                      : day.calories > 0 
                        ? 'bg-gradient-to-t from-pink-400 to-pink-500' 
                        : 'bg-gray-100'
                  }`}
                  style={{ height: `${day.calories > 0 ? Math.max(heightPercent, 8) : 0}%` }}
                />
              </div>
              {/* Weekday label */}
              <span className="text-[10px] text-gray-400 font-semibold">{day.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
