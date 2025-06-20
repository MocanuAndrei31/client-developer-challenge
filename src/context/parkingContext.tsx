import * as React from "react";
import { PARKING_CAPACITY } from "../config";
import { ParkingContextType, ParkingSpace } from "./types";
import { getTicket, getTicketState, payTicket } from "../utils/utils";

export const ParkingContext = React.createContext<
  ParkingContextType | undefined
>(undefined);

function initParking(): ParkingSpace[] {
  return [...Array(PARKING_CAPACITY)].map((_, idx: number) => ({
    spaceNumber: idx + 1,
    ticket: null,
  }));
}

export function ParkingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [parkingSpaces, setParkingSpaces] = React.useState(initParking());
  const [activeTicketBarcode, setActiveTicketBarcode] = React.useState<
    string | null
  >(null);
  const selectTicket = (barcode: string | null) => {
    setActiveTicketBarcode(barcode);
  };

  const updateParkingSpace = (spaceNumber: number, ticket: string | null) => {
    setParkingSpaces((prev: ParkingSpace[]) =>
      prev.map((space) =>
        space.spaceNumber === spaceNumber ? { ...space, ticket } : space
      )
    );
  };

  const park = async (spaceNumber: number) => {
    const space = parkingSpaces.find(
      (space) => space.spaceNumber === spaceNumber
    );
    if (space && !space.ticket) {
      const { barcode, timeOfEntry } = getTicket();
      console.log(
        `Parking space ${spaceNumber} assigned ticket: ${barcode} at ${timeOfEntry}`
      );

      const p = new Promise((resolve) =>
        resolve(updateParkingSpace(spaceNumber, barcode))
      );
      selectTicket(barcode);
      console.log(
        "You have parked your car in space:",
        spaceNumber,
        "with ticket:",
        barcode,
        "in order to pay, you have to pay at the parking machine."
      );

      return await p;
    } else {
      throw new Error("Parking space is already occupied or does not exist.");
    }
  };

  const leave = async (spaceNumber: number) => {
    const p = new Promise((resolve) =>
      resolve(updateParkingSpace(spaceNumber, null))
    );
    selectTicket(null);
    console.log(`Parking space ${spaceNumber} is now free.`);
    return await p;
  };

  const initialState: ParkingContextType = {
    parkingSpaces,
    park,
    leave,
    payTicket,
    getTicketState,
    activeTicketBarcode,
    selectTicket,
  };

  return (
    <ParkingContext.Provider value={initialState}>
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking(): ParkingContextType {
  const context = React.useContext(ParkingContext);
  if (context === undefined) {
    throw new Error("useParking called outside context.");
  }

  return context;
}
