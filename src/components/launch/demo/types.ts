export type DemoTemplate = {
  id: string;
  name: string;
  partner: string;
  quote: "BCH";
  curveShare: number;
  thresholdBch: number;
  feePercent: number;
  lockPercent: number;
  createdAt: string;
};

export type DemoLaunch = {
  id: string;
  name: string;
  symbol: string;
  supply: number;
  templateId: string;
  curveShare: number;
  thresholdBch: number;
  feePercent: number;
  lockPercent: number;
  raisedBch: number;
  trades: number;
  graduated: boolean;
  creatorFeesBch: number;
  createdAt: string;
};

export type DemoLock = {
  id: string;
  token: string;
  amount: number;
  beneficiary: string;
  unlockDate: string;
  claimed: boolean;
};

export type DemoSale = {
  id: string;
  name: string;
  token: string;
  mode: "Presale" | "Alpha allocation" | "Alpha pool buy";
  targetBch: number;
  depositedBch: number;
  status: "Draft" | "Open" | "Settled" | "Refunded";
};

export type LaunchDraft = {
  name: string;
  symbol: string;
  supply: number;
  templateId: string;
  description: string;
};

export type DemoState = {
  templates: DemoTemplate[];
  launches: DemoLaunch[];
  locks: DemoLock[];
  sales: DemoSale[];
  draft: LaunchDraft;
  reviewRequests: string[];
};

export const initialDemoState: DemoState = {
  templates: [
    {
      id: "quick-bch",
      name: "Quick BCH launch",
      partner: "Mesh reference",
      quote: "BCH",
      curveShare: 70,
      thresholdBch: 0.5,
      feePercent: 1,
      lockPercent: 90,
      createdAt: "2026-11-17",
    },
    {
      id: "community-bch",
      name: "Community launch",
      partner: "Mesh reference",
      quote: "BCH",
      curveShare: 60,
      thresholdBch: 1,
      feePercent: 0.75,
      lockPercent: 100,
      createdAt: "2026-11-17",
    },
  ],
  launches: [
    {
      id: "sample-mesh",
      name: "Mesh Sample",
      symbol: "SAMPLE",
      supply: 1_000_000,
      templateId: "quick-bch",
      curveShare: 70,
      thresholdBch: 0.5,
      feePercent: 1,
      lockPercent: 90,
      raisedBch: 0.18,
      trades: 12,
      graduated: false,
      creatorFeesBch: 0.0018,
      createdAt: "2026-11-17",
    },
  ],
  locks: [],
  sales: [],
  draft: {
    name: "",
    symbol: "",
    supply: 1_000_000,
    templateId: "quick-bch",
    description: "",
  },
  reviewRequests: [],
};
