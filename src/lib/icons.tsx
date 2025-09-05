import {
  Car,
  Euro,
  GraduationCap,
  HeartPulse,
  Landmark,
  Leaf,
  MapPinned,
  Microscope, PlugZap,
  Scale, Tag,
  Tractor,
  Users
} from "lucide-react";

export function getCategoryIcon(categoryId: string, size: number = 14) {
  switch (categoryId) {
    case "GOVE":
      return <Landmark size={size} />;
    case "REGI":
      return <MapPinned size={size} />;
    case "SOCI":
      return <Users size={size} />;
    case "ECON":
      return <Euro size={size} />;
    case "ENVI":
      return <Leaf size={size} />;
    case "EDUC":
      return <GraduationCap size={size} />;
    case "TECH":
      return <Microscope size={size} />;
    case "TRAN":
      return <Car size={size} />;
    case "AGRI":
      return <Tractor size={size} />;
    case "JUST":
      return <Scale size={size} />;
    case "HEAL":
      return <HeartPulse size={size} />;
    case "ENER":
      return <PlugZap size={size} />;
    default:
      return <Tag size={size} />;
  }
}