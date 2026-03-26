import {
  JobApplicationStatusType,
  JobStatusType,
  JobworkModeType,
  JobworkType,
} from "./jobs.types";
import {
  NotificationSourceType,
  NotificationStatusType,
  NotificationType,
} from "./notifications.types";
import {
  PropertyCategoryType,
  PropertyStatusType,
  PropertyType,
} from "./properties.types";
import { UserStatusType } from "./user.types";

export type GlobalQueryDto = {
  limit?: number;
  page?: number;
  order?: string;
  id?: string;
  profileid?: string;
  deleted?: 0 | 1;
  createdat?: string;
  updatedat?: string;
  deletedat?: string;
  city?: string;
  state?: string;
  address?: string;
  averagerating?: string;
  totalrating?: string;
};

export type PropertiesQueryDto = GlobalQueryDto & {
  title?: string;
  price?: string;
  category?: PropertyCategoryType;
  type?: PropertyType;
  status?: PropertyStatusType;
};

export type JobsQueryDto = GlobalQueryDto & {
  minsalary?: string;
  maxsalary?: string;
  role?: string;
  company?: string;
  workmode?: JobworkModeType;
  worktype?: JobworkType;
  currency?: string;
  status?: JobStatusType;
  featured?: 0 | 1;
};

export type JobsApplicationsQueryDto = GlobalQueryDto & {
  jobid?: string;
  applicantfirstname?: string;
  applicantlastname?: string;
  applicantemail?: string;
  applicantmobile?: string;
  status?: JobApplicationStatusType;
};

export type NotificationsQueryDto = GlobalQueryDto & {
  status?: NotificationStatusType;
  type?: NotificationType;
  title?: string;
  source?: NotificationSourceType;
};

export type UsersQueryDto = GlobalQueryDto & {
  gender?: "male" | "female" | "other";
  "user.status"?: UserStatusType;
  kyclevel?: number | string;
  city?: string;
  state?: string;
  country?: string;
  averagerating?: number | string;
  totalrating?: number | string;
  verified?: 0 | 1;
  referralcode?: string;
  profession?: string;
};

export type ReviewsQueryDto = GlobalQueryDto & {
  profileid?: number;
  recipientid?: number;
  propertyid?: number;
  rating?: string | number;
};

export type ConnectionsQueryDto = GlobalQueryDto & {
  connectionid?: number;
  connectionstring?: string;
};
