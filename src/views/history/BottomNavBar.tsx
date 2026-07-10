import React from 'react';

interface BottomNavBarProps {
  activeTab: 'history' | 'profile';
  setActiveTab: (tab: 'history' | 'profile') => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-xs w-[calc(100%-2rem)] bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-pink-100/50 p-2.5 flex gap-1.5 z-40 relative">
      {/* Sliding background indicator pill */}
      <div
        className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-0.5625rem)] bg-pink-500 rounded-full transition-all duration-300 ease-out shadow-sm"
        style={{
          transform: activeTab === 'profile' ? 'translateX(calc(100% + 6px))' : 'translateX(0)',
        }}
      />

      <button
        onClick={() => setActiveTab('history')}
        className={`flex-1 py-3 rounded-full  text-sm transition-colors duration-300 flex items-center justify-center gap-1.5 cursor-pointer relative z-10 ${
          activeTab === 'history'
            ? 'text-white'
            : 'text-gray-500 hover:text-pink-500'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        ประวัติการกิน
      </button>
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex-1 py-3 rounded-full  text-sm transition-colors duration-300 flex items-center justify-center gap-1.5 cursor-pointer relative z-10 ${
          activeTab === 'profile'
            ? 'text-white'
            : 'text-gray-500 hover:text-pink-500'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        ข้อมูลสุขภาพ
      </button>
    </div>
  );
};
