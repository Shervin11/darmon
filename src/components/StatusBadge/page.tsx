"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Ban, BadgeCheck, UserX } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { AppointmentStatus } from "@/store/store";

interface StatusBadgeProps {
  status: AppointmentStatus;
  rejectReason?: string;
}

const statusConfig: Record<AppointmentStatus, { className: string; icon: typeof Clock }> = {
  pending: {
    className: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
    icon: Clock,
  },
  approved: {
    className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    icon: CheckCircle,
  },
  completed: {
    className: "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700",
    icon: BadgeCheck,
  },
  rejected: {
    className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
    icon: XCircle,
  },
  cancelled: {
    className: "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-600",
    icon: Ban,
  },
  no_show: {
    className: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
    icon: UserX,
  },
};

const StatusBadge = ({ status, rejectReason }: StatusBadgeProps) => {
  const { t } = useTranslation();
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-1">
      <Badge variant="outline" className={`${config.className} font-medium px-3 py-1 inline-flex items-center gap-1.5 w-fit`}>
        <Icon className="w-3.5 h-3.5" />
        {t(`status.${status}`)}
      </Badge>
      {(status === "rejected" || status === "cancelled") && rejectReason && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{t("status.reason")}: {rejectReason}</p>
      )}
    </div>
  );
};

export default StatusBadge;
