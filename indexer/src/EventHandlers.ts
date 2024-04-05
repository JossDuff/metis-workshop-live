/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  HumContract,
} from "../generated/src/Handlers.gen";

import {
  Hum_TransferEntity,
  EventsSummaryEntity,
  TraderEntity
} from "../generated/src/Types.gen";

export const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  hum_TransferCount: BigInt(0),
};

const INITIAL_TRADER: TraderEntity = {
  id: "0x0",
  num_transfers: BigInt(0),
}

HumContract.Transfer.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
  context.Trader.load(event.params.from.toString())
});

HumContract.Transfer.handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    hum_TransferCount: currentSummaryEntity.hum_TransferCount + BigInt(1),
  };

  const hum_TransferEntity: Hum_TransferEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    from: event.params.from,
    to: event.params.to,
    amount: event.params.amount,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Hum_Transfer.set(hum_TransferEntity);

  // trader logic
  const traderAddress = event.params.from.toString();
  const trader = context.Trader.get(traderAddress);
  const currentTrader: TraderEntity = trader ?? INITIAL_TRADER;

  const updatedTrader: TraderEntity = {
    id: traderAddress,
    num_transfers: currentTrader.num_transfers + BigInt(1)
  }

  context.Trader.set(updatedTrader);

});
