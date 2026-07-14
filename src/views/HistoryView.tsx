import React, { useState } from 'react';
import type { FoodLog } from '../types/food-log';
import { MealmeLogo } from '../components/MealmeLogo';
import { MealLogsTab } from './history/MealLogsTab';
import { HealthProfileTab } from './history/HealthProfileTab';
import { BottomNavBar } from './history/BottomNavBar';

interface HistoryViewProps {
  profile: any;
  logs: FoodLog[];
  name: string;
  dailyCalorieGoal: number;
  navigateTo: (path: string) => void;
  weight: number | '';
  height: number | '';
  age: number | '';
  gender: 'MALE' | 'FEMALE';
  targetWeight: number | '';
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  profile,
  logs,
  name,
  dailyCalorieGoal,
  navigateTo,
  weight,
  height,
  age,
  gender,
  targetWeight,
  goal,
  activityLevel,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'profile'>('history');

  return (
    <div className="h-screen bg-[#faf5f6] flex flex-col overflow-hidden">
      {/* Pink & White Top Banner */}
      <div className="bg-white border-b border-pink-100 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50 flex-shrink-0">
        <div className="w-9" /> {/* Spacer */}
        <MealmeLogo />
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full pb-24">
        {activeTab === 'history' && (
          <MealLogsTab
            profile={profile}
            name={name}
            logs={logs}
            dailyCalorieGoal={dailyCalorieGoal}
            goal={goal}
          />
        )}

        {activeTab === 'profile' && (
          <HealthProfileTab
            profile={profile}
            name={name}
            weight={weight}
            height={height}
            age={age}
            gender={gender}
            goal={goal}
            targetWeight={targetWeight}
            activityLevel={activityLevel}
            dailyCalorieGoal={dailyCalorieGoal}
            navigateTo={navigateTo}
          />
        )}
      </div>

      {/* Floating Bottom Navigation Bar */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
