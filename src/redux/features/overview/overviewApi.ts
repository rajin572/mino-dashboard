import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStatistics: builder.query<IStatisticsResponse, void>({
      query: () => ({
        url: "/dashboard/statistics",
        method: "GET",
      }),
      providesTags: [tagTypes.overview],
    }),
    getMonthlyUsers: builder.query<
      IMonthlyUsersResponse,
      { role: string; year: number }
    >({
      query: ({ role, year }) => ({
        url: "/dashboard/users/monthly",
        method: "GET",
        params: { role, year },
      }),
      providesTags: [tagTypes.overview],
    }),
    getYearlyEarnings: builder.query<IYearlyEarningsResponse, { year: number }>(
      {
        query: ({ year }) => ({
          url: "/dashboard/earnings/yearly",
          method: "GET",
          params: { year },
        }),
        providesTags: [tagTypes.overview],
      }
    ),
  }),
});

export const {
  useGetStatisticsQuery,
  useGetMonthlyUsersQuery,
  useGetYearlyEarningsQuery,
} = overviewApi;
