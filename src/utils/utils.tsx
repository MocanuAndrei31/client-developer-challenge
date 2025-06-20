import { TicketData } from "../context/types";

export function getTicket() {
  const barcode = Math.random().toString().substring(2, 18).padEnd(16, "0");
  const timeOfEntry = new Date();

  const ticketData: TicketData = {
    barcode,
    timeOfEntry,
  };
  sessionStorage.setItem(`barcode-${barcode}`, JSON.stringify(ticketData));
  return ticketData;
}

export function calculatePrice(barcode: string) {
  const ticket = sessionStorage.getItem(`barcode-${barcode}`);
  const ticketData: TicketData = ticket ? JSON.parse(ticket) : null;

  if (!ticketData) {
    return "No ticket found";
  }
  const timeOfEntry = new Date(ticketData.timeOfEntry);
  const timeOfLeave = new Date();

  const duration = (timeOfLeave.getTime() - timeOfEntry.getTime()) / 1000 / 60;

  const pricePerHour = 2;
  const price = Math.ceil(duration / 60) * pricePerHour;

  return price;
}
