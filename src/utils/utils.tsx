import { TicketData } from "../context/types";

export function getTicket() {
  const barcode = Math.random().toString().substring(2, 18).padEnd(16, "0");
  const timeOfEntry = new Date();

  const ticketData: TicketData = {
    barcode,
    timeOfEntry,
    paid: false,
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

  return ticketData.paid === true ? 0 : price;
}

export function payTicket(barcode: string, paymentMethod: string) {
  const ticket = sessionStorage.getItem(`barcode-${barcode}`);
  if (!ticket) {
    throw new Error("No ticket found for this barcode.");
  }

  const ticketData: TicketData = JSON.parse(ticket);
  const price = calculatePrice(ticketData.barcode);
  const paymentTime = new Date();

  console.log(
    `Paying ${price} $ for ticket ${barcode} using ${paymentMethod}.`
  );

  ticketData.paid = true;
  ticketData.paymentMethod = paymentMethod;
  ticketData.paymentTime = paymentTime;

  sessionStorage.setItem(`barcode-${barcode}`, JSON.stringify(ticketData));

  const receipt = `
    Parking receipt no. ${Math.random()
      .toString()
      .substring(2, 10)
      .padEnd(8, "0")}
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Ticket Barcode: ${barcode}
    Time of Entry: ${new Date(ticketData.timeOfEntry).toLocaleString()}
    Time of Leave: ${paymentTime.toLocaleString()}
    Payment Method: ${ticketData.paymentMethod}
    Total Price: $${price}

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  `;
  console.log("Thank you for using our parking service!", receipt);

  return receipt;
}
