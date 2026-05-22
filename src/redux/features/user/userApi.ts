import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPassengers: builder.query<
      IApiListResponse<IUser>,
      { page: number; limit: number; searchTerm?: string; status?: string }
    >({
      query: ({ page, limit, searchTerm, status }) => ({
        url: `/users/all-passengers`,
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
          ...(status && status !== "All"
            ? { status: status.toLowerCase() }
            : {}),
        },
      }),
      providesTags: [tagTypes.passenger],
    }),

    banUser: builder.mutation<void, { userId: string; reason: string }>({
      query: ({ userId, reason }) => ({
        url: `/users/ban/${userId}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: [tagTypes.passenger, tagTypes.user, tagTypes.driver],
    }),

    unbanUser: builder.mutation<void, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/unban/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.passenger, tagTypes.user, tagTypes.driver],
    }),

    warnUser: builder.mutation<void, { userId: string; reason: string }>({
      query: ({ userId, reason }) => ({
        url: `/users/warn/${userId}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: [tagTypes.passenger, tagTypes.user, tagTypes.driver],
    }),
  }),
});

export const {
  useGetPassengersQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useWarnUserMutation,
} = userApi;
