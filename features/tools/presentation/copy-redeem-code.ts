import { trackAnalytics } from "@/features/analytics/application/track-analytics";

export async function copyRedeemCode(
  code: { id: number; code: string },
  source: string,
) {
  try {
    if (!navigator.clipboard) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(code.code);
    trackAnalytics("redeem_code_copy", {
      code_id: code.id,
      source,
      status: "success",
    });
  } catch {
    trackAnalytics("redeem_code_copy", {
      code_id: code.id,
      source,
      status: "failure",
    });
  }
}
