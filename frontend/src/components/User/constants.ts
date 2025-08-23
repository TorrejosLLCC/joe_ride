export const PROFILE_CONSTANTS = {
  SIDEBAR: {
    DEFAULT_WIDTH: 280,
    MIN_WIDTH: 200,
    MAX_WIDTH: 500,
  },
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  MESSAGES: {
    SUCCESS: "Profile updated successfully!",
    ERROR: "Failed to update profile. Please try again.",
    LOADING: "Loading...",
  },
} as const;
