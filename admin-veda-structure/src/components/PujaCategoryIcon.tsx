import { Sparkles } from "lucide-react";
import { ICON_MAP } from "@/services/pujaCategoryAdminService";

interface PujaCategoryIconProps {
  iconName?: string | null;
  className?: string;
}

export default function PujaCategoryIcon({
  iconName,
  className = "w-5 h-5 text-saffron-600",
}: PujaCategoryIconProps) {
  const IconComponent = (iconName && ICON_MAP[iconName]) || Sparkles;
  return <IconComponent className={className} />;
}
