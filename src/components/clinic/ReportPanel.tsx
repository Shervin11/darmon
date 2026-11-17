"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BarChart3, Download } from "lucide-react";
import { api, apiError } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { localDate } from "@/lib/schedule";
import { cardCls, fieldCls, labelCls, primaryBtn } from "./styles";

interface DoctorRow {
  doctorId: number;
  doctorName: string;
  total: number;
  completed: number;
  no_show: number;
  cancelled: number;
  online: number;
  phone: number;
  walkin: number;
  revenue: number;
  paidRevenue: number;
  noShowRate: number;
}

interface Report {
  doctors: DoctorRow[];
  totals: { total: number; completed: number; no_show: number; cancelled: number; revenue: number; paidRevenue: number };
}

const monthStart = () => localDate().slice(0, 8) + "01";

/** Visits, no-shows and revenue per doctor for a period, with a CSV export of every visit. */
export default function ReportPanel() {
  const { t } = useTranslation();
  const [from, setFrom] = useState(monthStart);
  const [to, setTo] = useState(() => localDate());
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (!from || !to) return;
    api.get<Report>("/clinic/report", { params: { from, to } }).then(({ data }) => setReport(data)).catch(() => setReport(null));
  }, [from, to]);

  // The CSV needs the auth header, so download it through the API client
  const download = async () => {
    try {
      const { data } = await api.get<Blob>("/clinic/report.csv", { params: { from, to }, responseType: "blob" });
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `darmon-${from}_${to}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(apiError(err, t("common.error")));
    }
  };

  const stats = report
    ? [
        [t("report.total"), report.totals.total],
        [t("report.completed"), report.totals.completed],
        [t("report.noShow"), report.totals.no_show],
        [t("report.revenue"), report.totals.revenue],
      ]
    : [];

  return (
    <section className={`${cardCls} space-y-6`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="inline-flex items-center gap-2 font-headline font-bold text-2xl text-md-on-surface">
          <BarChart3 className="w-6 h-6 text-md-primary" />
          {t("report.title")}
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <label className="space-y-1.5">
            <span className={labelCls}>{t("report.from")}</span>
            <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className={fieldCls} />
          </label>
          <label className="space-y-1.5">
            <span className={labelCls}>{t("report.to")}</span>
            <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} className={fieldCls} />
          </label>
          <button onClick={download} className={primaryBtn}>
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-md-surface-container-low px-5 py-4">
                <p className="text-xs text-md-on-surface-variant">{label}</p>
                <p className="font-headline font-black text-2xl text-md-on-surface tabular-nums">{value}</p>
              </div>
            ))}
          </div>

          {report.doctors.length === 0 ? (
            <p className="text-sm text-md-on-surface-variant">{t("report.empty")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-left text-md-on-surface-variant">
                    {["report.doctor", "report.total", "report.completed", "report.noShow", "report.cancelled", "report.bySource", "report.revenue"].map((k) => (
                      <th key={k} className="py-2 pr-4 font-medium">{t(k)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-md-outline-variant/20 tabular-nums">
                  {report.doctors.map((d) => (
                    <tr key={d.doctorId} className="text-md-on-surface">
                      <td className="py-3 pr-4 font-semibold">{d.doctorName}</td>
                      <td className="py-3 pr-4">{d.total}</td>
                      <td className="py-3 pr-4">{d.completed}</td>
                      <td className="py-3 pr-4">{d.no_show} <span className="text-md-on-surface-variant">({d.noShowRate}%)</span></td>
                      <td className="py-3 pr-4">{d.cancelled}</td>
                      <td className="py-3 pr-4 text-md-on-surface-variant">{d.online} / {d.phone} / {d.walkin}</td>
                      <td className="py-3 pr-4">{d.revenue} <span className="text-md-on-surface-variant">({t("report.paid")} {d.paidRevenue})</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-md-on-surface-variant">{t("report.sourceHint")}</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
