export type LoginDto = {
  username: string;
  password?: string;
  deviceid?: string;
  pushnotificationtoken?: string;
};

export type SignUpDto = {
  firstname: string;
  lastname: string;
  email?: string;
  mobile?: string;
  password?: string;
  pushnotificationtoken?: string;
};

export type OTPDto = {
  otp?: string;
  email?: string;
  mobile?: string;
  ispasswordreset?: boolean;
};

export type NetworkPaginationDto = {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type NetworkResponse = {
  message?: string;
  status: string;
  code: number;
  meta?: NetworkPaginationDto;
  data?: any;
};

export type UpdatePasswordDto = {
  password: string;
  confirmpassword: string;
  currentpassword?: string;
};
