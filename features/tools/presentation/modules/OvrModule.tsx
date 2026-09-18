import { useEffect, useRef, useState } from "react";
import { trackAnalytics } from "@/features/analytics/application/track-analytics";
import { calculateSquadOvr } from "../../application/calculate-squad-ovr";
import { formations } from "../tool-options";

export function OvrModule() {
  const [formation, setFormation] = useState("4-3-3");
  const [starters, setStarters] = useState<(number | null)[]>(Array(11).fill(null));
  const [bench, setBench] = useState<(number | null)[]>(Array(7).fill(null));
  const [badges, setBadges] = useState(0);
  const result = calculateSquadOvr({ starters, bench, badgeCount: badges });
  const lastTrackedResult = useRef("");
  useEffect(() => {
    if (result.squadOvr == null) return;
    const signature = JSON.stringify([formation, starters, bench, badges]);
    const timer = window.setTimeout(() => {
      if (lastTrackedResult.current === signature) return;
      lastTrackedResult.current = signature;
      trackAnalytics("ovr_calculate", {
        formation,
        starter_count: starters.filter((value) => value != null).length,
        bench_count: bench.filter((value) => value != null).length,
        badge_count: badges,
        base_ovr: result.base ?? 0,
        squad_ovr: result.squadOvr ?? 0,
      });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [badges, bench, formation, result.base, result.squadOvr, starters]);
  function setValue(group: "starters" | "bench", index: number, raw: string) {
    const value = raw ? Math.min(150, Math.max(0, Number(raw))) : null;
    const setter = group === "starters" ? setStarters : setBench;
    setter((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
  }
  function reset() {
    setStarters(Array(11).fill(null));
    setBench(Array(7).fill(null));
    setBadges(0);
    trackAnalytics("ovr_reset", { formation });
  }
  return (
    <div className="tool-view-stack">
      <section className="ovr-layout">
        <div className="tool-panel">
          <div className="tool-panel-head"><div><p className="eyebrow">SQUAD CALCULATOR</p><h1>Tính OVR đội hình</h1></div><button onClick={reset}>Đặt lại</button></div>
          <label className="formation-select">Sơ đồ<select value={formation} onChange={(event) => setFormation(event.target.value)}>{formations.map((item) => <option key={item}>{item}</option>)}</select></label>
          <h3>Đội hình chính · {formation}</h3>
          <div className="ovr-input-grid">{starters.map((value, index) => <label key={index}><span>{index === 0 ? "GK" : `Vị trí ${index + 1}`}</span><input aria-label={`Starter ${index + 1}`} inputMode="numeric" value={value ?? ""} onChange={(event) => setValue("starters", index, event.target.value)} placeholder="OVR" /></label>)}</div>
          <h3>Dự bị</h3>
          <div className="ovr-input-grid bench">{bench.map((value, index) => <label key={index}><span>Dự bị {index + 1}</span><input aria-label={`Bench ${index + 1}`} inputMode="numeric" value={value ?? ""} onChange={(event) => setValue("bench", index, event.target.value)} placeholder="OVR" /></label>)}</div>
        </div>
        <aside className="ovr-result-card">
          <span>SQUAD OVR</span><strong>{result.squadOvr ?? "—"}</strong><p>Base {result.base ?? "—"} · {result.squadSize} cầu thủ</p>
          <label>Badge bonus<select value={badges} onChange={(event) => setBadges(Number(event.target.value))}>{Array.from({ length: 12 }, (_, index) => <option key={index} value={index}>+{index}</option>)}</select></label>
          <div><span>OVR cần thêm</span><b>{result.playerOvrNeeded ?? "—"}</b></div>
          <div><span>OVR kế tiếp</span><b>{result.squadOvr == null ? "—" : result.squadOvr + 1}</b></div>
        </aside>
      </section>
    </div>
  );
}
