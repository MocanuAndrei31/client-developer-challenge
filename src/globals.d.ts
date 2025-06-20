import { ParkingSpace } from "./context/types";

declare global {
  interface Window {
    functions: {
      getFreeSpaces: (parkingSpaces: ParkingSpace) => number;
      getTicket: () => { barcode: string; timeOfEntry: Date };
      calculatePrice: (barcode: string) => number | string;
      payTicket: (barcode: string, paymentMethod: string) => string;
      getTicketState: (barcode: string) => "Paid" | "Not Paid" | null;
    };
  }
}

export {};
