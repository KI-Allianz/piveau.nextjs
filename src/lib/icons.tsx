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

export function getCategoryIcon(categoryId: string) {
  switch (categoryId) {
    case "GOVE":
      return <Landmark size={12} />;
    case "REGI":
      return <MapPinned size={12} />;
    case "SOCI":
      return <Users size={12} />;
    case "ECON":
      return <Euro size={12} />;
    case "ENVI":
      return <Leaf size={12} />;
    case "EDUC":
      return <GraduationCap size={12} />;
    case "TECH":
      return <Microscope size={12} />;
    case "TRAN":
      return <Car size={12} />;
    case "AGRI":
      return <Tractor size={12} />;
    case "JUST":
      return <Scale size={12} />;
    case "HEAL":
      return <HeartPulse size={12} />;
    case "ENER":
      return <PlugZap size={12} />;
    default:
      return <Tag size={12} />;
  }
}