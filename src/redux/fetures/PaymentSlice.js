// import { createSlice } from '@reduxjs/toolkit';
// import dayjs from 'dayjs';

// const initialState = {
//   payments: []
// };

// const paymentSlice = createSlice({
//   name: 'payment',
//   initialState,
//   reducers: {
//     addPayment: (state, action) => {
//       const { cartNumber, name, plan, paidAmount, date } = action.payload;
//       const existingPayment = state.payments.find(p => p.cartNumber === cartNumber);

//       if (existingPayment) {
//         // Add the paidAmount to the total paid amount
//         existingPayment.totalPaidAmount += paidAmount;

//         // Subtract paidAmount from the dueAmount, but do not let it go negative
//         existingPayment.dueAmount = Math.max(0, existingPayment.dueAmount - paidAmount);

//         // Push the new payment into the payment history
//         existingPayment.payments.push({ amount: paidAmount, date });

//         // Update the status based on dueAmount
//         existingPayment.status = existingPayment.dueAmount > 0 ? "Due" : "Paid";
//       } else {
//         state.payments.push({
//           cartNumber,
//           name,
//           plan,
//           totalPaidAmount: paidAmount,
//           dueAmount: plan - paidAmount, // Set the remaining dueAmount
//           status: paidAmount >= plan ? "Paid" : "Due",
//           payments: [{ amount: paidAmount, date }],
//           lastUpdatedMonth: dayjs().format('YYYY-MM') // Store the month when the payment was added
//         });
//       }
//     },

//     updateMonthlyPayments: (state) => {
//       const currentMonth = dayjs().format('YYYY-MM');
      
//       state.payments.forEach(payment => {
//         if (payment.lastUpdatedMonth !== currentMonth) {
//           // Add Plan Amount to Due (for next month)
//           payment.dueAmount += payment.plan;

//           // Update the last updated month
//           payment.lastUpdatedMonth = currentMonth;

//           // Check if the dueAmount is more than 0, then mark it as "Due"
//           if (payment.dueAmount > 0) {
//             payment.status = "Due";
//           } else {
//             payment.status = "Paid";
//           }
//         }
//       });
//     }
//   }
// });

// export const { addPayment, updateMonthlyPayments } = paymentSlice.actions;
// export default paymentSlice.reducer;






// // PaymentSlice.js
// // import { createSlice } from "@reduxjs/toolkit";

// // const initialState = {
// //   payments: []
// // };

// // const paymentSlice = createSlice({
// //   name: "payment",
// //   initialState,
// //   reducers: {
// //     addPayment(state, action) {
// //       const { cartNumber, name, plan, paidAmount, date } = action.payload;

// //       const existingCustomer = state.payments.find(
// //         (payment) => payment.cartNumber === cartNumber
// //       );

// //       if (existingCustomer) {
// //         // Customer already exists: add new payment entry
// //         existingCustomer.payments.push({ amount: paidAmount, date });
        
// //         // Update total paid amount and due amount
// //         const totalPaid = existingCustomer.payments.reduce(
// //           (sum, p) => sum + p.amount,
// //           0
// //         );
// //         existingCustomer.totalPaidAmount = totalPaid;
// //         existingCustomer.dueAmount = plan - totalPaid;
// //         existingCustomer.status = existingCustomer.dueAmount <= 0 ? "Paid" : "Due";
// //       } else {
// //         // New customer entry
// //         state.payments.push({
// //           cartNumber,
// //           name,
// //           plan,
// //           payments: [{ amount: paidAmount, date }],
// //           totalPaidAmount: paidAmount,
// //           dueAmount: plan - paidAmount,
// //           status: plan - paidAmount <= 0 ? "Paid" : "Due"
// //         });
// //       }
// //     }
// //   }
// // });

// // export const { addPayment } = paymentSlice.actions;
// // export default paymentSlice.reducer;






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
