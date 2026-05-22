import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPayments: builder.query<
            IApiListResponse<IPayment>,
            { page: number; limit: number; searchTerm?: string }
        >({
            query: ({ page, limit, searchTerm }) => ({
                url: `/payment/admin`,
                method: "GET",
                params: {
                    page,
                    limit,
                    ...(searchTerm ? { searchTerm } : {}),
                },
            }),
            providesTags: [tagTypes.payment],
        }),
    }),
});

export const { useGetPaymentsQuery } = paymentApi;
