import React from 'react';
import type { FoodLog } from '../types/food-log';
import { GindeeLogo } from '../components/GindeeLogo';

interface HistoryViewProps {
  profile: any;
  logs: FoodLog[];
  name: string;
  navigateTo: (path: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  profile,
  logs,
  name,
  navigateTo,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Yellow Top Banner */}
      <div className="bg-[#fbc02d] px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="w-9" /> {/* Spacer */}
        <GindeeLogo />
        
        {/* Profile Settings Button */}
        <button
          onClick={() => navigateTo('/submit-user-profile')}
          className="w-9 h-9 rounded-full bg-[#0066FF] flex items-center justify-center text-white hover:bg-blue-700 transition"
          aria-label="ตั้งค่าโปรไฟล์"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.99l1.004.831a1.125 1.125 0 0 1 .26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.37.491l-1.216-.456c-.356-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.83c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        {/* Profile Card */}
        <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          {profile?.pictureUrl ? (
            <img src={profile.pictureUrl} alt="profile" className="w-14 h-14 rounded-full border border-gray-200" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {name.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-800">ประวัติการกิน</h1>
            <p className="text-sm text-gray-500">คุณ {name || profile?.displayName || 'ผู้ใช้งาน'}</p>
          </div>
        </div>

        {/* Meal Logs */}
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center animate-fade-in">
              <p className="text-2xl mb-2 animate-bounce">🍽️</p>
              <p className="text-gray-500 font-medium">ยังไม่มีประวัติการกินครับ</p>
              <p className="text-xs text-gray-400 mt-1">คุณสามารถส่งรูปภาพอาหารหรือส่งข้อความบอกแชทบอทเพื่อบันทึกประวัติที่นี่</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-bold text-gray-800">{log.foodName}</h2>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                    {new Date(log.loggedAt).toLocaleDateString('th-TH')}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center text-sm font-semibold">
                  <div className="bg-orange-50/70 p-2 rounded-xl">
                    <p className="font-extrabold text-orange-600 text-base">{log.calories}</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">แคลอรี</p>
                  </div>
                  <div className="bg-red-50/70 p-2 rounded-xl">
                    <p className="font-extrabold text-red-600 text-base">{log.protein}</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">โปรตีน</p>
                  </div>
                  <div className="bg-yellow-50/70 p-2 rounded-xl">
                    <p className="font-extrabold text-yellow-600 text-base">{log.fat}</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">ไขมัน</p>
                  </div>
                  <div className="bg-green-50/70 p-2 rounded-xl">
                    <p className="font-extrabold text-green-600 text-base">{log.carbs}</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">คาร์บ</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
