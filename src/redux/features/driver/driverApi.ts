import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApprovedDrivers: builder.query<
      IApiListResponse<IDriver>,
      { page: number; limit: number; searchTerm?: string }
    >({
      query: ({ page, limit, searchTerm }) => ({
        url: `/users/all-approved-drivers`,
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
        },
      }),
      providesTags: [tagTypes.driver],
    }),

    getRequestDrivers: builder.query<
      IApiListResponse<IDriver>,
      { page: number; limit: number; searchTerm?: string }
    >({
      query: ({ page, limit, searchTerm }) => ({
        url: `/users/all-request-drivers`,
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
        },
      }),
      providesTags: [tagTypes.driver],
    }),

    approveDriver: builder.mutation<void, { driverId: string }>({
      query: ({ driverId }) => ({
        url: `/users/approve-driver/${driverId}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.driver],
    }),

    rejectDriver: builder.mutation<void, { userId: string; reason: string }>({
      query: ({ userId, reason }) => ({
        url: `/users/reject-driver/${userId}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: [tagTypes.driver],
    }),
  }),
});

export const {
  useGetApprovedDriversQuery,
  useGetRequestDriversQuery,
  useApproveDriverMutation,
  useRejectDriverMutation,
} = driverApi;
