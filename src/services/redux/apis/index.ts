import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  API_BASE_URL,
  APP_TOKEN,
  GLOBAL_RTK_CACHE_EMPTY_DURATION,
  GLOBAL_RTK_REFETCH_DURATION,
  RTK_CACHE_EMPTY_DURATION,
} from "src/constants/app.constants";
import { makeUrlKeyValuePairs } from "src/services/request";
import {
  ConnectionsQueryDto,
  GlobalQueryDto,
  JobsApplicationsQueryDto,
  JobsQueryDto,
  NotificationsQueryDto,
  PropertiesQueryDto,
  ReviewsQueryDto,
  UsersQueryDto,
} from "src/types/query.types";
import { NetworkResponse } from "src/types/request.types";
import SecureStoreManager from "src/utils/securestoremanager.utils";

export const reduxApiRequests = createApi({
  reducerPath: "apiRequests",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    prepareHeaders: async (headers) => {
      const token = await SecureStoreManager.getItemFromSecureStore(
        `${APP_TOKEN}`,
      );
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  keepUnusedDataFor: GLOBAL_RTK_CACHE_EMPTY_DURATION,
  refetchOnMountOrArgChange: GLOBAL_RTK_REFETCH_DURATION,
  endpoints: (builder) => ({
    getSavedJobs: builder.query<NetworkResponse, JobsQueryDto>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (query) => ({
        url: `/jobs/saved${makeUrlKeyValuePairs(query)}`,
      }),
    }),

    getSavedProperties: builder.query<NetworkResponse, any>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (query) => ({
        url: `/properties/saved${makeUrlKeyValuePairs(query)}`,
      }),
    }),

    getSavedJob: builder.query<NetworkResponse, number>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (id) => ({
        url: `/jobs/saved/${id}`,
      }),
    }),

    getNotifications: builder.query<NetworkResponse, NotificationsQueryDto>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (queryParams) => ({
        url: `/notifications${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),

    getNotificationsCount: builder.query<
      NetworkResponse,
      NotificationsQueryDto
    >({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (queryParams) => ({
        url: `/notifications/count${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),

    getJobsApplications: builder.query<
      NetworkResponse,
      JobsApplicationsQueryDto
    >({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (query) => ({
        url: `/jobs/applications${makeUrlKeyValuePairs(query)}`,
      }),
    }),

    getProviders: builder.query<NetworkResponse, UsersQueryDto>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (queryParams) => ({
        url: `/providers${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),

    getReviews: builder.query<NetworkResponse, ReviewsQueryDto>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (queryParams) => ({
        url: `/reviews${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),

    getReviewsCount: builder.query<NetworkResponse, ReviewsQueryDto>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (queryParams) => ({
        url: `/reviews/count${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),

    getConnections: builder.query<NetworkResponse, ConnectionsQueryDto>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (queryParams) => ({
        url: `/connections${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),

    getConnectionsCount: builder.query<NetworkResponse, ConnectionsQueryDto>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (queryParams) => ({
        url: `/connections/count${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),

    getConnectionsSummary: builder.query<NetworkResponse, ConnectionsQueryDto>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (queryParams) => ({
        url: `/connections/summary${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),

    getActiveReservation: builder.query<NetworkResponse, number>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (propertyid) => ({
        url: `/reservations/property/${propertyid}`,
      }),
    }),

    getTransactions: builder.query<NetworkResponse, any>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (queryParams) => ({
        url: `/transactions${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),

    getPortfolio: builder.query<NetworkResponse, GlobalQueryDto>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (queryParams) => ({
        url: `/portfolios${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),
    saveJob: builder.mutation<NetworkResponse, { jobid: string }>({
      query: (data) => ({
        url: "/jobs/saved",
        method: "POST",
        body: data,
      }),
    }),
    saveProperty: builder.mutation<NetworkResponse, { propertyid: string }>({
      query: (data) => ({
        url: "/properties/saved",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationsCountQuery,
  useGetJobsApplicationsQuery,
  useGetSavedJobsQuery,
  useGetSavedJobQuery,
  useGetProvidersQuery,
  useGetReviewsQuery,
  useGetReviewsCountQuery,
  useGetConnectionsCountQuery,
  useGetConnectionsQuery,
  useGetConnectionsSummaryQuery,
  useGetActiveReservationQuery,
  useGetSavedPropertiesQuery,
  useGetTransactionsQuery,
  useGetPortfolioQuery,
  useSaveJobMutation,
  useSavePropertyMutation,
} = reduxApiRequests;
