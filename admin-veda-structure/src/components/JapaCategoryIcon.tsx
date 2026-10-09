import { Sparkles } from "lucide-react";
import { ICON_MAP } from "@/services/japaCategoryAdminService";

interface JapaCategoryIconProps {
  iconName?: string | null;
  className?: string;
}

export default function JapaCategoryIcon({
  iconName,
  className = "w-5 h-5 text-saffron-600",
}: JapaCategoryIconProps) {
  const IconComponent = (iconName && ICON_MAP[iconName]) || Sparkles;
  return <IconComponent className={className} />;
}
