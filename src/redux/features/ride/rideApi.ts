import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const rideApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminRides: builder.query<
            IApiListResponse<IRide>,
            { page: number; limit: number; searchTerm?: string; status?: string }
        >({
            query: ({ page, limit, searchTerm, status }) => ({
                url: `/ride/admin`,
                method: "GET",
                params: {
                    page,
                    limit,
                    ...(searchTerm ? { searchTerm } : {}),
                    ...(status && status !== "All" ? { status } : {}),
                },
            }),
            providesTags: [tagTypes.ride],
        }),
    }),
});

export const { useGetAdminRidesQuery } = rideApi;
