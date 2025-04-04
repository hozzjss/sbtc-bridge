type EmilyTxBase = {
  bitcoinTxid: string;
  bitcoinTxOutputIndex: number;
  recipient: string;
  amount: number;
  lastUpdateHeight: number;
  lastUpdateBlockHash: string;
  statusMessage: string;
  parameters: Parameters;
  reclaimScript: string;
  depositScript: string;
};

type EmilyTxPending = EmilyTxBase & {
  status: "pending";
};

type EmilyTxAccepted = EmilyTxBase & {
  status: "accepted";
};

export type EmilyTxConfirmed = EmilyTxBase & {
  status: "confirmed";
  fulfillment: Fulfillment;
};

type EmilyTxRes = EmilyTxPending | EmilyTxAccepted | EmilyTxConfirmed;

type Fulfillment = {
  BitcoinTxid: string;
  BitcoinTxIndex: number;
  StacksTxid: string;
  BitcoinBlockHash: string;
  BitcoinBlockHeight: number;
  BtcFee: number;
};

type Parameters = {
  maxFee: number;
  lockTime: number;
};

export const getEmilyDepositInfo = async ({ txId }: { txId: string }) => {
  const searchParams = new URLSearchParams();
  searchParams.append("bitcoinTxid", txId);
  searchParams.append("vout", "0");
  const response = await fetch(`/api/emilyDeposit?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()) as EmilyTxRes;
  return data;
};
