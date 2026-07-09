import React, { useState } from 'react';
import { GindeeLogo } from '../components/GindeeLogo';
import { calculateAge, calculateBmi, calculateCalories } from '../utils/calculations';
import runningTreadmillImg from '../assets/running_treadmill.png';

interface ProfileWizardViewProps {
  name: string;
  setName: (val: string) => void;
  birthday: string;
  setBirthday: (val: string) => void;
  gender: 'MALE' | 'FEMALE';
  setGender: (val: 'MALE' | 'FEMALE') => void;
  age: number | '';
  setAge: (val: number | '') => void;
  weight: number | '';
  setWeight: (val: number | '') => void;
  height: number | '';
  setHeight: (val: number | '') => void;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'heavy' | 'super';
  setActivityLevel: (val: 'sedentary' | 'light' | 'moderate' | 'heavy' | 'super') => void;
  goal: 'lose' | 'maintain' | 'gain';
  setGoal: (val: 'lose' | 'maintain' | 'gain') => void;
  targetWeight: number | '';
  setTargetWeight: (val: number | '') => void;
  navigateTo: (path: string) => void;
  onSubmit: () => void;
}

export const ProfileWizardView: React.FC<ProfileWizardViewProps> = ({
  name,
  setName,
  birthday,
  setBirthday,
  gender,
  setGender,
  age,
  setAge,
  weight,
  setWeight,
  height,
  setHeight,
  activityLevel,
  setActivityLevel,
  goal,
  setGoal,
  targetWeight,
  setTargetWeight,
  navigateTo,
  onSubmit,
}) => {
  const [step, setStep] = useState(1);

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBirthday(val);
    if (val) {
      const computedAge = calculateAge(val);
      setAge(computedAge);
    }
  };

  const activeBmiInfo = calculateBmi(weight, height);
  const calorieGoal = calculateCalories(weight, height, age, gender, activityLevel, goal);

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      {/* Header Bar */}
      <div className="bg-[#fbc02d] px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <button
          onClick={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              navigateTo('/');
            }
          }}
          className="w-9 h-9 rounded-full bg-[#0066FF] flex items-center justify-center text-white hover:bg-blue-700 transition"
          aria-label="ย้อนกลับ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        <GindeeLogo />

        <div className="w-9 h-9" /> {/* Spacer */}
      </div>

      {/* Wizard Form Content */}
      <div className="flex-1 p-4 max-w-md mx-auto w-full flex flex-col justify-start">
        
        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col flex-1">
          
          {/* Step Indicators */}
          {step < 6 && (
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      s === step ? 'w-8 bg-[#0066FF]' : s < step ? 'w-2 bg-[#0066FF]/40' : 'w-2 bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#0066FF]">ขั้นตอน {step} จาก 5</span>
            </div>
          )}

          {/* Step Content */}
          <div className="flex-1 flex flex-col">
            
            {/* STEP 1: General Info */}
            {step === 1 && (
              <div className="space-y-5 flex-1 flex flex-col animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">ระบุข้อมูลของคุณ</h2>
                  <p className="text-sm text-gray-500">กรอกข้อมูลส่วนตัวทั่วไปเพื่อใช้ตั้งค่าเริ่มต้น</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อเรียก</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="กรอกชื่อของคุณ"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF] text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">วันเกิด</label>
                    <input
                      type="date"
                      value={birthday}
                      onChange={handleBirthdayChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF] text-gray-800"
                    />
                  </div>

                  {age !== '' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">อายุ (ปี)</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="กรอกอายุของคุณ"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF] text-gray-800 bg-gray-50"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">เพศสภาพ</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGender('MALE')}
                        className={`py-3 rounded-xl border text-center font-medium transition ${
                          gender === 'MALE'
                            ? 'border-2 border-[#0066FF] bg-blue-50 text-[#0066FF]'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        เพศชาย
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('FEMALE')}
                        className={`py-3 rounded-xl border text-center font-medium transition ${
                          gender === 'FEMALE'
                            ? 'border-2 border-[#0066FF] bg-blue-50 text-[#0066FF]'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        เพศหญิง
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!name.trim()) return alert('กรุณากรอกชื่อเรียก');
                    if (age === '' || Number(age) <= 0) return alert('กรุณาระบุวันเกิดหรือกรอกอายุที่ถูกต้อง');
                    setStep(2);
                  }}
                  className="w-full py-4 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold transition shadow-sm mt-auto"
                >
                  ต่อไป
                </button>
              </div>
            )}

            {/* STEP 2: Weight, Height, BMI */}
            {step === 2 && (
              <div className="space-y-5 flex-1 flex flex-col animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">น้ำหนักและส่วนสูง</h2>
                  <p className="text-sm text-gray-500">ระบุน้ำหนักให้กินดีปรับค่าทางโภชนาการให้เหมาะกับความต้องการของคุณ</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">ส่วนสูง (ซม.)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="เช่น 165"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF] text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">น้ำหนัก (กก.)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="เช่น 55"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF] text-gray-800"
                      />
                    </div>
                  </div>

                  {activeBmiInfo && (
                    <div className={`p-4 rounded-xl border ${activeBmiInfo.color} flex flex-col items-center justify-center transition-all duration-300 mt-4`}>
                      <p className="text-xs font-semibold uppercase tracking-wider opacity-85">ดัชนีมวลกาย (BMI)</p>
                      <p className="text-3xl font-black mt-1">{activeBmiInfo.bmi}</p>
                      <p className="text-sm font-bold mt-1 text-center">{activeBmiInfo.label}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (!weight || Number(weight) <= 0) return alert('กรุณาระบุน้ำหนักที่ถูกต้อง');
                    if (!height || Number(height) <= 0) return alert('กรุณาระบุส่วนสูงที่ถูกต้อง');
                    setStep(3);
                  }}
                  className="w-full py-4 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold transition shadow-sm mt-auto"
                >
                  ต่อไป
                </button>
              </div>
            )}

            {/* STEP 3: Lifestyle */}
            {step === 3 && (
              <div className="space-y-5 flex-1 flex flex-col animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">คุณมีไลฟ์สไตล์แบบใด</h2>
                  <p className="text-sm text-gray-500">ระบุความเคลื่อนไหวของคุณให้กินดีปรับค่าทางโภชนาการให้เหมาะกับความต้องการของคุณ</p>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {[
                    { key: 'sedentary', title: 'นั่งอยู่กับที่', desc: 'นั่งทำงานเกือบทั้งวัน แทบไม่ได้ออกกำลังกายเลย' },
                    { key: 'light', title: 'เคลื่อนไหวเล็กน้อย', desc: 'ทำงานเดินบ้าง ออกกำลังกายเบาๆ 1-3 วันต่อสัปดาห์' },
                    { key: 'moderate', title: 'เคลื่อนไหวปานกลาง', desc: 'ออกกำลังกายปานกลางหรือเล่นกีฬา 3-5 วันต่อสัปดาห์' },
                    { key: 'heavy', title: 'เคลื่อนไหวเยอะมาก', desc: 'ออกกำลังกายหนักหรือเล่นกีฬาหนัก 6-7 วันต่อสัปดาห์' },
                    { key: 'super', title: 'เคลื่อนไหวหนักมาก', desc: 'ออกกำลังกายหนักมากทุกวัน หรือทำงานใช้แรงงานเยอะ' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setActivityLevel(item.key as any)}
                      className={`w-full p-4 rounded-2xl border text-left transition flex flex-col gap-1 ${
                        activityLevel === item.key
                          ? 'border-2 border-[#0066FF] bg-blue-50/50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`font-bold ${activityLevel === item.key ? 'text-[#0066FF]' : 'text-gray-800'}`}>
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500 leading-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(4)}
                  className="w-full py-4 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold transition shadow-sm mt-4"
                >
                  ต่อไป
                </button>
              </div>
            )}

            {/* STEP 4: Goal */}
            {step === 4 && (
              <div className="space-y-5 flex-1 flex flex-col animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">ระบุเป้าหมายของคุณ</h2>
                  <p className="text-sm text-gray-500">ระบุเป้าหมายของคุณให้กินดีปรับค่าทางโภชนาการให้เหมาะกับความต้องการของคุณ</p>
                </div>

                <div className="space-y-3 flex-1">
                  {[
                    { key: 'lose', title: 'ลดน้ำหนัก', desc: 'ค่อยๆ ลดอย่างถูกวิธี ลดปริมาณแคลอรีเพื่อลดไขมันสะสม' },
                    { key: 'maintain', title: 'รักษาน้ำหนัก', desc: 'ควบคุมน้ำหนักให้อยู่ในเกณฑ์เดิม รักษามวลกล้ามเนื้อและความสมดุล' },
                    { key: 'gain', title: 'เพิ่มน้ำหนัก / เพิ่มกล้ามเนื้อ', desc: 'เพิ่มปริมาณสารอาหารและแคลอรีเพื่อเพิ่มน้ำหนักตัว' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setGoal(item.key as any)}
                      className={`w-full p-4 rounded-2xl border text-left transition flex flex-col gap-1 ${
                        goal === item.key
                          ? 'border-2 border-[#0066FF] bg-blue-50/50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`font-bold ${goal === item.key ? 'text-[#0066FF]' : 'text-gray-800'}`}>
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500 leading-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(5)}
                  className="w-full py-4 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold transition shadow-sm mt-auto"
                >
                  ต่อไป
                </button>
              </div>
            )}

            {/* STEP 5: Target Weight */}
            {step === 5 && (
              <div className="space-y-5 flex-1 flex flex-col animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">ตั้งน้ำหนักเป้าหมาย</h2>
                  <p className="text-sm text-gray-500">ระบุน้ำหนักให้กินดีปรับค่าทางโภชนาการให้เหมาะกับความต้องการของคุณ</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">น้ำหนักเป้าหมาย (กก.)</label>
                    <input
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="เช่น 55"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF] text-gray-800"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!targetWeight || Number(targetWeight) <= 0) return alert('กรุณาระบุน้ำหนักเป้าหมายที่ถูกต้อง');
                    setStep(6);
                  }}
                  className="w-full py-4 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold transition shadow-sm mt-auto"
                >
                  ต่อไป
                </button>
              </div>
            )}

            {/* STEP 6: Summary / Result Page */}
            {step === 6 && (
              <div className="space-y-6 flex-grow flex flex-col items-center text-center justify-between animate-fade-in">
                
                {/* Illustration Image */}
                <div className="w-full max-w-[240px] mx-auto py-2">
                  <img
                    src={runningTreadmillImg}
                    alt="Treadmill Running Illustration"
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Summary Details */}
                <div className="space-y-6 flex-grow flex flex-col justify-center">
                  <div>
                    <h2 className="text-3xl font-extrabold text-[#0066FF] tracking-tight">นี่คือเป้าหมายของคุณ</h2>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">น้ำหนักเป้าหมายของคุณคือ</p>
                    <p className="text-5xl font-black text-[#0066FF]">{targetWeight} kg</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">แคลอรีที่เหมาะสมต่อวัน</p>
                    <p className="text-5xl font-black text-[#0066FF]">{calorieGoal} kCal</p>
                  </div>
                </div>

                {/* Complete Button */}
                <button
                  onClick={onSubmit}
                  className="w-full py-4.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-lg tracking-wide shadow-md transition duration-200 mt-4 cursor-pointer"
                >
                  บันทึกข้อมูลและเริ่มใช้งาน
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
