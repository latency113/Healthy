import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { showAlert } from './utils/alert';
import type { FoodLog } from './types/food-log';
import { calculateCalories, calculateAge } from './utils/calculations';
import { HistoryView } from './views/HistoryView';
import { ProfileWizardView } from './views/ProfileWizardView';

function App() {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Custom router state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Profile Wizard Form States
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [age, setAge] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'heavy' | 'super'>('moderate');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [targetWeight, setTargetWeight] = useState<number | ''>('');
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState<number>(2000);

  useEffect(() => {
    // Sync with browser navigation
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
        
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          setName(userProfile.displayName || '');
          await Promise.all([
            fetchHistory(userProfile.userId),
            fetchProfile(userProfile.userId)
          ]);
          setLoading(false);
        } else {
          liff.login();
        }
      } catch (error) {
        console.error("LIFF Init Error:", error);
        // Fallback for local testing
        const mockUserId = 'mock-line-user-id';
        setProfile({ userId: mockUserId, displayName: 'ผู้ทดสอบ' });
        setName('ผู้ทดสอบ');
        await Promise.all([
          fetchHistory(mockUserId),
          fetchProfile(mockUserId)
        ]);
        setLoading(false);
      }
    };

    initLiff();
  }, []);

  const fetchHistory = async (lineUserId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/history/${lineUserId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const fetchProfile = async (lineUserId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile/${lineUserId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const data = await response.json();
      
      const hasProfile = data.success && data.user && data.user.weight && data.user.height;

      if (data.success && data.user) {
        const u = data.user;
        if (u.displayName) setName(u.displayName);
        if (u.gender) setGender(u.gender);
        if (u.weight) setWeight(u.weight);
        if (u.height) setHeight(u.height);
        if (u.birthday) {
          const datePart = u.birthday.split('T')[0];
          setBirthday(datePart);
          const computedAge = calculateAge(datePart);
          setAge(computedAge);
        }
        if (u.dailyCalorieGoal) setDailyCalorieGoal(u.dailyCalorieGoal);
        if (u.goal) setGoal(u.goal);
        if (u.targetWeight) setTargetWeight(u.targetWeight);
        if (u.activityLevel) setActivityLevel(u.activityLevel);
      }

      if (isInitialLoad) {
        if (hasProfile) {
          // If profile is set up and they loaded /submit-user-profile, auto-redirect to /
          if (window.location.pathname === '/submit-user-profile') {
            navigateTo('/');
          }
        } else {
          // If profile is not set up and they loaded /, auto-redirect to /submit-user-profile
          if (window.location.pathname === '/') {
            navigateTo('/submit-user-profile');
          }
        }
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  const navigateTo = (newPath: string) => {
    window.history.pushState({}, "", newPath);
    setCurrentPath(newPath);
  };

  const handleSubmitProfile = async () => {
    setLoading(true);
    const calculatedCalorie = calculateCalories(weight, height, age, gender, activityLevel, goal);
    const payload = {
      lineUserId: profile?.userId || 'mock-line-user-id',
      displayName: name || profile?.displayName || 'ผู้ใช้งาน',
      gender,
      weight,
      height,
      birthday,
      dailyCalorieGoal: calculatedCalorie,
      goal,
      targetWeight,
      activityLevel
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submit-user-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        if (profile?.userId) {
          fetchHistory(profile.userId);
        }
        navigateTo('/');
      } else {
        showAlert('error', 'เกิดข้อผิดพลาด', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (err) {
      console.error(err);
      showAlert('error', 'เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-lg text-gray-600">กำลังโหลดข้อมูล...</div>;
  }

  if (currentPath === '/submit-user-profile') {
    return (
      <ProfileWizardView
        name={name}
        setName={setName}
        birthday={birthday}
        setBirthday={setBirthday}
        gender={gender}
        setGender={setGender}
        age={age}
        setAge={setAge}
        weight={weight}
        setWeight={setWeight}
        height={height}
        setHeight={setHeight}
        activityLevel={activityLevel}
        setActivityLevel={setActivityLevel}
        goal={goal}
        setGoal={setGoal}
        targetWeight={targetWeight}
        setTargetWeight={setTargetWeight}
        navigateTo={navigateTo}
        onSubmit={handleSubmitProfile}
      />
    );
  }

  return (
    <HistoryView
      profile={profile}
      logs={logs}
      name={name}
      dailyCalorieGoal={dailyCalorieGoal}
      navigateTo={navigateTo}
      weight={weight}
      height={height}
      age={age}
      gender={gender}
      targetWeight={targetWeight}
      goal={goal}
      activityLevel={activityLevel}
    />
  );
}

export default App;