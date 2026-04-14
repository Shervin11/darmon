"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
}

const StatusBadge = ({ status, rejectReason }: StatusBadgeProps) => {
  const { t } = useTranslation();

  const statusConfig = {
    pending: {
      label: t("status.pending"),
      className: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
      icon: Clock,
    },
    approved: {
      label: t("status.approved"),
      className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
      icon: CheckCircle,
    },
    rejected: {
      label: t("status.rejected"),
      className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
      icon: XCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-1">
      <Badge
        variant="outline"
        className={`${config.className} font-medium px-3 py-1 inline-flex items-center gap-1.5 w-fit`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </Badge>
      {status === "rejected" && rejectReason && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{t("status.reason")}: {rejectReason}</p>
      )}
    </div>
  );
};

export default StatusBadge;
