interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> =
  {
    Active: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    "Out of Stock": {
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-500",
    },
    Draft: {
      bg: "bg-charcoal-100",
      text: "text-charcoal-500",
      dot: "bg-charcoal-400",
    },
    Inactive: {
      bg: "bg-charcoal-100",
      text: "text-charcoal-500",
      dot: "bg-charcoal-400",
    },
    Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    Processing: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    Shipped: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      dot: "bg-indigo-500",
    },
    Delivered: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    Cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
    Confirmed: {
      bg: "bg-saffron-50",
      text: "text-saffron-700",
      dot: "bg-saffron-500",
    },
    Completed: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    Read: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    Rescheduled: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      dot: "bg-purple-500",
    },
    Paid: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    Failed: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
    Refunded: {
      bg: "bg-charcoal-100",
      text: "text-charcoal-600",
      dot: "bg-charcoal-400",
    },
    Approved: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    Hidden: {
      bg: "bg-charcoal-100",
      text: "text-charcoal-500",
      dot: "bg-charcoal-400",
    },
    Published: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    Archived: {
      bg: "bg-charcoal-100",
      text: "text-charcoal-500",
      dot: "bg-charcoal-400",
    },
    "On Leave": {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
    },
    Expired: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  };

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    bg: "bg-charcoal-100",
    text: "text-charcoal-500",
    dot: "bg-charcoal-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
