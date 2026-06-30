export const APP_CONSTANTS = {
  SHORT_CODE_LENGTH: 7,
  BCRYPT_SALT_ROUNDS: 12,
  MAX_URL_TITLE_LENGTH: 100,
  MAX_CUSTOM_ALIAS_LENGTH: 50,
  MIN_CUSTOM_ALIAS_LENGTH: 3,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  REFRESH_TOKEN_COOKIE_NAME: 'refreshToken',
  REFRESH_TOKEN_COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
} as const;

export const ERROR_MESSAGES = {
  INTERNAL_ERROR: 'An internal server error occurred',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  DUPLICATE_EMAIL: 'An account with this email already exists',
  DUPLICATE_SHORT_CODE: 'This short code is already taken',
  DUPLICATE_ALIAS: 'This custom alias is already taken',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_TOKEN: 'Invalid or expired token',
  URL_EXPIRED: 'This URL has expired',
  URL_DISABLED: 'This URL has been disabled',
  URL_NOT_FOUND: 'URL not found',
  USER_NOT_FOUND: 'User not found',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
} as const;

export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: 'Account created successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  URL_CREATED: 'URL created successfully',
  URL_UPDATED: 'URL updated successfully',
  URL_DELETED: 'URL deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;
