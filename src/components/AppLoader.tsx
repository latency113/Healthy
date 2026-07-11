import React from 'react';

interface AppLoaderProps {
  loading: boolean;
  showLoader: boolean;
  loaderProgress: number;
}

export const AppLoader: React.FC<AppLoaderProps> = ({ loading, showLoader, loaderProgress }) => {
  if (!showLoader) return null;

  return (
    <div className={`fixed inset-0 bg-[#faf5f6] flex flex-col items-center justify-center z-[100] transition-opacity duration-350 ${!loading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="w-full max-w-xs px-6 flex flex-col items-center text-center space-y-6">
        {/* Animated Mealme Logo */}
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-md overflow-hidden animate-bounce">
          <img src="/mealme.png" alt="Mealme Logo" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-2.5 w-full">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Mealme :🥗)</h2>
          <p className="text-xs text-gray-400 font-medium">กำลังเตรียมข้อมูลสุขภาพของคุณ...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="w-full bg-pink-100/60 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="bg-pink-500 h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${loaderProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold px-0.5">
            <span>กำลังโหลด</span>
            <span>{loaderProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
