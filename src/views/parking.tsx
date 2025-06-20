import * as React from "react";
import styled from "styled-components";
import { useParking } from "../context/parkingContext";
import { ParkingSpace } from "../context/types";

function ParkingBox({
  parkingSpace,
}: {
  parkingSpace: ParkingSpace;
}): JSX.Element {
  const { park, selectTicket, activeTicketBarcode } = useParking();
  const { spaceNumber, ticket } = parkingSpace;
  const isActive = ticket === activeTicketBarcode;

  const handlePark = () => {
    if (!ticket) {
      park(spaceNumber);
    } else {
      selectTicket(ticket);
      console.log(
        `You have selected the ticket for space ${spaceNumber}: ${ticket}`
      );
    }
  };
  const className = `${ticket ? "occupied" : "free"} ${
    isActive ? "selected" : ""
  }`;
  return (
    <ParkingBoxContainer className={className} onClick={handlePark}>
      {spaceNumber}
    </ParkingBoxContainer>
  );
}

function InnerRow({
  start,
  end,
  first = false,
}: {
  start: number;
  end: number;
  first?: boolean;
}) {
  const { parkingSpaces } = useParking();
  const blank = [0, 1].map((idx) => <div key={idx} />);
  return (
    <InnerRowContainer first={first}>
      {blank}
      {parkingSpaces.slice(start, end).map((space) => (
        <ParkingBox key={space.spaceNumber} parkingSpace={space} />
      ))}
      {blank}
    </InnerRowContainer>
  );
}

function PaymentBox() {
  const { payTicket, activeTicketBarcode } = useParking();

  const handlePayment = (
    paymentMethod: "Credit Card" | "Debit Card" | "Cash"
  ) => {
    if (!activeTicketBarcode) {
      console.log(
        "No active ticket selected for payment. Please park a car first or select a ticket."
      );
      return;
    }
    try {
      const receipt = payTicket(activeTicketBarcode, paymentMethod);
      console.log(receipt);
    } catch (error: any) {
      console.log(`Payment failed: ${error.message}`);
    }
  };

  return (
    <PaymentBoxContainer>
      <span>Payment Box</span>
      <PaymentButton onClick={() => handlePayment("Credit Card")}>
        Credit Card
      </PaymentButton>
      <PaymentButton onClick={() => handlePayment("Debit Card")}>
        Debit Card
      </PaymentButton>
      <PaymentButton onClick={() => handlePayment("Cash")}>Cash</PaymentButton>
    </PaymentBoxContainer>
  );
}

function Gate() {
  const { getTicketState, leave, parkingSpaces, activeTicketBarcode } =
    useParking();

  const handleLeave = () => {
    if (!activeTicketBarcode) {
      console.log(
        "No active ticket selected. Please park a car first or select a ticket."
      );
      return;
    }

    try {
      const paymentStatus = getTicketState(activeTicketBarcode);

      if (paymentStatus === "Paid") {
        const spaceToLeave = parkingSpaces.find(
          (space) => space.ticket === activeTicketBarcode
        );

        if (spaceToLeave) {
          leave(spaceToLeave.spaceNumber);
          console.log(
            "Thank you for using our parking service! You may leave now."
          );
        } else {
          console.log(
            "Ticket is valid, but no car was found for this ticket. The car may have already left."
          );
        }
      } else {
        console.log(
          "Payment required or more than 15 minutes have passed since payment. Please pay at the payment box."
        );
      }
    } catch (error: any) {
      console.log(`Error: ${error.message}`);
    }
  };

  return <GateContainer onClick={handleLeave}>Gate</GateContainer>;
}
function OuterRow({ start, end }: { start: number; end: number }) {
  const { parkingSpaces } = useParking();
  return (
    <OuterRowContainer>
      {parkingSpaces.slice(start, end).map((space) => (
        <ParkingBox key={space.spaceNumber} parkingSpace={space} />
      ))}
    </OuterRowContainer>
  );
}

export default function ParkingView() {
  return (
    <Container>
      <Parking>
        <OuterRow start={0} end={16} />
        <div />
        <InnerRow first start={16} end={27} />
        <InnerRow start={27} end={38} />
        <div />
        <OuterRow start={38} end={54} />
        <PaymentBox />
        <Gate />
      </Parking>
      <Message>Please click on a parking place to park or leave.</Message>
    </Container>
  );
}

const Container = styled.div`
  margin: 64px 128px;
`;

const Message = styled.p`
  margin-top: 40px;
  text-align: center;
`;

const InteractiveBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #4682b4;
  border-radius: 8px;
  background-color: #e0e8f0;
  padding: 10px;
`;

const PaymentBoxContainer = styled(InteractiveBox)`
  grid-column: 2 / 3;
  grid-row: 3 / 4;
  flex-direction: column;
  justify-content: space-around;
  gap: 8px;
`;

const PaymentButton = styled.button`
  width: 90%;
  padding: 8px;
  font-size: 14px;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e9ecef;
  }
`;

const GateContainer = styled(InteractiveBox)`
  grid-column: 2 / 3;
  grid-row: 4 / 5;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b0c4de;
  }
`;

const Parking = styled.div`
  display: grid;
  grid-template-columns: 1fr 150px;
  grid-template-rows: 80px 100px 80px 80px 100px 80px;
  border: 1px solid var(--main-border);
  gap: 20px 40px;
  padding: 20px;

  & > *:not(${PaymentBoxContainer}):not(${GateContainer}) {
    grid-column: 1 / 2;
  }
`;

const OuterRowContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  & > div {
    height: 100%;
    flex: 1;
  }
  & > div:not(:last-of-type) {
    border-right: 1px solid black;
  }
`;

interface InnerRowContainerProps {
  readonly first?: boolean;
}

const InnerRowContainer = styled(OuterRowContainer)<InnerRowContainerProps>`
  & > div {
    border-bottom: ${(props) => (props.first ? "1px solid black" : "none")};
  }
  & > div:first-of-type,
  & > div:nth-of-type(14) {
    border-right: none;
  }
  & > div:first-of-type,
  & > div:nth-of-type(2),
  & > div:nth-of-type(14),
  & > div:nth-of-type(15) {
    border-bottom: none;
  }
`;

const ParkingBoxContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  height: 100%;
  &.free {
    background: var(--free-spot);
  }
  &.occupied {
    background: var(--occupied-spot);
  }
`;
