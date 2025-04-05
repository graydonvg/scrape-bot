import { userErrorMessages } from "@/lib/constants";
import { Logger } from "next-axiom";

const BASE_URL = "/api/invoices";

type Result =
  | { success: false; message: string }
  | { success: true; data: string };

export default async function getInvoice(
  userPurchaseId: string,
): Promise<Result> {
  const log = new Logger();

  try {
    const response = await fetch(`${BASE_URL}/${userPurchaseId}`);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data };
    }

    return { success: true, data };
  } catch (error) {
    log.error("Error fetching invoice", { error });
    return { success: false, message: userErrorMessages.Unexpected };
  }
}
