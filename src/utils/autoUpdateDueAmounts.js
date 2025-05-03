import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../components/firebase';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export const autoUpdateDueAmounts = async () => {
  const customersRef = collection(db, 'customers');
  const snapshot = await getDocs(customersRef);
  const today = dayjs();
  let updatedCount = 0;

  for (const customerDoc of snapshot.docs) {
    const data = customerDoc.data();
    const lastDue = data.lastDueDate ? dayjs(data.lastDueDate) : today.startOf('month');
    const monthsPassed = today.diff(lastDue, 'month');

    if (monthsPassed > 0 && data.plan) {
      const newDueAmount = (data.dueAmount || 0) + data.plan * monthsPassed;

      await updateDoc(doc(db, 'customers', customerDoc.id), {
        dueAmount: newDueAmount,
        lastDueDate: today.startOf('month').toISOString(),
        status: 'Due'
      });

      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    toast.success(`${updatedCount} customers updated with new dues`, {
      position: 'top-right',
      autoClose: 4000,
    });
  }
};
