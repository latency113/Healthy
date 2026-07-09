import React, { useState, useEffect } from 'react';
import { calculateAge } from '../../utils/calculations';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthday: string;
  setBirthday: (val: string) => void;
  setAge: (val: number | '') => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  birthday,
  setBirthday,
  setAge,
}) => {
  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear() - 25);

  useEffect(() => {
    if (birthday) {
      const parts = birthday.split('-');
      if (parts.length === 3) {
        setPickerYear(parseInt(parts[0], 10));
        setPickerMonth(parseInt(parts[1], 10) - 1);
      }
    }
  }, [birthday]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-2xl max-w-xs w-full space-y-4">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              if (pickerMonth === 0) {
                setPickerMonth(11);
                setPickerYear(pickerYear - 1);
              } else {
                setPickerMonth(pickerMonth - 1);
              }
            }}
            className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-pink-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
            {/* Month Selector */}
            <select
              value={pickerMonth}
              onChange={(e) => setPickerMonth(Number(e.target.value))}
              className="bg-transparent focus:outline-none cursor-pointer text-pink-600 font-extrabold border-b border-dashed border-pink-300 pb-0.5"
            >
              {['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'].map((m, idx) => (
                <option key={idx} value={idx}>{m}</option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={pickerYear}
              onChange={(e) => setPickerYear(Number(e.target.value))}
              className="bg-transparent focus:outline-none cursor-pointer text-pink-600 font-extrabold border-b border-dashed border-pink-300 pb-0.5"
            >
              {Array.from({ length: 100 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return { yr: y, label: `${y + 543}` };
              }).map((y) => (
                <option key={y.yr} value={y.yr}>{y.label}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              if (pickerMonth === 11) {
                setPickerMonth(0);
                setPickerYear(pickerYear + 1);
              } else {
                setPickerMonth(pickerMonth + 1);
              }
            }}
            className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-pink-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Weekdays header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400">
          {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day) => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Spacers */}
          {Array.from({ length: new Date(pickerYear, pickerMonth, 1).getDay() }).map((_, idx) => (
            <div key={`spacer-${idx}`} className="py-2" />
          ))}

          {/* Month Days */}
          {Array.from({ length: new Date(pickerYear, pickerMonth + 1, 0).getDate() }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${pickerYear}-${String(pickerMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = birthday === dateStr;

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => {
                  setBirthday(dateStr);
                  const computedAge = calculateAge(dateStr);
                  setAge(computedAge);
                  onClose();
                }}
                className={`py-2 text-xs font-bold rounded-full transition flex items-center justify-center ${
                  isSelected
                    ? 'bg-pink-500 text-white shadow-md scale-105'
                    : 'hover:bg-pink-50 text-gray-700'
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>

        {/* Modal Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              setBirthday('');
              setAge('');
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-medium text-xs hover:bg-gray-50 transition cursor-pointer"
          >
            ล้างค่า
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-pink-500 text-white font-semibold text-xs hover:bg-pink-600 transition shadow-sm cursor-pointer"
          >
            เสร็จสิ้น
          </button>
        </div>

      </div>
    </div>
  );
};
