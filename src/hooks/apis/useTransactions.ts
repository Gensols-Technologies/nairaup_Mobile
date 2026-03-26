import { useState } from "react";
import { requestClan } from "src/services/request";
import { NetworkResponse } from "src/types/request.types";

const useTransaction = () => {
  const [loading, setLoading] = useState(false);

  const generatePaymentReference = async (
    data: {
      propertyid?: number;
    },
    cb = () => {},
    showToast = false,
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/transactions/reference`,
      type: "POST",
      data,
      showToast,
    });
    cb();
    setLoading(false);
    return request;
  };

  return {
    loading,
    generatePaymentReference,
  };
};

export default useTransaction;
