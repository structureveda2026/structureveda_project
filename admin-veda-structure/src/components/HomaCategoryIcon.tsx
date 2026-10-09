import { Flame } from "lucide-react";
import { ICON_MAP } from "@/services/homaCategoryAdminService";

interface HomaCategoryIconProps {
  iconName?: string | null;
  className?: string;
}

export default function HomaCategoryIcon({
  iconName,
  className = "w-5 h-5 text-saffron-600",
}: HomaCategoryIconProps) {
  const IconComponent = (iconName && ICON_MAP[iconName]) || Flame;
  return <IconComponent className={className} />;
}
