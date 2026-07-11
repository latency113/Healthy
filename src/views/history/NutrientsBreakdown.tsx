import React from 'react';

interface NutrientsBreakdownProps {
  goal: 'lose' | 'maintain' | 'gain';
  timeframe: 'daily' | '7days' | '30days';
  dailyCalorieGoal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export const NutrientsBreakdown: React.FC<NutrientsBreakdownProps> = ({
  goal,
  timeframe,
  dailyCalorieGoal,
  totalProtein,
  totalCarbs,
  totalFat,
}) => {
  const proteinCal = totalProtein * 4;
  const carbsCal = totalCarbs * 4;
  const fatCal = totalFat * 9;
  const totalNutrientCal = proteinCal + carbsCal + fatCal;

  const proteinPercent = totalNutrientCal > 0 ? Math.round((proteinCal / totalNutrientCal) * 100) : 0;
  const carbsPercent = totalNutrientCal > 0 ? Math.round((carbsCal / totalNutrientCal) * 100) : 0;
  const fatPercent = totalNutrientCal > 0 ? Math.round((fatCal / totalNutrientCal) * 100) : 0;

  // Macronutrient target ratios based on health goal
  let proteinRatio = 0.20; // default maintain
  let carbsRatio = 0.50;
  let fatRatio = 0.30;

  if (goal === 'lose') {
    proteinRatio = 0.25;
    carbsRatio = 0.45;
    fatRatio = 0.30;
  } else if (goal === 'gain') {
    proteinRatio = 0.25;
    carbsRatio = 0.50;
    fatRatio = 0.25;
  }

  const daysMultiplier = timeframe === 'daily' ? 1 : timeframe === '7days' ? 7 : 30;

  const targetProtein = Math.round(((dailyCalorieGoal * proteinRatio) / 4) * daysMultiplier);
  const targetCarbs = Math.round(((dailyCalorieGoal * carbsRatio) / 4) * daysMultiplier);
  const targetFat = Math.round(((dailyCalorieGoal * fatRatio) / 9) * daysMultiplier);

  const targetProteinPercent = Math.round(proteinRatio * 100);
  const targetCarbsPercent = Math.round(carbsRatio * 100);
  const targetFatPercent = Math.round(fatRatio * 100);

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-800">โภชนาการที่แนะนำต่อวัน</h2>
        <span className="text-[10px] bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full">
          {goal === 'lose' ? 'สูตรลดน้ำหนัก 📉' : goal === 'gain' ? 'สูตรเพิ่มน้ำหนัก 📈' : 'สูตรสมดุล ⚖️'}
        </span>
      </div>
      
      <div className="space-y-4">
        {/* 1. Protein */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-gray-700">โปรตีน (Protein)</span>
            </div>
            <span className="text-gray-500">
              {totalProtein}g <span className="text-gray-400 font-normal">/ {targetProtein.toLocaleString()}g</span>
              <span className="ml-1.5 text-[10px] text-pink-500">
                ({targetProtein > 0 ? Math.round((totalProtein / targetProtein) * 100) : 0}%)
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50">
            <div
              className="bg-red-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${targetProtein > 0 ? Math.min((totalProtein / targetProtein) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

        {/* 2. Carbs */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-gray-700">คาร์บ (Carbs)</span>
            </div>
            <span className="text-gray-500">
              {totalCarbs}g <span className="text-gray-400 font-normal">/ {targetCarbs.toLocaleString()}g</span>
              <span className="ml-1.5 text-[10px] text-pink-500">
                ({targetCarbs > 0 ? Math.round((totalCarbs / targetCarbs) * 100) : 0}%)
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50">
            <div
              className="bg-green-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${targetCarbs > 0 ? Math.min((totalCarbs / targetCarbs) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

        {/* 3. Fat */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="text-gray-700">ไขมัน (Fat)</span>
            </div>
            <span className="text-gray-500">
              {totalFat}g <span className="text-gray-400 font-normal">/ {targetFat.toLocaleString()}g</span>
              <span className="ml-1.5 text-[10px] text-pink-500">
                ({targetFat > 0 ? Math.round((totalFat / targetFat) * 100) : 0}%)
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50">
            <div
              className="bg-yellow-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${targetFat > 0 ? Math.min((totalFat / targetFat) * 100, 100) : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stacked Ratio Bars Comparison */}
      <div className="pt-2 border-t border-gray-50 space-y-3.5">
        {/* Actual ratios */}
        <div className="space-y-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block text-left">สัดส่วนที่กินจริง</span>
          {totalNutrientCal > 0 ? (
            <div>
              <div className="w-full h-3 rounded-full flex overflow-hidden">
                <div className="bg-red-400 h-full" style={{ width: `${(proteinCal / totalNutrientCal) * 100}%` }} />
                <div className="bg-green-400 h-full" style={{ width: `${(carbsCal / totalNutrientCal) * 100}%` }} />
                <div className="bg-yellow-400 h-full" style={{ width: `${(fatCal / totalNutrientCal) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[9px] px-1 mt-1">
                <span className="text-red-500">โปรตีน {proteinPercent}%</span>
                <span className="text-green-600">คาร์บ {carbsPercent}%</span>
                <span className="text-yellow-600">ไขมัน {fatPercent}%</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-1 text-center">ยังไม่มีข้อมูลอาหารสะสม</p>
          )}
        </div>

        {/* Recommended ratios */}
        <div className="space-y-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block text-left">สัดส่วนที่แนะนำ</span>
          <div>
            <div className="w-full h-3 rounded-full flex overflow-hidden bg-gray-100">
              <div className="bg-red-400/80 h-full" style={{ width: `${targetProteinPercent}%` }} />
              <div className="bg-green-400/80 h-full" style={{ width: `${targetCarbsPercent}%` }} />
              <div className="bg-yellow-400/80 h-full" style={{ width: `${targetFatPercent}%` }} />
            </div>
            <div className="flex justify-between text-[9px] px-1 mt-1">
              <span className="text-red-500/90">โปรตีน {targetProteinPercent}%</span>
              <span className="text-green-600/90">คาร์บ {targetCarbsPercent}%</span>
              <span className="text-yellow-600/90">ไขมัน {targetFatPercent}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
