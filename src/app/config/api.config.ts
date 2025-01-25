// src/config/api.config.ts

export const API_BASE_URL = 'http://65.0.7.21/ksjabalpur/api';

export const ROUTES = {
  REQUEST_OTP: `${API_BASE_URL}/request_otp`,
  VERIFY_OTP: `${API_BASE_URL}/verify_otp`,
  APP_BANNER: `${API_BASE_URL}/appbanner`,
  PROPERTY_CATEGORY: `${API_BASE_URL}/property_categories`,
  FEATURED_PROPERTY: `${API_BASE_URL}/featured_properties`,
  All_PROPERTY: `${API_BASE_URL}/properties`,
  GET_BUILDERS: `${API_BASE_URL}/getbuilder`,
  BUILDER_BYID: `${API_BASE_URL}/get_properties_by_builder_id`,
  PROPERTY_CAT_BYID: `${API_BASE_URL}/properties_by_category`,
  UPDATE_PROFILE: `${API_BASE_URL}/updateUserDetails`,
  PROFILE_DETAILS: `${API_BASE_URL}/user_profile_details`,
};
