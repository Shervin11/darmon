"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
}

const statusConfig = {
  pending: {
    label: "Дар интизорӣ",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
  },
  approved: {
    label: "Тасдиқшуда",
    className: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle,
  },
  rejected: {
    label: "Радшуда",
    className: "bg-red-100 text-red-800 border-red-300",
    icon: XCircle,
  },
};

const StatusBadge = ({ status, rejectReason }: StatusBadgeProps) => {
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
        <p className="text-xs text-red-600 mt-1">Сабаб: {rejectReason}</p>
      )}
    </div>
  );
};

export default StatusBadge;
