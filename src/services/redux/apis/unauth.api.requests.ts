// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Constants from "expo-constants";
import {
  GLOBAL_RTK_CACHE_EMPTY_DURATION,
  GLOBAL_RTK_REFETCH_DURATION,
  RTK_CACHE_EMPTY_DURATION,
} from "src/constants/app.constants";
import { NetworkResponse } from "src/types/request.types";
import { indexArrayByField } from "src/utils/app.utils";
import {
  GlobalQueryDto,
  JobsQueryDto,
  PropertiesQueryDto,
} from "src/types/query.types";
import { makeUrlKeyValuePairs } from "src/services/request";

// Get API values dynamically
const API_BASE_URL = Constants.expoConfig?.extra?.API_DEV_URL || "http://localhost:3335";
const API_BEARER_TOKEN = Constants.expoConfig?.extra?.API_BEARER_TOKEN || "";

export const unAuthReduxApiRequests = createApi({
  reducerPath: "unAuthApiRequests",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    prepareHeaders: async (headers) => {
      headers.set("Authorization", `Bearer ${API_BEARER_TOKEN}`);
      return headers;
    },
  }),
  keepUnusedDataFor: GLOBAL_RTK_CACHE_EMPTY_DURATION,
  refetchOnMountOrArgChange: GLOBAL_RTK_REFETCH_DURATION,
  endpoints: (builder) => ({
    getPropertyTypesAndCategories: builder.query<NetworkResponse, null>({
      query: () => ({
        url: "/helpers/properties/typesandcategories",
      }),
    }),

    getPropertyFeatures: builder.query<NetworkResponse, null>({
      query: () => ({
        url: "/helpers/properties/features",
      }),
      transformResponse(baseQueryReturnValue, meta, arg) {
        const data =
          //@ts-ignore
          baseQueryReturnValue?.data || [];
        const indexed = indexArrayByField(data, "id");
        return {
          //@ts-ignore
          status: baseQueryReturnValue?.status,
          //@ts-ignore
          pagination: baseQueryReturnValue?.pagination,
          //@ts-ignore
          code: baseQueryReturnValue?.code,
          data: data,
          indexedData: indexed,
        };
      },
    }),
    getProperties: builder.query<NetworkResponse, PropertiesQueryDto>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (query) => ({
        url: `/properties${makeUrlKeyValuePairs(query)}`,
      }),
    }),

    getProperty: builder.query<NetworkResponse, number>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (id) => ({
        url: `/properties/${id}`,
      }),
    }),

    getJobs: builder.query<NetworkResponse, JobsQueryDto>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (query) => ({
        url: `/jobs${makeUrlKeyValuePairs(query)}`,
      }),
    }),

    getJob: builder.query<NetworkResponse, number>({
      keepUnusedDataFor: RTK_CACHE_EMPTY_DURATION,
      query: (id) => ({
        url: `/jobs/${id}`,
      }),
    }),

    getProfessions: builder.query<NetworkResponse, GlobalQueryDto>({
      query: (queryParams) => ({
        url: `/helpers/professions${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),

    getJobTypesAndModes: builder.query<NetworkResponse, null>({
      query: () => ({
        url: "/helpers/jobs/typesandmodes",
      }),
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useGetJobQuery,
  useGetJobsQuery,
  useGetPropertyTypesAndCategoriesQuery,
  useGetPropertyFeaturesQuery,
  useGetProfessionsQuery,
  useGetJobTypesAndModesQuery,
} = unAuthReduxApiRequests;
