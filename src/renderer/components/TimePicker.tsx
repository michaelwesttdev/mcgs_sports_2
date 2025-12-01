import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import React, { useState } from "react";

type Unit = "days" | "hours" | "minutes" | "seconds" | "milliseconds";

const UNIT_LABELS: Record<Unit, string> = {
  days: "Days",
  hours: "Hrs",
  minutes: "Min",
  seconds: "Sec",
  milliseconds: "Ms",
};

export const TimeOtpInput: React.FC<{
  onChange?: (val: string) => void;
  value?: string;
  format?:"DD:HH:mm:ss.SS" | "mm:ss.SS" | "ss.SS" | "HH:mm:ss.SS" | "mm:ss.SS";
}> = ({ onChange, value,format="HH:mm:ss.SS" }) => {
  const [time, setTime] = useState<Record<Unit, string>>({
    days: "",
    hours:"",
    minutes: "",
    seconds: "",
    milliseconds:"",
  });
  const lastFormatted = React.useRef("");

  const handleChange = (unit: Unit, value: string) => {
    if (!/^[0-9]*$/.test(value)) return; // only allow digits

    const updated = { ...time, [unit]: value };
    setTime(updated);

    // Only pad and format if all relevant fields are filled
    let formatted = "";
    if (format === "DD:HH:mm:ss.SS") {
      if (updated.days.length === 2 && updated.hours.length === 2 && updated.minutes.length === 2 && updated.seconds.length === 2) {
        formatted = `${updated.days.padStart(2, "0")}:${updated.hours.padStart(2, "0")}:${updated.minutes.padStart(2, "0")}:${updated.seconds.padStart(2, "0")}`;
        if (updated.milliseconds) formatted += "." + updated.milliseconds.padStart(2, "0");
      }
    } else if (format === "HH:mm:ss.SS") {
      if (updated.hours.length === 2 && updated.minutes.length === 2 && updated.seconds.length === 2) {
        formatted = `${updated.hours.padStart(2, "0")}:${updated.minutes.padStart(2, "0")}:${updated.seconds.padStart(2, "0")}`;
        if (updated.milliseconds) formatted += "." + updated.milliseconds.padStart(2, "0");
      }
    } else if (format === "mm:ss.SS") {
      if (updated.minutes.length === 2 && updated.seconds.length === 2) {
        formatted = `${updated.minutes.padStart(2, "0")}:${updated.seconds.padStart(2, "0")}`;
        if (updated.milliseconds) formatted += "." + updated.milliseconds.padStart(2, "0");
      }
    } else if (format === "ss.SS") {
      if (updated.seconds.length === 2) {
        formatted = `${updated.seconds.padStart(2, "0")}`;
        if (updated.milliseconds) formatted += "." + updated.milliseconds.padStart(2, "0");
      }
    }
    if (formatted && formatted !== lastFormatted.current) {
      lastFormatted.current = formatted;
      onChange?.(formatted);
    }
  };

  const handleBlur = () => {
    // On blur, pad and format the value and send to parent
    let formatted = "";
    if (format === "DD:HH:mm:ss.SS") {
      formatted = `${(time.days || "0").padStart(2, "0")}:${(time.hours || "0").padStart(2, "0")}:${(time.minutes || "0").padStart(2, "0")}:${(time.seconds || "0").padStart(2, "0")}`;
      if (time.milliseconds) formatted += "." + (time.milliseconds || "0").padStart(2, "0");
    } else if (format === "HH:mm:ss.SS") {
      formatted = `${(time.hours || "0").padStart(2, "0")}:${(time.minutes || "0").padStart(2, "0")}:${(time.seconds || "0").padStart(2, "0")}`;
      if (time.milliseconds) formatted += "." + (time.milliseconds || "0").padStart(2, "0");
    } else if (format === "mm:ss.SS") {
      formatted = `${(time.minutes || "0").padStart(2, "0")}:${(time.seconds || "0").padStart(2, "0")}`;
      if (time.milliseconds) formatted += "." + (time.milliseconds || "0").padStart(2, "0");
    } else if (format === "ss.SS") {
      formatted = `${(time.seconds || "0").padStart(2, "0")}`;
      if (time.milliseconds) formatted += "." + (time.milliseconds || "0").padStart(2, "0");
    }
    lastFormatted.current = formatted;
    onChange?.(formatted);
  };

  React.useEffect(() => {
    if (!value || value === lastFormatted.current) return;
    let d = "", h = "", m = "", s = "", ms = "";
    let main = value;
    // Split milliseconds if present
    if (main.includes(".")) {
      const parts = main.split(".");
      main = parts[0];
      ms = parts[1] || "";
    }
    const segments = main.split(":");
    // Always fill from the right (reverse traversal)
    const fill = (fields: string[]) => {
      const result = Array(fields.length).fill("");
      for (let i = 0; i < segments.length; i++) {
        result[fields.length - 1 - i] = segments[segments.length - 1 - i] || "";
      }
      return result;
    };
    if (format === "DD:HH:mm:ss.SS") {
      [d, h, m, s] = fill(["days", "hours", "minutes", "seconds"]);
    } else if (format === "HH:mm:ss.SS") {
      [h, m, s] = fill(["hours", "minutes", "seconds"]);
    } else if (format === "mm:ss.SS") {
      [m, s] = fill(["minutes", "seconds"]);
    } else if (format === "ss.SS") {
      [s] = fill(["seconds"]);
    }
    setTime({ days: d || "", hours: h || "", minutes: m || "", seconds: s || "", milliseconds: ms || "" });
  }, [value, format]);

  return (
    <div className="flex items-center gap-4">
      {Object.entries(UNIT_LABELS).filter(([unit]) => {
        if (unit === "hours" && !format.includes("HH")) return false;
        if (unit === "days" && !format.includes("DD")) return false;
        if (unit === "minutes" && !format.includes("mm")) return false;
        if (unit === "seconds" && !format.toLowerCase().includes("ss")) return false;
        if (unit === "milliseconds" && !format.includes("SS")) return false;
        return true;
      }).map(([unit, label]) => (
        <div key={unit} className="flex flex-col gap-1 items-center">
          <Label htmlFor={unit}>{label}</Label>
          <Input
            id={unit}
            type="text"
            inputMode="numeric"
            value={time[unit as Unit]}
            onChange={(e) => handleChange(unit as Unit, e.target.value)}
            onBlur={handleBlur}
            placeholder="0"
            maxLength={unit === "days" ? 4 : 2}
            className={`${unit==="days"?"max-w-28 w-28":"max-w-14 w-14"}`}
          />
        </div>
      ))}
    </div>
  );
};
