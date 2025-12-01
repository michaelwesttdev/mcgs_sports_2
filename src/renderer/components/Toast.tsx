import React from "react";
import { toast } from "sonner";

type Props = {
  variation: "error" | "info" | "success";
  message: string;
};

export function Toast({ variation, message }: Readonly<Props>) {
  let style: React.CSSProperties;
  switch (variation) {
    case "error": {
      style = {
        backgroundColor: "red",
        color: "white",
      };
      break;
    }
    case "success": {
      style = {
        backgroundColor: "green",
        color: "white",
      };
      break;
    }
  }
  return variation === "error"
    ? toast.error(message, {
        style,
      })
    : variation === "success"
    ? toast.success(message, {
        style,
      })
    : toast.info(message);
}
