import { useEffect, useState } from 'react';
import liff from '@line/liff';
import type { FoodLog } from './types/food-log';
import { calculateCalories } from './utils/calculations';
import { HistoryView } from './views/HistoryView';
import { ProfileWizardView } from './views/ProfileWizardView';

function App() {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Custom router state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

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
          fetchHistory(userProfile.userId);
        } else {
          liff.login();
        }
      } catch (error) {
        console.error("LIFF Init Error:", error);
        setLoading(false);
      }
    };

    initLiff();
  }, []);

  const fetchHistory = async (lineUserId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/history/${lineUserId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
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
      dailyCalorieGoal: calculatedCalorie
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submit-user-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        if (profile?.userId) {
          fetchHistory(profile.userId);
        }
        navigateTo('/');
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
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
      navigateTo={navigateTo}
    />
  );
}

export default App;