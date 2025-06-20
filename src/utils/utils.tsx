import { TicketData } from "../context/types";

export function getTicket() {
  const barcode = Math.random().toString().substring(2, 18).padEnd(16, "0");
  const timeOfEntry = new Date();

  const ticketData: TicketData = {
    barcode,
    timeOfEntry,
  };

  return ticketData;
}
