import { Flame } from "lucide-react";
import { ICON_MAP } from "@/services/yagyaCategoryAdminService";

interface YagyaCategoryIconProps {
  iconName?: string | null;
  className?: string;
}

export default function YagyaCategoryIcon({
  iconName,
  className = "w-5 h-5 text-saffron-600",
}: YagyaCategoryIconProps) {
  const IconComponent = (iconName && ICON_MAP[iconName]) || Flame;
  return <IconComponent className={className} />;
}
