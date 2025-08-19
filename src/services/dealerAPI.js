import { apiSlice } from "./apiSlice";

export const dealerAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDealer: builder.query({
      query: (pageNo) => ({
        url: `/dealer/allDealers/${pageNo}`,

        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Dealer", pageNo: result.pageNo }] : [],
    }),

    getDealerbySales: builder.query({
      query: (userid) => ({
        url: `/dealer/getAllDealersBySalesPersonID?salesPersonID=${userid}`,
        // transferResponce: console.log(userid),
        method: "GET",
      }),
      providesTags: ["Dealer", "user"],
    }),
    deleteDealer: builder.mutation({
      query: (id) => ({
        url: `/dealer/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dealer"],
    }),

    getDealer: builder.query({
      query: ({ id }) => ({
        url: `/dealer/${id}`,
      }),
      providesTags: ["Dealer", "user"],
    }),

    getEditDealer: builder.mutation({
      query: (userid) => ({
        url: `/dealer/updateDealer/${userid.id}`,
        method: "PUT",
        // transerResponse: console.log(userid.id),
        body: userid.inputField,
      }),
      invalidatesTags: ["Dealer"],
    }),

    getAllDealerCompleteBooking: builder.query({
      query: ({ pageNo, id }) => ({
        url: `/confirmBooking/getAllBookingsByDealerId?pageNo=${pageNo}&dealerId=${id}`,
      }),
      providesTags: ["DEALERBOOKING"],
    }),

    getAllB2BCompleteBooking: builder.query({
      query: ({ id }) => ({
        url: `/b2bConfirm/buyerId?buyerDealerId=${id}`,
      }),
      providesTags: ["DEALERBOOKING"],
    }),

    getAllDealerPendingBooking: builder.query({
      query: ({ id, pageNo }) => ({
        url: `/booking/getPendingBookingDetailsByDealerID?pageNo=${pageNo}&dealerId=${id}`,
        // transerResponse: console.log(pageNo, id),
      }),
      providesTags: ["DEALERBOOKING"],
    }),

    getAllPendingB2BRequest: builder.query({
      query: ({ id }) => ({
        url: `/b2b/by-buyer-dealer?buyerDealerId=${id}`,
        // transerResponse: console.log(pageNo, id),
      }),
      providesTags: ["DEALERBOOKING"],
    }),

addCarImages: builder.mutation({
  query: ({ file, documentType, premiumCarId, userId }) => {
    const formData = new FormData();
    formData.append("image", file);
    return {
      url: `/PremiumCarUploadFile/add?documentType=${documentType}&userId=${userId}&premiumCarId=${premiumCarId}`,
      method: "POST",
      body: formData,
    };
  },
  invalidatesTags: ["Dealer"],
}),



    dealerStatus: builder.mutation({
      query: ({ dealer_id, status }) => ({
        url: `/dealer/statusUpdate?dealerId=${dealer_id}&status=${status}`,
        // transerResponse: console.log("APi response", dealer_id, status),
        method: "PATCH",
      }),
      invalidatesTags: ["Dealer"],
    }),

    getAllDealerList: builder.query({
      query: () => ({
        url: `dealer/allDealer`,
        method: "GET",
      }),
      providesTags: ["Dealer"],
    }),
    cancelStatusSet: builder.mutation({
      query: (id, data) => ({
        url: `/confirmBooking/cancelStatusSet?id=${id}`,
        method: "PUT",
        // transerResponse: console.log(id),
        body: data,
      }),
      invalidatesTags: ["Dealer"],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `/user/getUser/${id}`,
        method: "GET",
      }),
      providesTags: ["Dealer", "User"],
    }),

    chnagePassword: builder.mutation({
      query: ({ passChange, dealerId }) => ({
        url: `/dealer/changePassword/${dealerId}`,
        method: "PUT",
        body: passChange,
      }),
    }),

    getDealerByUserId: builder.query({
      query: (id) => ({
        url: `/dealer/win/${id}`,
        method: "GET",
      }),
      providesTags: ["Dealer", "User"],
    }),

    getDealerProfile: builder.query({
      query: ({ userId }) => ({
        url: `/ProfilePhoto/getbyuserid?${userId}`,
      }),
      providesTags: ["Dealer", "user"],
    }),

    b2bpost: builder.mutation({
      query: (interestShow) => ({
        url: `/b2b/add`,
        method: "POST",
        body: interestShow,
      }),
      providesTags: ["Dealer"],
    }),
  }),
});

export const {
  useGetAllDealerQuery,
  useGetDealerbySalesQuery,
  useDeleteDealerMutation,
  useGetDealerQuery,
  useLazyGetDealerQuery,
  useGetEditDealerMutation,
  useGetAllDealerCompleteBookingQuery,
  useGetAllB2BCompleteBookingQuery,
  useGetAllDealerPendingBookingQuery,
  useGetAllPendingB2BRequestQuery,
  useAddCarImagesMutation,
  useDealerStatusMutation,
  useGetAllDealerListQuery,
  useCancelStatusSetMutation,
  useGetUserQuery,
  useChnagePasswordMutation,
  useLazyGetDealerByUserIdQuery,
  useGetDealerProfileQuery,
  useB2bpostMutation,
} = dealerAPI;
