import { Calendar, CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";

import { Dataset } from "@piveau/sdk-core";
import { parseDate } from "@/lib/utils";

export function useDateDisplayMode() {
  const [showAge, setShowAge] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setShowAge(localStorage.getItem("showDateAge") === "true");
    };
    handleStorageChange();

    // Listen for cross-tab changes and custom event
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage-update", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage-update", handleStorageChange);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newValue = !showAge;
    localStorage.setItem("showDateAge", String(newValue));

    // Notify all other components in the same tab
    window.dispatchEvent(new Event("local-storage-update"));
  };

  return { showAge, toggle };
}

interface Props {
  modified?: Dataset["modified"];
  issued?: Dataset["issued"];
}

export default function DateBadge({ modified, issued }: Props) {
  const { showAge, toggle } = useDateDisplayMode();

  const date = parseDate(modified) || parseDate(issued);

  const getAge = () => {
    if (!date) return null;
    const diffTime = Math.abs(new Date().getTime() - date.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
  const age = getAge();

  return (
    <div
      className="flex items-center gap-2 font-semibold group transition-all duration-200 hover:bg-secondary cursor-pointer rounded-lg p-1"
      onClick={(e) => toggle(e)}
    >
      <div className="bg-black text-white p-1.5 rounded-xl w-fit group-hover:bg-black/80 transition-all duration-200">
        {showAge ? <CalendarClock size={18} /> : <Calendar size={18} />}
      </div>
      <span className="line-clamp-1">
        {showAge && age !== null
          ? `${age} days ago`
          : date?.toLocaleDateString()}
      </span>
    </div>
  );
}
