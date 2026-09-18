"use client";

import { useState } from "react";
import { trackAnalytics } from "@/features/analytics/application/track-analytics";

type RedeemCode = {
  id: number;
  code: string;
  reward: string;
  addedDate: string;
  active: boolean;
};

function CodeCard({ code }: { code: RedeemCode }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      trackAnalytics("redeem_code_copy", {
        code_id: code.id,
        source: "redeem_codes_page",
        status: "success",
      });
    } catch {
      trackAnalytics("redeem_code_copy", {
        code_id: code.id,
        source: "redeem_codes_page",
        status: "failure",
      });
    }
  }

  return (
    <article className={`redeem-code-card${code.active ? "" : " expired"}`}>
      <div className="redeem-code-meta">
        <span>{code.reward || "Phần thưởng FC Mobile"}</span>
        <small>{code.addedDate || "Chưa có ngày cập nhật"}</small>
      </div>
      <div className="redeem-code-value">
        <strong>{code.code}</strong>
        {code.active && (
          <button
            type="button"
            onClick={() => void copyCode()}
            aria-label={`Sao chép mã ${code.code}`}
            title="Sao chép mã"
          >
            {copied ? "Đã chép" : "Sao chép"}
          </button>
        )}
      </div>
    </article>
  );
}

export default function RedeemCodesList({ codes }: { codes: RedeemCode[] }) {
  const activeCodes = codes.filter((code) => code.active).sort((a, b) => b.id - a.id);
  const expiredCodes = codes.filter((code) => !code.active).sort((a, b) => b.id - a.id);

  return (
    <div className="redeem-columns">
      <section className="redeem-column">
        <div className="redeem-column-title">
          <h2>Mã đang hoạt động</h2>
          <span>{activeCodes.length}</span>
        </div>
        <div className="redeem-code-list">
          {activeCodes.map((code) => <CodeCard key={code.id} code={code} />)}
          {!activeCodes.length && <p className="redeem-empty">Chưa có mã đang hoạt động.</p>}
        </div>
      </section>
      <section className="redeem-column">
        <div className="redeem-column-title">
          <h2>Mã đã hết hạn</h2>
          <span>{expiredCodes.length}</span>
        </div>
        <div className="redeem-code-list">
          {expiredCodes.map((code) => <CodeCard key={code.id} code={code} />)}
        </div>
      </section>
    </div>
  );
}
