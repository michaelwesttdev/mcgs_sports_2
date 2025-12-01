import { addDays } from "date-fns";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DateFormats } from "../constants/constants";
dayjs.extend(customParseFormat);
export function dateToString(date: Date): string {
  const d = date.toISOString().slice(0, 10);
  return d;
}
export function stringDateToDate(date: string): Date {
  const d = new Date(date);
  return d;
}
export function addDaysToDate(date: Date, days: number) {
  const newDate = addDays(date, days);
  return newDate;
}
export function getAge(dob:string){
  const dobDate = stringDateToDate(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  return age;
}

export function getDayJsDate(date: string | Date,dateFormat="YYYY-MM-DD"): dayjs.Dayjs {
  if (typeof date === 'string') {
    
    const parsed = dayjs(date, dateFormat, true);
    if (parsed.isValid()) {
      return parsed;
    }
} else if (date instanceof Date) {
    return dayjs(date);
  }
  const fallback = dayjs(date);
  return fallback.isValid() ? fallback : null;
}
export function formatDateToISO(input: string, format: string): string | null {
  const formatParts = format.split(/[^A-Za-z]/);   // e.g. ['dd', 'MM', 'yyyy']
  const dateParts = input.split(/[^0-9]/);          // e.g. ['26', '3', '2012']

  if (formatParts.length !== dateParts.length) return null;

  let day = '';
  let month = '';
  let year = '';

  for (let i = 0; i < formatParts.length; i++) {
    const part = formatParts[i].toLowerCase();
    const value = dateParts[i].padStart(2, '0'); // Ensure 2-digit day/month

    if (part === 'dd' || part === 'd') day = value;
    else if (part === 'mm' || part === 'm') month = value;
    else if (part === 'yyyy') year = value;
    else if (part === 'yy') year = `20${value}`;
  }

  if (!day || !month || !year) return null;

  return `${year}-${month}-${day}`;
}
