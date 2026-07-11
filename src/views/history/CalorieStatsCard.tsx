import React from 'react';

interface CalorieStatsCardProps {
  timeframe: 'daily' | '7days' | '30days';
  totalGoal: number;
  totalConsumed: number;
  deficit: number;
  excess: number;
}

export const CalorieStatsCard: React.FC<CalorieStatsCardProps> = ({
  timeframe,
  totalGoal,
  totalConsumed,
  deficit,
  excess,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-800">
          สรุปพลังงานแคลอรี ({timeframe === 'daily' ? 'รายวัน' : timeframe === '7days' ? '7 วันที่ผ่านมา' : '30 วันที่ผ่านมา'})
        </h2>
        <span className="text-xs text-gray-400">เป้าหมาย: {totalGoal.toLocaleString()} kcal</span>
      </div>

      {/* 3 Metric cards grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* 1. บริโภค */}
        <div className="bg-pink-50/40 p-3 rounded-lg border border-pink-100/30 text-center flex flex-col justify-between h-20">
          <span className="text-[10px] text-gray-500 block leading-tight">บริโภคแล้ว</span>
          <span className="text-base text-pink-600 mt-1 block">{totalConsumed.toLocaleString()}</span>
          <span className="text-[9px] text-gray-400 block">kcal</span>
        </div>

        {/* 2. ยังขาด */}
        <div className="bg-green-50/40 p-3 rounded-lg border border-green-100/30 text-center flex flex-col justify-between h-20">
          <span className="text-[10px] text-gray-500 font-medium block leading-tight">ยังขาดอีก</span>
          <span className="text-base text-green-600 mt-1 block">{deficit.toLocaleString()}</span>
          <span className="text-[9px] text-gray-400 block">kcal</span>
        </div>

        {/* 3. เกินเป้า */}
        <div className={`p-3 rounded-lg text-center flex flex-col justify-between h-20 border ${
          excess > 0 ? 'bg-red-50/60 border-red-100/50' : 'bg-gray-50 border-gray-100'
        }`}>
          <span className="text-[10px] text-gray-500 font-medium block leading-tight">เกินเป้าหมาย</span>
          <span className={`text-base mt-1 block ${excess > 0 ? 'text-red-600' : 'text-gray-400'}`}>
            {excess.toLocaleString()}
          </span>
          <span className="text-[9px] text-gray-400 block">kcal</span>
        </div>
      </div>

      {/* Dynamic visual slider progress bar representing these states */}
      <div className="space-y-1.5 pt-1">
        <div className="w-full bg-gray-100 h-2.5 rounded-full flex overflow-hidden border border-gray-50 relative">
          {totalConsumed <= totalGoal ? (
            <>
              {/* Consumed bar */}
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-pink-500 transition-all duration-500 rounded-l-full"
                style={{ width: `${totalGoal > 0 ? (totalConsumed / totalGoal) * 100 : 0}%` }}
              />
              {/* Deficit bar (remains gray/green) */}
              <div
                className="h-full bg-green-200/40 transition-all duration-500"
                style={{ width: `${totalGoal > 0 ? (deficit / totalGoal) * 100 : 0}%` }}
              />
            </>
          ) : (
            <>
              {/* Consumed up to goal */}
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-pink-500 transition-all duration-500 rounded-l-full"
                style={{ width: `${totalConsumed > 0 ? (totalGoal / totalConsumed) * 100 : 0}%` }}
              />
              {/* Excess bar (red) */}
              <div
                className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-500 animate-pulse"
                style={{ width: `${totalConsumed > 0 ? (excess / totalConsumed) * 100 : 0}%` }}
              />
            </>
          )}
        </div>
        <div className="flex justify-between text-[9px] text-gray-400 px-0.5">
          <span>0%</span>
          <span>{totalConsumed > 0 && totalGoal > 0 ? Math.round((totalConsumed / totalGoal) * 100) : 0}%</span>
          <span>{totalConsumed > totalGoal ? '100%+' : '100%'}</span>
        </div>
      </div>
    </div>
  );
};
