export interface ParkingSpace {
  spaceNumber: number;
  ticket: string | null;
}

export interface TicketData {
  barcode: string;
  timeOfEntry: Date;
  paid: boolean;
  paymentMethod?: string;
  paymentTime?: Date;
}

export interface ParkingContextType {
  parkingSpaces: ParkingSpace[];
  park: (spaceNumber: number) => void;
  leave: (spaceNumber: number) => void;
}
