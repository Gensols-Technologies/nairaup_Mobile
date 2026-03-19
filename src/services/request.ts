import axios from "axios";
import { Platform } from "react-native";
import * as Device from "expo-device";
import { Toast } from "toastify-react-native";
import { NetworkResponse } from "src/types/request.types";
import Constants from "expo-constants";

axios.defaults.timeout = 60 * 1000;

export const buildHeader = async (isDefaultAuth?: boolean): Promise<any> => {
  const API_BEARER_TOKEN = Constants.expoConfig?.extra?.API_BEARER_TOKEN || "";

  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Client-Device": JSON.stringify({
      brand: Device.brand,
      designName: Device.designName,
      deviceName: Device.deviceName,
      deviceType: Device.deviceType,
      deviceYearClass: Device.deviceYearClass,
      manufacturer: Device.manufacturer,
      modelId: Device.modelId,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
    }),
    // 'Accept': '*/*',
  };

  if (isDefaultAuth) {
    Object.assign(headers, {
      Authorization: `Bearer ${API_BEARER_TOKEN}`,
    });
  }
  return headers;
};

export const makeUrlKeyValuePairs = (json: { [key: string]: any }): string => {
  if (!json || Object.keys(json).length < 1) {
    return "";
  }

  const buildQuery = (obj: { [key: string]: any }, prefix = ""): string => {
    let query = "";
    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value !== undefined && value !== "undefined") {
        if (typeof value === "object" && value !== null) {
          query += buildQuery(value, newKey);
        } else {
          query +=
            encodeURIComponent(newKey) + "=" + encodeURIComponent(value) + "&";
        }
      }
    }

    return query;
  };

  const query = buildQuery(json);
  return query ? "?" + query.slice(0, -1) : "";
};

export const makeUrlKeyValuePaths = (json: { [key: string]: any }): string => {
  if (!json || Object.keys(json).length < 1) {
    return "";
  }
  const keys: string[] = Object.keys(json);
  let query = "/";
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (json[key] !== undefined && json[key] !== "undefined")
      query += encodeURIComponent(json[key]) + "/";
  }
  return query.replace(/&$/g, "");
};

export const trimJsonValues = (json: { [key: string]: any }) => {
  // Create a new object to avoid modifying the original object passed as an argument.
  const newObj: { [key: string]: any } = {};

  // Iterate over each key in the provided object.
  for (const key in json) {
    // Check if the property is a direct property of the object (and not inherited from the prototype chain).
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      const value = json[key];

      // Check if the value is a string. The .trim() method only works on strings.
      if (typeof value === "string") {
        // Trim the string value and assign it to the new object.
        newObj[key] = value.trim();
      } else {
        // If the value is not a string (e.g., number, boolean, null, another object),
        // copy it to the new object as is.
        newObj[key] = value;
      }
    }
  }

  // Return the new object with the processed values.
  return newObj;
};

type RequestObject = {
  type: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  queryParams?: { [key: string]: any };
  pathParams?: { [key: string]: any };
  data?: { [key: string]: any };
  route: string;
  contentType?: "multipart/form-data" | string;
  uploadCb?: Function;
  showToast?: boolean;
  toastTitle?: string;
  isDefaultAuth?: boolean;
};
export async function requestClan({
  data,
  type = "GET",
  queryParams,
  pathParams,
  route,
  contentType,
  uploadCb = () => null,
  showToast = true,
  toastTitle = "",
  isDefaultAuth,
}: RequestObject): Promise<any> {
  // Handle get request with params
  let routePlusParams = route;
  let transformedData;

  if (data) {
    if (contentType === "multipart/form-data") transformedData = data;
    else transformedData = trimJsonValues(data);
  }
  if (pathParams) {
    routePlusParams += makeUrlKeyValuePaths(pathParams);
  }

  if (queryParams) {
    routePlusParams += makeUrlKeyValuePairs(queryParams);
  }
  const headers = await buildHeader(isDefaultAuth);
  if (contentType)
    Object.assign(headers, {
      "Content-Type": contentType,
    });

  // Get API base URL dynamically at request time
  const API_BASE_URL = "https://api.nairaup.com/api/v1";

  if (__DEV__)
    console.log(
      "✅ Making axios request",
      data,
      type,
      queryParams,
      pathParams,
      API_BASE_URL,
      route,
      routePlusParams,
    );
  let reqStatus;
  let responseData: NetworkResponse = {
    code: 0,
    status: "",
  };
  try {
    const response = await axios({
      url: `${API_BASE_URL}${routePlusParams.trim()}`,
      method: type,
      data: transformedData,
      headers,
      maxBodyLength: Infinity,
      onUploadProgress: function (progressEvent) { },
    });
    reqStatus = response?.status;
    responseData = response.data;
    return response.data;
  } catch (error: any) {
    if (__DEV__) console.log("⚠", error);
    if (error?.response) {
      reqStatus = error?.response?.status;
      responseData = error?.response?.data;
      return error.response.data;
    } else if (error?.request) {
      reqStatus = 444;
      return {
        statusCode: 444,
        message: "No response from server",
        status: "error",
      };
    } else {
      reqStatus = -1;
      return {
        statusCode: -1,
        message: "Unable to set up request",
        status: "error",
      };
    }
  } finally {
    if (showToast)
      Toast.show({
        type: responseData.code > 202 ? "error" : "success",
        text1: toastTitle,
        text2: responseData.message || "Unknown error occured",
      });
    if (__DEV__)
      console.log(
        `✅ axios request ${routePlusParams.trim()} done with status ${reqStatus}`,
      );
  }
}
