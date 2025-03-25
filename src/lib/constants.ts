export const userErrorMessages = {
  Unexpected: "An unexpected error occurred. Please try again later.",
  GenericFormValidation: "Please fix the errors in the form",
  InsufficientCredits: "Insufficient credits",
} as const;

export const loggerErrorMessages = {
  Unauthorized: "Unauthorized",
  Unexpected: "Unexpected error",
  Insert: "Database insert error",
  Delete: "Database delete error",
  Select: "Database select error",
  Update: "Database update error",
} as const;
