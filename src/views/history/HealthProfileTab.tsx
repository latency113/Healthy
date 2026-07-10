import React from 'react';
import { calculateBmi } from '../../utils/calculations';

interface HealthProfileTabProps {
  profile: any;
  name: string;
  weight: number | '';
  height: number | '';
  age: number | '';
  gender: 'MALE' | 'FEMALE';
  goal: 'lose' | 'maintain' | 'gain';
  targetWeight: number | '';
  activityLevel: string;
  dailyCalorieGoal: number;
  navigateTo: (path: string) => void;
}

export const HealthProfileTab: React.FC<HealthProfileTabProps> = ({
  profile,
  name,
  weight,
  height,
  age,
  gender,
  goal,
  targetWeight,
  activityLevel,
  dailyCalorieGoal,
  navigateTo,
}) => {
  const bmiInfo = calculateBmi(weight, height);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Greeting */}
      <div className="text-center py-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
        {profile?.pictureUrl ? (
          <img src={profile.pictureUrl} alt="profile" className="w-20 h-20 rounded-full mx-auto border-2 border-pink-100 shadow-sm" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-pink-50 border-2 border-pink-100 flex items-center justify-center text-pink-500 font-extrabold text-2xl mx-auto">
            {name.charAt(0) || 'U'}
          </div>
        )}
        <div>
          <h3 className="text-lg  text-gray-800">คุณ {name || 'ผู้ใช้งาน'}</h3>
          <p className="text-xs text-gray-400 font-medium">สุขภาพดีเริ่มต้นที่การกิน 🥗</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-24">
          <span className="text-xs text-gray-400 ">น้ำหนักตัว</span>
          <p className="text-2xl font-semibold text-pink-500">{weight || '-'} <span className="text-xs text-gray-400 ">กก.</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-24">
          <span className="text-xs text-gray-400 ">ส่วนสูง</span>
          <p className="text-2xl font-semibold text-pink-500">{height || '-'} <span className="text-xs text-gray-400 ">ซม.</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-24">
          <span className="text-xs text-gray-400 ">อายุ</span>
          <p className="text-2xl font-semibold text-pink-500">{age || '-'} <span className="text-xs text-gray-400 ">ปี</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-24">
          <span className="text-xs text-gray-400 ">เพศ</span>
          <p className="text-2xl font-semibold text-pink-500">
            {gender === 'MALE' ? 'ชาย' : 'หญิง'}
          </p>
        </div>
      </div>

      {/* BMI Section */}
      {bmiInfo && (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-semibold">ดัชนีมวลกาย (BMI)</span>
            <span className="text-sm font-black text-gray-700">{bmiInfo.bmi}</span>
          </div>
          <div className={`p-4 rounded-xl border ${bmiInfo.color} text-center  text-sm`}>
            {bmiInfo.label}
          </div>
          
          {/* Visual Scale bar */}
          <div className="space-y-1.5 pt-2">
            <div className="h-2 w-full rounded-full bg-gray-100 flex overflow-hidden border border-gray-50">
              <div className="h-full w-[18.5%]" style={{ backgroundColor: '#facc15' }} title="ผอม" />
              <div className="h-full w-[4.5%]" style={{ backgroundColor: '#4ade80' }} title="ปกติ" />
              <div className="h-full w-[2%]" style={{ backgroundColor: '#fb923c' }} title="เริ่มอ้วน" />
              <div className="h-full w-[5%]" style={{ backgroundColor: '#f87171' }} title="อ้วน" />
              <div className="h-full w-[70%]" style={{ backgroundColor: '#dc2626' }} title="อ้วนมาก" />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400  px-1">
              <span>18.5</span>
              <span>23.0</span>
              <span>25.0</span>
              <span>30.0</span>
            </div>
          </div>
        </div>
      )}

      {/* Goals & Calorie info */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wider text-left">เป้าหมายทางสุขภาพ</h4>
        <div className="space-y-3.5">
          <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
            <span className="text-gray-500 font-medium">เป้าหมาย</span>
            <span className=" text-gray-800">
              {goal === 'lose' ? 'ลดน้ำหนัก 📉' : goal === 'gain' ? 'เพิ่มน้ำหนัก / กล้ามเนื้อ 📈' : 'รักษาน้ำหนัก ⚖️'}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
            <span className="text-gray-500 font-medium">น้ำหนักเป้าหมาย</span>
            <span className=" text-pink-500">{targetWeight || '-'} กก.</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
            <span className="text-gray-500 font-medium">ระดับกิจกรรม</span>
            <span className=" text-gray-800">
              {activityLevel === 'sedentary' ? 'นั่งอยู่กับที่' :
               activityLevel === 'light' ? 'เคลื่อนไหวเล็กน้อย' :
               activityLevel === 'moderate' ? 'เคลื่อนไหวปานกลาง' :
               activityLevel === 'heavy' ? 'เคลื่อนไหวเยอะมาก' : 'เคลื่อนไหวหนักมาก'}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">ความต้องการพลังงานต่อวัน</span>
            <span className=" text-pink-500">{dailyCalorieGoal.toLocaleString()} kcal</span>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={() => navigateTo('/submit-user-profile')}
        className="w-full py-4 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition shadow-md cursor-pointer text-center text-sm"
      >
        แก้ไขข้อมูลสุขภาพและเป้าหมาย
      </button>
    </div>
  );
};
