import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleServerError: (error) => {
    if (error instanceof Error) {
      // Return the actual error message thrown from your action.
      return error.message;
    }
    return "Something went wrong while executing the operation.";
  },
  defaultValidationErrorsShape: "flattened",
});
