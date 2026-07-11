import React, { useState, useEffect } from 'react';
import type { FoodLog } from '../../types/food-log';
import { TimeframeFilter } from './TimeframeFilter';
import { CalorieStatsCard } from './CalorieStatsCard';
import { WeeklyBarChart } from './WeeklyBarChart';
import { NutrientsBreakdown } from './NutrientsBreakdown';
import { DateSelector } from './DateSelector';

const getLocalDateStr = (isoString: string): string => {
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface MealLogsTabProps {
  profile: any;
  name: string;
  logs: FoodLog[];
  dailyCalorieGoal: number;
  goal: 'lose' | 'maintain' | 'gain';
}

export const MealLogsTab: React.FC<MealLogsTabProps> = ({
  profile,
  name,
  logs,
  dailyCalorieGoal,
  goal,
}) => {
  const [timeframe, setTimeframe] = useState<'daily' | '7days' | '30days'>('daily');
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({});

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const sevenDaysAgoStart = new Date(todayStart);
  sevenDaysAgoStart.setDate(todayStart.getDate() - 6);

  const thirtyDaysAgoStart = new Date(todayStart);
  thirtyDaysAgoStart.setDate(todayStart.getDate() - 29);

  // Filter logs based on active timeframe
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.loggedAt);
    if (timeframe === 'daily') {
      const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
      const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59, 999);
      return logDate >= startOfDay && logDate <= endOfDay;
    } else if (timeframe === '7days') {
      return logDate >= sevenDaysAgoStart;
    } else {
      return logDate >= thirtyDaysAgoStart;
    }
  });

  // Group filtered logs by date (in user's local timezone)
  const groupedLogs = filteredLogs.reduce((groups: { [key: string]: FoodLog[] }, log) => {
    const dateStr = getLocalDateStr(log.loggedAt);
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(log);
    return groups;
  }, {});

  // Sort dates descending
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => b.localeCompare(a));

  // Expand the first day by default when sortedDates change
  useEffect(() => {
    if (sortedDates.length > 0) {
      setExpandedDays((prev) => ({
        [sortedDates[0]]: true,
        ...prev,
      }));
    }
  }, [timeframe, selectedDate, logs]);

  const toggleDay = (dateStr: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr],
    }));
  };



  // Calorie calculations
  const totalConsumed = Math.round(filteredLogs.reduce((sum, log) => sum + log.calories, 0));
  const totalGoal = timeframe === 'daily' ? dailyCalorieGoal :
    timeframe === '7days' ? dailyCalorieGoal * 7 :
      dailyCalorieGoal * 30;

  const excess = totalConsumed > totalGoal ? totalConsumed - totalGoal : 0;
  const deficit = totalConsumed < totalGoal ? totalGoal - totalConsumed : 0;

  // Nutrient calculations
  const totalProtein = Math.round(filteredLogs.reduce((sum, log) => sum + log.protein, 0));
  const totalCarbs = Math.round(filteredLogs.reduce((sum, log) => sum + log.carbs, 0));
  const totalFat = Math.round(filteredLogs.reduce((sum, log) => sum + log.fat, 0));

  const getLast7DaysData = () => {
    const data = [];
    const weekdays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    // Group all logs by local date
    const allGroupedLogs = logs.reduce((groups: { [key: string]: FoodLog[] }, log) => {
      const dateStr = getLocalDateStr(log.loggedAt);
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(log);
      return groups;
    }, {});

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      // Format to YYYY-MM-DD in local time
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLogs = allGroupedLogs[dateStr] || [];
      const calories = dayLogs.reduce((sum, log) => sum + log.calories, 0);
      data.push({
        label: weekdays[d.getDay()],
        calories: Math.round(calories),
        dateStr
      });
    }
    return data;
  };

  const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('th-TH', options);

    if (isToday) return `วันนี้ (${formattedDate})`;
    if (isYesterday) return `เมื่อวานนี้ (${formattedDate})`;
    return formattedDate;
  };

  return (
    <div className="space-y-5 animate-fade-in pb-16">
      {/* Profile Card */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {profile?.pictureUrl ? (
          <img src={profile.pictureUrl} alt="profile" className="w-14 h-14 rounded-full border border-gray-200" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-500  text-lg">
            {name.charAt(0) || 'U'}
          </div>
        )}
        <div>
          <h1 className="text-xl  text-gray-800">ประวัติการกิน</h1>
          <p className="text-sm text-gray-500">คุณ {name || profile?.displayName || 'ผู้ใช้งาน'}</p>
        </div>
      </div>

      {/* Timeframe Filter Switcher */}
      <TimeframeFilter timeframe={timeframe} setTimeframe={setTimeframe} />

      {/* Date Navigation Picker (only for daily view) */}
      {timeframe === 'daily' && (
        <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />
      )}

      {/* Calorie Stats Card */}
      <CalorieStatsCard
        timeframe={timeframe}
        totalGoal={totalGoal}
        totalConsumed={totalConsumed}
        deficit={deficit}
        excess={excess}
      />

      {/* Last 7 Days Vertical Bar Chart */}
      {(timeframe === '7days' || timeframe === '30days') && (
        <WeeklyBarChart
          dailyCalorieGoal={dailyCalorieGoal}
          data={getLast7DaysData()}
        />
      )}

      {/* Macronutrient breakdown */}
      <NutrientsBreakdown
        goal={goal}
        timeframe={timeframe}
        dailyCalorieGoal={dailyCalorieGoal}
        totalProtein={totalProtein}
        totalCarbs={totalCarbs}
        totalFat={totalFat}
      />

      {/* Accordion List for Food Logs */}
      <div className="space-y-4">
        <h3 className="text-sm  text-gray-800 px-0.5">รายการอาหารบันทึกไว้</h3>
        {filteredLogs.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-2xl mb-2 animate-bounce">🍽️</p>
            <p className="text-gray-500 ">ไม่มีประวัติในช่วงเวลานี้ครับ</p>
            <p className="text-xs text-gray-400 mt-1">คุณสามารถส่งรูปภาพอาหารหรือข้อความเพื่อช่วยแชทบอทวิเคราะห์ได้เลย</p>
          </div>
        ) : (
          sortedDates.map((dateStr) => {
            const dayLogs = groupedLogs[dateStr];
            const dayCalories = Math.round(dayLogs.reduce((sum, log) => sum + log.calories, 0));
            const isOverGoal = dayCalories > dailyCalorieGoal;

            return (
              <div key={dateStr} className="bg-white rounded-xl p-4 border border-pink-100/60 shadow-sm space-y-3.5 transition-all duration-300">
                {/* Summary Header */}
                <div
                  onClick={() => toggleDay(dateStr)}
                  className="flex justify-between items-start cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <h3 className=" text-gray-800 text-base">{formatDateLabel(dateStr)}</h3>
                    <p className="text-xs text-gray-500">
                      แคลอรี: <span className={isOverGoal ? 'text-rose-600 font-black' : 'text-pink-600'}>{dayCalories.toLocaleString()}</span> / {dailyCalorieGoal.toLocaleString()} kcal
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${isOverGoal ? 'bg-rose-500 animate-pulse' : 'bg-pink-500'}`} />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="3"
                      stroke="currentColor"
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expandedDays[dateStr] ? 'rotate-180' : ''
                        }`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-pink-50/50 h-2 rounded-full overflow-hidden border border-pink-100/10">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${isOverGoal ? 'bg-gradient-to-r from-rose-500 to-red-600' : 'bg-gradient-to-r from-pink-400 to-pink-500'
                      }`}
                    style={{ width: `${Math.min((dayCalories / dailyCalorieGoal) * 100, 100)}%` }}
                  />
                </div>

                {/* Expanded Food Logs Accordion */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${expandedDays[dateStr]
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-3 pt-3.5 border-t border-pink-50/60 mt-1">
                      {dayLogs.map((log) => (
                        <div key={log.id} className="flex gap-3 bg-pink-50/10 p-3 rounded-xl border border-pink-100/20">
                          {log.imageUrl ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-pink-100/40">
                              <img src={log.imageUrl} alt={log.foodName} className="w-full h-full object-cover" />
                            </div>
                          ) :
                            (
                              <div className="w-16 h-16 flex text-center items-center justify-center bg-gray-100 text-gray-400 text-xs rounded-xl">
                                ไม่มีรูปภาพ
                              </div>
                            )}
                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="text-sm  text-gray-800 leading-tight">{log.foodName}</h4>
                              <span className="text-[9px] font-semibold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100 flex-shrink-0">
                                {new Date(log.loggedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]  mt-1.5">
                              <div className="bg-orange-50/60 p-1 rounded-lg">
                                <p className="text-sm text-orange-600">{Math.round(log.calories)}</p>
                                <p className="text-sm text-gray-400 ">แคล</p>
                              </div>
                              <div className="bg-red-50/60 p-1 rounded-lg">
                                <p className="text-sm text-red-600">{log.protein}</p>
                                <p className="text-sm text-gray-400 ">โปรตีน</p>
                              </div>
                              <div className="bg-yellow-50/60 p-1 rounded-lg">
                                <p className="text-sm text-yellow-600">{log.fat}</p>
                                <p className="text-sm text-gray-400 ">ไขมัน</p>
                              </div>
                              <div className="bg-green-50/60 p-1 rounded-lg">
                                <p className="text-sm text-green-600">{log.carbs}</p>
                                <p className="text-sm text-gray-400 ">คาร์บ</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
