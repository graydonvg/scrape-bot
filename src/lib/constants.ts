export const USER_ERROR_MESSAGES = {
  // Unauthorized: "You need to be signed in to perform this action",
  Unexpected: "An unexpected error occurred. Please try again later.",
  GenericFormValidation: "Please fix the errors in the form",
  InsufficientCredits: "Insufficient credits",
} as const;

export const LOGGER_ERROR_MESSAGES = {
  Unauthorized: "Unauthorized",
  Unexpected: "Unexpected error",
  Insert: "Insert error",
  Delete: "Delete error",
  Select: "Select error",
  Update: "Update error",
} as const;
