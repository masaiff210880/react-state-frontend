import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const testApi = createApi({
  reducerPath: "testApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  tagTypes: ["Lead"],
  endpoints: (builder) => ({
    getLeadSummary: builder.query({
      query: () => "/leads-summary",
      providesTags: [{ type: "Lead", id: "LIST" }],
    }),
    getLeads: builder.query({
      query: ({
        search = "",
        status = "",
        unitType = "",
        sortOrder = "desc",
      } = {}) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (unitType) params.append("unitType", unitType);
        if (sortOrder) params.append("sortOrder", sortOrder);
        return `/leads?${params.toString()}`;

        const queryString = params.toString();
        return queryString ? `/leads?${queryString}` : "/leads";
      },
      providesTags: [{ type: "Lead", id: "LIST" }],
    }),
    getLeadById: builder.query({
      query: (id) => `/leads/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Lead", id }],
    }),
    createLead: builder.mutation({
      query: (payload) => ({
        url: "/leads",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Lead", id: "LIST" }],
    }),
    updateLead: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/leads/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Lead", id: "LIST" },
        { type: "Lead", id: arg.id },
      ],
    }),
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Lead", id },
        { type: "Lead", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetLeadSummaryQuery,
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} = testApi;
