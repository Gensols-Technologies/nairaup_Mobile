import Constants from "expo-constants";
import { UserObjectType } from "src/types/app.types";

// Get API URLs from app.config.js extra field
const API_DEV_URL = Constants.expoConfig?.extra?.API_DEV_URL || "http://192.168.100.38:3335";
const API_STAGING_URL = Constants.expoConfig?.extra?.API_STAGING_URL || "http://192.168.100.38:3335";
const PRODUCT_NAME = Constants.expoConfig?.extra?.PRODUCT_NAME || "NairaUp";

export const API_BASE_URL = __DEV__ ? `${API_DEV_URL}` : `${API_STAGING_URL}`;

export const GLOBAL_RTK_CACHE_EMPTY_DURATION = 5;
export const GLOBAL_RTK_REFETCH_DURATION = 5;
export const RTK_CACHE_EMPTY_DURATION = 5;

export const APP_NAME = `${PRODUCT_NAME}`;
const _APP_NAME = APP_NAME.toLowerCase().replace(" ", "-");
export const APP_THEME = `${_APP_NAME}-APP-THEME`;
export const APP_TOKEN = `${_APP_NAME}-APP-TOKEN`;
export const APP_EXPO_PUSH_TOKEN = `${_APP_NAME}-APP-EXPO-PUSH-TOKEN`;
export const APP_INITIAL_ROUTE = `${_APP_NAME}-APP-INITIAL-ROUTE`;

export const APP_APPLE_AUTH_USER = `${_APP_NAME}-APPLE-AUTH-USER`;
export const APP_SHOW_ADD_POST_MODAL = `${_APP_NAME}-SHOW-ADD-POST-MODAL`;
export const APP_APPLIED_JOBS = `${_APP_NAME}-APPLIED-JOBS`;

export const IMAGE_PLACEHOLDER =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
export const IMAGE_VIDEO_BLUE = "L04xlD009Fay%MIUxuj[9Fxut7IU";
export const IMAGE_TRANSITION = 1;

export const DEFAULT_USER: UserObjectType = {
  id: -1,
  createdat: "2025-10-09T14:07:14.017Z",
  deleted: false,
  deletedat: null,
  emailverified: false,
  mobileverified: false,
  deviceid: null,
  biometricsloginenabled: false,
  mobile: "",
  email: "",
  profile: {
    createdat: "2025-10-09T14:07:14.024Z",
    deleted: false,
    deletedat: null,
    firstname: "",
    id: 1,
    lastname: "",
    updatedat: "2025-10-09T14:11:05.000Z",
    userid: 1,
    address: "",
    city: "",
    country: "",
    geolocation: "",
    landmark: "",
    state: "",
    avatarurl: "",
    profiletype: "user",
    pushnotificationtoken: "",
    description: null,
    dateofbirth: null,
    gender: "other",
    kyclevel: 1,
    referralcode: "",
    virtualaccount: null,
    averagerating: 3,
    totalrating: 1,
    verified: false,
    profession: "",
    yearsofexperience: 1,
  },
  status: "active",
  updatedat: "2025-10-09T14:11:05.000Z",
  lastlogin: "2025-10-09T13:55:26.000Z",
};

export const PRICE_RANGES = {
  jobs_salary_range: [
    {
      label: "Reset",
      value: "",
      start: 0,
      end: 0,
    },
    {
      label: "50k - 100k",
      value: "50,100000",
      start: 50,
      end: 100000,
    },
    {
      label: "100k - 500k",
      value: "100000,500000",
      start: 100000,
      end: 500000,
    },
    {
      label: "500k - 1M",
      value: "500000,1000000",
      start: 500000,
      end: 1000000,
    },
    {
      label: "1M - 2M",
      value: "1000000,2000000",
      start: 1000000,
      end: 2000000,
    },
    {
      label: "Above 2M",
      value: "2000000,10000000000000",
      start: 2000000,
      end: 10000000000000,
    },
  ],
  apartments_for_rent: [
    {
      label: "< 1M",
      value: "0,999999",
      start: 0,
      end: 999999,
    },
    {
      label: "1M - 5M",
      value: "1000000,5000000",
      start: 1000000,
      end: 5000000,
    },
  ],
  apartments_for_sale: [
    {
      label: "< 10M",
      value: "0,10000000",
      start: 0,
      end: 10000000,
    },
    {
      label: "10M - 50M",
      value: "10000000,50000000",
      start: 10000000,
      end: 50000000,
    },
    {
      label: "> 50M",
      value: "50000000,1000000000000000000",
      start: 50000000,
      end: 1000000000000000000,
    },
  ],
};

export const PAGE_FILTERS = [
  {
    label: "Apartments",
    value: "apartments",
  },
  {
    label: "Hotels",
    value: "hotels",
  },
  {
    label: "Jobs",
    value: "jobs",
  },
];
