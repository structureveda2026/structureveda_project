import { BookOpen } from "lucide-react";
import { ICON_MAP } from "@/services/pathCategoryAdminService";

interface PathCategoryIconProps {
  iconName?: string | null;
  className?: string;
}

export default function PathCategoryIcon({
  iconName,
  className = "w-5 h-5 text-saffron-600",
}: PathCategoryIconProps) {
  const IconComponent = (iconName && ICON_MAP[iconName]) || BookOpen;
  return <IconComponent className={className} />;
}
