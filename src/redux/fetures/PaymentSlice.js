import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const initialState = {
  payments: []
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    addPayment: (state, action) => {
      const { cartNumber, name, plan, paidAmount, date } = action.payload;
      const existingPayment = state.payments.find(p => p.cartNumber === cartNumber);

      if (existingPayment) {
        existingPayment.totalPaidAmount += paidAmount;
        existingPayment.dueAmount = Math.max(0, existingPayment.dueAmount - paidAmount);
        existingPayment.payments.push({ amount: paidAmount, date });
        existingPayment.status = existingPayment.dueAmount > 0 ? "Due" : "Paid";
      } else {
        state.payments.push({
          cartNumber,
          name,
          plan,
          totalPaidAmount: paidAmount,
          dueAmount: plan - paidAmount,
          status: paidAmount >= plan ? "Paid" : "Due",
          payments: [{ amount: paidAmount, date }],
          lastUpdatedMonth: dayjs().format('YYYY-MM')
        });
      }
    },

    updateMonthlyPayments: (state) => {
      const currentMonth = dayjs();

      state.payments.forEach(payment => {
        const lastMonth = dayjs(payment.lastUpdatedMonth);
        const monthDifference = currentMonth.diff(lastMonth, 'month');

        if (monthDifference > 0) {
          payment.dueAmount += payment.plan * monthDifference;
          payment.lastUpdatedMonth = currentMonth.format('YYYY-MM');
          payment.status = payment.dueAmount > 0 ? "Due" : "Paid";
        }
      });
    }
  }
});

export const { addPayment, updateMonthlyPayments } = paymentSlice.actions;
export default paymentSlice.reducer;
