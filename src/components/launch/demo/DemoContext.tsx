import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialDemoState,
  type DemoLaunch,
  type DemoLock,
  type DemoSale,
  type DemoState,
  type DemoTemplate,
  type LaunchDraft,
} from "./types";

const STORAGE_KEY = "mesh_blaze_demo_v1";

function loadState(): DemoState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialDemoState;
    const parsed = JSON.parse(saved) as Partial<DemoState>;
    return {
      templates: Array.isArray(parsed.templates)
        ? parsed.templates
        : initialDemoState.templates,
      launches: Array.isArray(parsed.launches)
        ? parsed.launches
        : initialDemoState.launches,
      locks: Array.isArray(parsed.locks) ? parsed.locks : [],
      sales: Array.isArray(parsed.sales) ? parsed.sales : [],
      draft:
        parsed.draft && typeof parsed.draft === "object"
          ? { ...initialDemoState.draft, ...parsed.draft }
          : initialDemoState.draft,
      reviewRequests: Array.isArray(parsed.reviewRequests)
        ? parsed.reviewRequests
        : [],
    };
  } catch {
    return initialDemoState;
  }
}

type DemoActions = {
  state: DemoState;
  setDraft: (draft: LaunchDraft) => void;
  addTemplate: (template: Omit<DemoTemplate, "id" | "createdAt">) => string;
  addLaunch: () => string;
  trade: (id: string, side: "buy" | "sell", amountBch: number) => void;
  graduate: (id: string) => void;
  claimFees: (id: string) => void;
  addLock: (lock: Omit<DemoLock, "id" | "claimed">) => void;
  claimLock: (id: string) => void;
  addSale: (sale: Omit<DemoSale, "id" | "depositedBch" | "status">) => void;
  depositSale: (id: string, amountBch: number) => void;
  settleSale: (id: string) => void;
  refundSale: (id: string) => void;
  requestReview: (id: string) => void;
  reset: () => void;
};

const Context = createContext<DemoActions | null>(null);
const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(loadState);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* Storage can be disabled. */
    }
  }, [state]);

  const value = useMemo<DemoActions>(
    () => ({
      state,
      setDraft: (draft) => setState((previous) => ({ ...previous, draft })),
      addTemplate: (template) => {
        const id = newId("template");
        setState((previous) => ({
          ...previous,
          templates: [
            { ...template, id, createdAt: new Date().toISOString() },
            ...previous.templates,
          ],
        }));
        return id;
      },
      addLaunch: () => {
        const id = newId("launch");
        setState((previous) => {
          const template =
            previous.templates.find(
              (item) => item.id === previous.draft.templateId,
            ) ?? previous.templates[0];
          const launch: DemoLaunch = {
            id,
            name: previous.draft.name.trim(),
            symbol: previous.draft.symbol.trim().toUpperCase(),
            supply: previous.draft.supply,
            templateId: template.id,
            curveShare: template.curveShare,
            thresholdBch: template.thresholdBch,
            feePercent: template.feePercent,
            lockPercent: template.lockPercent,
            raisedBch: 0,
            trades: 0,
            graduated: false,
            creatorFeesBch: 0,
            createdAt: new Date().toISOString(),
          };
          return { ...previous, launches: [launch, ...previous.launches] };
        });
        return id;
      },
      trade: (id, side, amountBch) =>
        setState((previous) => ({
          ...previous,
          launches: previous.launches.map((launch) => {
            if (
              launch.id !== id ||
              launch.graduated ||
              !Number.isFinite(amountBch) ||
              amountBch <= 0
            )
              return launch;
            const usedBch =
              side === "buy"
                ? Math.min(amountBch, launch.thresholdBch - launch.raisedBch)
                : Math.min(amountBch, launch.raisedBch);
            if (usedBch <= 0) return launch;
            const raisedBch =
              side === "buy"
                ? launch.raisedBch + usedBch
                : launch.raisedBch - usedBch;
            return {
              ...launch,
              raisedBch: Number(raisedBch.toFixed(8)),
              trades: launch.trades + 1,
              creatorFeesBch: Number(
                (
                  launch.creatorFeesBch +
                  (usedBch * launch.feePercent) / 100
                ).toFixed(8),
              ),
            };
          }),
        })),
      graduate: (id) =>
        setState((previous) => ({
          ...previous,
          launches: previous.launches.map((launch) =>
            launch.id === id && launch.raisedBch >= launch.thresholdBch
              ? { ...launch, graduated: true }
              : launch,
          ),
        })),
      claimFees: (id) =>
        setState((previous) => ({
          ...previous,
          launches: previous.launches.map((launch) =>
            launch.id === id ? { ...launch, creatorFeesBch: 0 } : launch,
          ),
        })),
      addLock: (lock) =>
        setState((previous) => ({
          ...previous,
          locks: [
            { ...lock, id: newId("lock"), claimed: false },
            ...previous.locks,
          ],
        })),
      claimLock: (id) =>
        setState((previous) => ({
          ...previous,
          locks: previous.locks.map((lock) =>
            lock.id === id && new Date(lock.unlockDate).getTime() <= Date.now()
              ? { ...lock, claimed: true }
              : lock,
          ),
        })),
      addSale: (sale) =>
        setState((previous) => ({
          ...previous,
          sales: [
            { ...sale, id: newId("sale"), depositedBch: 0, status: "Open" },
            ...previous.sales,
          ],
        })),
      depositSale: (id, amountBch) =>
        setState((previous) => ({
          ...previous,
          sales: previous.sales.map((sale) =>
            sale.id === id &&
            sale.status === "Open" &&
            Number.isFinite(amountBch) &&
            amountBch > 0
              ? {
                  ...sale,
                  depositedBch: Number(
                    (sale.depositedBch + amountBch).toFixed(8),
                  ),
                }
              : sale,
          ),
        })),
      settleSale: (id) =>
        setState((previous) => ({
          ...previous,
          sales: previous.sales.map((sale) =>
            sale.id === id &&
            sale.status === "Open" &&
            sale.depositedBch >= sale.targetBch
              ? { ...sale, status: "Settled" }
              : sale,
          ),
        })),
      refundSale: (id) =>
        setState((previous) => ({
          ...previous,
          sales: previous.sales.map((sale) =>
            sale.id === id && sale.status === "Open"
              ? { ...sale, status: "Refunded" }
              : sale,
          ),
        })),
      requestReview: (id) =>
        setState((previous) => ({
          ...previous,
          reviewRequests: previous.reviewRequests.includes(id)
            ? previous.reviewRequests
            : [...previous.reviewRequests, id],
        })),
      reset: () => setState(initialDemoState),
    }),
    [state],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error("useDemo must be used inside DemoProvider");
  return value;
}
