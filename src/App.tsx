import { useEffect, useState } from 'react';
import liff from '@line/liff';

// กำหนด Type ของข้อมูลที่รับมาจาก Backend
interface FoodLog {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  loggedAt: string;
}

function App() {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // 1. เริ่มต้นการทำงานของ LIFF
    const initLiff = async () => {
      try {
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
        
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          fetchHistory(userProfile.userId);
        } else {
          // ถ้าเปิดในเบราว์เซอร์ปกติ จะบังคับให้ล็อกอินผ่าน LINE
          liff.login();
        }
      } catch (error) {
        console.error("LIFF Init Error:", error);
      }
    };

    initLiff();
  }, []);

  // 2. ฟังก์ชันดึงข้อมูลจากหลังบ้าน
  const fetchHistory = async (lineUserId: string) => {
    try {
      // เปลี่ยน URL ตรงนี้เป็น URL ของ ngrok ที่ต่อท้ายด้วย /api/history/...
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/history/${lineUserId}`);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-lg text-gray-600">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* ส่วนหัวแสดงโปรไฟล์ */}
      <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
        {profile?.pictureUrl && (
          <img src={profile.pictureUrl} alt="profile" className="w-12 h-12 rounded-full" />
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-800">ประวัติการกิน</h1>
          <p className="text-sm text-gray-500">คุณ {profile?.displayName}</p>
        </div>
      </div>

      {/* รายการอาหาร (จัด UI เป็น Card ด้วย Tailwind) */}
      <div className="space-y-4">
        {logs.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">ยังไม่มีประวัติการกินครับ 🍽️</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-blue-600">{log.foodName}</h2>
                <span className="text-xs text-gray-400">
                  {new Date(log.loggedAt).toLocaleDateString('th-TH')}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className="bg-orange-50 p-2 rounded-lg">
                  <p className="font-bold text-orange-600">{log.calories}</p>
                  <p className="text-[10px] text-gray-500">แคลอรี</p>
                </div>
                <div className="bg-red-50 p-2 rounded-lg">
                  <p className="font-bold text-red-600">{log.protein}</p>
                  <p className="text-[10px] text-gray-500">โปรตีน</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <p className="font-bold text-yellow-600">{log.fat}</p>
                  <p className="text-[10px] text-gray-500">ไขมัน</p>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <p className="font-bold text-green-600">{log.carbs}</p>
                  <p className="text-[10px] text-gray-500">คาร์บ</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;