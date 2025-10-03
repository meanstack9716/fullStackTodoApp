import moment from "moment";

export function formatDateForInput(date: string | Date) {
  if (!date) return "";
  return moment(date).format("YYYY-MM-DDTHH:mm");
}
