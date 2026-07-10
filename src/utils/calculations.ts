export const calculateAge = (birthDateString: string): number => {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let computedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    computedAge--;
  }
  return computedAge;
};

export const calculateBmi = (weight: number | '', height: number | ''): { bmi: number; label: string; color: string } | null => {
  if (!weight || !height) return null;
  const hM = Number(height) / 100;
  const val = Number(weight) / (hM * hM);
  const bmi = Math.round(val * 10) / 10;
  
  let label = '';
  let color = '';
  if (bmi < 18.5) {
    label = 'น้ำหนักน้อย / ผอม 🥺';
    color = 'text-yellow-600 bg-yellow-50 border-yellow-100';
  } else if (bmi < 23.0) {
    label = 'น้ำหนักปกติ / สุขภาพดี 😄';
    color = 'text-green-600 bg-green-50 border-green-100';
  } else if (bmi < 25.0) {
    label = 'น้ำหนักเกิน / เริ่มอ้วน 😮';
    color = 'text-orange-600 bg-orange-50 border-orange-100';
  } else if (bmi < 30.0) {
    label = 'อ้วนระดับ 1 😰';
    color = 'text-red-500 bg-red-50 border-red-100';
  } else {
    label = 'อ้วนระดับ 2 🚨';
    color = 'text-red-700 bg-red-100 border-red-200';
  }
  return { bmi, label, color };
};

export const calculateCalories = (
  weight: number | '',
  height: number | '',
  age: number | '',
  gender: 'MALE' | 'FEMALE',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'heavy' | 'super',
  goal: 'lose' | 'maintain' | 'gain'
): number => {
  if (!weight || !height || !age) return 2000;
  const wNum = Number(weight);
  const hNum = Number(height);
  const aNum = Number(age);
  
  // Mifflin-St Jeor Equation
  let bmr = 0;
  if (gender === 'MALE') {
    bmr = 10 * wNum + 6.25 * hNum - 5 * aNum + 5;
  } else {
    bmr = 10 * wNum + 6.25 * hNum - 5 * aNum - 161;
  }
  
  let multiplier = 1.2;
  switch (activityLevel) {
    case 'sedentary': multiplier = 1.2; break;
    case 'light': multiplier = 1.375; break;
    case 'moderate': multiplier = 1.55; break;
    case 'heavy': multiplier = 1.725; break;
    case 'super': multiplier = 1.9; break;
  }
  
  let tdee = bmr * multiplier;
  
  let finalCal = tdee;
  if (goal === 'lose') {
    finalCal = tdee - 500;
  } else if (goal === 'gain') {
    finalCal = tdee + 500;
  }
  
  const minSafe = gender === 'MALE' ? 1200 : 1000;
  return Math.max(minSafe, Math.round(finalCal));
};
