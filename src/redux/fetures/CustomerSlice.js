// import { createSlice } from "@reduxjs/toolkit";

// const CustomerSlice = createSlice({
//     name: "customare",
//     initialState: {
//         customarData: []
//     },
//     reducers: {
//         addCustomare: (state, action) => {
//             const newCustomar = {
//                 ...action.payload, 
//                 date: new Date().toLocaleDateString(),
//             };
//             state.customarData.push(newCustomar);
//         },
//         updateCustomer: (state, action) => {
//             const index = state.customarData.findIndex(c => c.mobile === action.payload.mobile);
//             if (index !== -1) {
//                 state.customarData[index] = action.payload;
//             }
//         },
//         deleteCustomer: (state, action) => {
//             state.customarData = state.customarData.filter(
//                 (customer) => customer.mobile !== action.payload
//             );
//         },

//     }
// });

// export const { addCustomare, updateCustomer,deleteCustomer } = CustomerSlice.actions;
// export default CustomerSlice.reducer;




import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customarData: [],
};

export const customareSlice = createSlice({
  name: 'customare',
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.customarData.push(action.payload);
    },
    deleteCustomer: (state, action) => {
      state.customarData = state.customarData.filter(
        (customer) => customer.mobile !== action.payload
      );
    },
    editCustomer: (state, action) => {
      const { mobile, updatedData } = action.payload;
      const index = state.customarData.findIndex(
        (customer) => customer.mobile === mobile
      );
      if (index !== -1) {
        state.customarData[index] = { ...state.customarData[index], ...updatedData };
      }
    },
    addPaidAmount: (state, action) => {
      const { mobile, paidAmount } = action.payload;
      const customer = state.customarData.find(c => c.mobile === mobile);
      if (customer) {
        customer.paidAmount = (Number(customer.paidAmount) || 0) + Number(paidAmount);
      }
    },
  },
});

export const { addCustomer, deleteCustomer, editCustomer, addPaidAmount } = customareSlice.actions;

export default customareSlice.reducer;
