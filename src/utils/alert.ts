import Swal from 'sweetalert2';

/**
 * แสดงกล่องข้อความเตือนภัย (SweetAlert2) แบบคุมธีมสีชมพูของแอปพลิเคชัน
 */
export const showAlert = (
  type: 'success' | 'error' | 'warning' | 'info',
  title: string,
  text: string
) => {
  return Swal.fire({
    icon: type,
    title,
    text,
    confirmButtonColor: '#ec4899', // สีชมพูหลักของธีมแอป Gindee
    confirmButtonText: 'ตกลง',
  });
};
