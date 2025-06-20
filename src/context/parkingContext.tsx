import * as React from "react";
import { PARKING_CAPACITY } from "../config";
import { ParkingContextType, ParkingSpace } from "./types";
import { getTicket } from "../utils/utils";

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

  const updateParkingSpace = (
    spaceNumber: number,
    ticket: string | null,
    timestamp: Date
  ) => {
    setParkingSpaces((prev: ParkingSpace[]) =>
      prev.map((space) =>
        space.spaceNumber === spaceNumber
          ? { ...space, ticket, timestamp }
          : space
      )
    );
  };

  const park = async (spaceNumber: number) => {
    const { barcode, timeOfEntry } = getTicket();
    console.log(
      `Parking space ${spaceNumber} assigned ticket: ${barcode} at ${timeOfEntry}`
    );
    sessionStorage.setItem(
      `parkingSpace-${spaceNumber}`,
      JSON.stringify({
        barcode,
        timeOfEntry,
      })
    );
    const p = new Promise((resolve) =>
      resolve(updateParkingSpace(spaceNumber, barcode, timeOfEntry))
    );
    return await p;
  };

  const leave = async (spaceNumber: number) => {
    const ticketData = sessionStorage.getItem(`parkingSpace-${spaceNumber}`);
    const { barcode } = JSON.parse(ticketData || "");
    console.log(
      `Leaving parking space ${spaceNumber} with ticket: ${barcode} at ${new Date()}`
    );
    const p = new Promise((resolve) =>
      resolve(updateParkingSpace(spaceNumber, null, new Date()))
    );
    return await p;
  };

  const initialState: ParkingContextType = {
    parkingSpaces,
    park,
    leave,
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
