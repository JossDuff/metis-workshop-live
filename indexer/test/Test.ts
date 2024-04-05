import assert = require("assert")
import { MockDb, Hum } from "../generated/src/TestHelpers.gen";
import {
  EventsSummaryEntity,
  Hum_TransferEntity,
} from "../generated/src/Types.gen";

import { Addresses } from "../generated/src/bindings/Ethers.bs";

import { GLOBAL_EVENTS_SUMMARY_KEY } from "../src/EventHandlers";


const MOCK_EVENTS_SUMMARY_ENTITY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  hum_TransferCount: BigInt(0),
};

describe("Hum contract Transfer event tests", () => {
  // Create mock db
  const mockDbInitial = MockDb.createMockDb();

  // Add mock EventsSummaryEntity to mock db
  const mockDbFinal = mockDbInitial.entities.EventsSummary.set(
    MOCK_EVENTS_SUMMARY_ENTITY
  );

  // Creating mock Hum contract Transfer event
  const mockHumTransferEvent = Hum.Transfer.createMockEvent({
    from: Addresses.defaultAddress,
    to: Addresses.defaultAddress,
    amount: 0n,
    mockEventData: {
      chainId: 1,
      blockNumber: 0,
      blockTimestamp: 0,
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      srcAddress: Addresses.defaultAddress,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionIndex: 0,
      logIndex: 0,
    },
  });

  // Processing the event
  const mockDbUpdated = Hum.Transfer.processEvent({
    event: mockHumTransferEvent,
    mockDb: mockDbFinal,
  });

  it("Hum_TransferEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualHumTransferEntity = mockDbUpdated.entities.Hum_Transfer.get(
      mockHumTransferEvent.transactionHash +
        mockHumTransferEvent.logIndex.toString()
    );

    // Creating the expected entity
    const expectedHumTransferEntity: Hum_TransferEntity = {
      id:
        mockHumTransferEvent.transactionHash +
        mockHumTransferEvent.logIndex.toString(),
      from: mockHumTransferEvent.params.from,
      to: mockHumTransferEvent.params.to,
      amount: mockHumTransferEvent.params.amount,
      eventsSummary: "GlobalEventsSummary",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualHumTransferEntity, expectedHumTransferEntity, "Actual HumTransferEntity should be the same as the expectedHumTransferEntity");
  });

  it("EventsSummaryEntity is updated correctly", () => {
    // Getting the actual entity from the mock database
    let actualEventsSummaryEntity = mockDbUpdated.entities.EventsSummary.get(
      GLOBAL_EVENTS_SUMMARY_KEY
    );

    // Creating the expected entity
    const expectedEventsSummaryEntity: EventsSummaryEntity = {
      ...MOCK_EVENTS_SUMMARY_ENTITY,
      hum_TransferCount: MOCK_EVENTS_SUMMARY_ENTITY.hum_TransferCount + BigInt(1),
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualEventsSummaryEntity, expectedEventsSummaryEntity, "Actual HumTransferEntity should be the same as the expectedHumTransferEntity");
  });
});
