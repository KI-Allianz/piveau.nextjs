"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

type Granularity = "year" | "year-month" | "date" | "datetime";

interface TemporalInputProps {
  value?: string;
  onChange: (value?: string) => void;
  label: string;
  description?: string;
  error?: any;
}

export function TemporalInput({
  value,
  onChange,
  label,
  description,
  error,
}: TemporalInputProps) {
  // Infer initial granularity based on the string length/format if editing an existing value
  const getInitialGranularity = (val?: string): Granularity => {
    if (!val) return "date"; // default

    if (/^\d{4}$/.test(val)) return "year";
    if (/^\d{4}-\d{2}$/.test(val)) return "year-month";
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return "date";
    if (val.includes("T")) return "datetime";
    return "date"; // default
  };

  const [granularity, setGranularity] = React.useState<Granularity>(() =>
    getInitialGranularity(value),
  );

  // Split value for year-month granularity (e.g. "2026-10" -> ["2026", "10"])
  const [yearPart = "", monthPart = ""] =
    granularity === "year-month" && value ? value.split("-") : ["", ""];

  // Helper to get local timezone offset string for datetime-local conversion
  const toLocalISOString = (date: Date) => {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? "+" : "-";
    const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
    const iso =
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds());
    return `${iso}${diff}${pad(tzOffset / 60)}:${pad(tzOffset % 60)}`;
  };

  // Convert incoming ISO datetime-local to format expected by input type="datetime-local" (YYYY-MM-DDTHH:mm)
  const formatForInput = (val: string, gran: Granularity) => {
    if (!val) return "";
    if (gran === "datetime" && val.includes("T")) {
      return val.slice(0, 16); // datetime-local expects YYYY-MM-DDTHH:mm
    }
    return val;
  };

  // Intelligently convert or truncate the existing value when switching granularities
  const convertValueForGranularity = (
    val: string | undefined,
    targetGran: Granularity,
  ): string | undefined => {
    if (!val) return undefined;

    // Extract existing parts using regex
    const match = val.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?(?:T(.*))?$/);
    const y = match ? match[1] : "";
    const m = match && match[2] ? match[2] : "01";
    const d = match && match[3] ? match[3] : "01";

    const currentYear = new Date().getFullYear().toString();
    const targetY = y || currentYear;

    switch (targetGran) {
      case "year":
        return y;
      case "year-month":
        return y ? `${y}-${m}` : undefined;
      case "date":
        if (y && match && match[2]) {
          return `${y}-${match[2]}-${d}`;
        }
        return y ? `${y}-${m}-${d}` : undefined;
      case "datetime": {
        const datePart =
          y && match && match[2] && match[3]
            ? `${y}-${match[2]}-${match[3]}`
            : y
              ? `${y}-${m}-${d}`
              : `${targetY}-01-01`;
        const timePart = match && match[4] ? match[4] : "00:00:00Z";
        return `${datePart}T${timePart}`;
      }
    }
  };

  const handleGranularityChange = (newGran: Granularity) => {
    const convertedValue = convertValueForGranularity(
      value,
      newGran as Granularity,
    );
    setGranularity(newGran as Granularity);
    onChange(convertedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (!rawVal) {
      onChange(undefined);
      return;
    }

    if (granularity === "datetime") {
      const d = new Date(rawVal);
      if (!isNaN(d.getTime())) {
        onChange(toLocalISOString(d));
      } else {
        onChange(rawVal);
      }
    } else {
      onChange(rawVal);
    }
  };

  const handleYearPartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = e.target.value;
    const paddedMonth = monthPart ? monthPart.padStart(2, "0") : "01";
    if (!newYear && !monthPart) {
      onChange("");
    } else {
      onChange(`${newYear}-${paddedMonth}`);
    }
  };

  const handleMonthPartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value;
    const paddedMonth = newMonth ? newMonth.padStart(2, "0") : "";
    if (!yearPart && !newMonth) {
      onChange("");
    } else {
      onChange(`${yearPart}-${paddedMonth}`);
    }
  };

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}

      <div className="flex gap-2 mt-1">
        <Select value={granularity} onValueChange={handleGranularityChange}>
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="Granularity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="year-month">Year & Month</SelectItem>
            <SelectItem value="date">Exact Date</SelectItem>
            <SelectItem value="datetime">Date & Time</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1">
          {granularity === "year" && (
            <Input
              type="number"
              placeholder="e.g. 2026"
              min="1000"
              max="9999"
              value={value}
              onChange={handleInputChange}
            />
          )}

          {granularity === "year-month" && (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Year (e.g. 2026)"
                min="1000"
                max="9999"
                value={yearPart}
                onChange={handleYearPartChange}
                className="flex-2"
              />
              <Input
                type="number"
                placeholder="Month (1-12)"
                min="1"
                max="12"
                value={monthPart ? parseInt(monthPart, 10) : ""}
                onChange={handleMonthPartChange}
                className="flex-1"
              />
            </div>
          )}

          {granularity === "date" && (
            <Input type="date" value={value} onChange={handleInputChange} />
          )}

          {granularity === "datetime" && (
            <Input
              type="datetime-local"
              value={formatForInput(value, granularity)}
              onChange={handleInputChange}
            />
          )}
        </div>
      </div>

      {error && <FieldError errors={[error]} />}
    </Field>
  );
}
