import { useState } from "react";
import { useDemo } from "../demo/DemoContext";
import type { DemoLaunch } from "../demo/types";
import {
  Badge,
  EmptyState,
  Field,
  LabelValue,
  Metric,
  Notice,
  Page,
  Panel,
  Progress,
  inputClass,
  primaryClass,
  secondaryClass,
} from "../ui/Primitives";

const CHIPNET = "https://chipnet.imaginary.cash/tx/";
const E1_CATEGORY =
  "a724ecf34e5dbc9d8e7c85d02d8fa0f9a221eded0537123639efa4dc571ea671";

export function LaunchDirectory() {
  const { state } = useDemo();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "curve" | "graduated">("all");
  const shown = state.launches.filter(
    (launch) =>
      (filter === "all" ||
        (filter === "graduated" ? launch.graduated : !launch.graduated)) &&
      `${launch.name} ${launch.symbol}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <Page
      eyebrow="Discover"
      title="Launch directory"
      description="Explore browser-local demo launches and a separate, independently checkable Chipnet case study."
      actions={
        <a href="/launch/new" className={primaryClass}>
          Preview a launch
        </a>
      }
    >
      <Notice>
        Items marked “Demo” exist only in this browser. They are not BCH tokens,
        active curves, or live markets.
      </Notice>
      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
        <Field label="Search demo launches">
          <input
            className={inputClass}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name or ticker"
          />
        </Field>
        <Field label="Lifecycle">
          <select
            className={inputClass}
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            <option value="all">All stages</option>
            <option value="curve">On curve</option>
            <option value="graduated">Graduated</option>
          </select>
        </Field>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <a
          href="/launch/examples/e1"
          className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-6 transition-colors hover:border-emerald-500"
        >
          <Badge tone="green">Confirmed Chipnet evidence</Badge>
          <h2 className="mt-5 text-xl font-semibold">
            BCH-quoted E1 lifecycle
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Review real genesis, curve, graduation, locked market, and fee-claim
            transactions.
          </p>
          <p className="mt-5 text-sm font-semibold">View case study</p>
        </a>
        {shown.map((launch) => (
          <a
            key={launch.id}
            href={`/launch/${launch.id}`}
            className="rounded-2xl border border-slate-300 bg-white p-6 transition-colors hover:border-emerald-500 dark:border-slate-700 dark:bg-[#131722]"
          >
            <div className="flex justify-between gap-2">
              <Badge tone="blue">Browser demo</Badge>
              <Badge tone={launch.graduated ? "green" : "amber"}>
                {launch.graduated ? "Graduated" : "On curve"}
              </Badge>
            </div>
            <h2 className="mt-5 text-xl font-semibold">{launch.name}</h2>
            <p className="mt-1 font-mono text-sm text-slate-500">
              {launch.symbol}
            </p>
            <div className="mt-6">
              <Progress
                value={(launch.raisedBch / launch.thresholdBch) * 100}
                label="Demo graduation progress"
              />
            </div>
            <p className="mt-5 text-sm font-semibold">Open launch</p>
          </a>
        ))}
      </div>
      {shown.length === 0 && (
        <div className="mt-5">
          <EmptyState
            title="No demo launches match"
            description="Try another search or create a browser-only launch."
          />
        </div>
      )}
    </Page>
  );
}

function LaunchNotFound() {
  return (
    <Page eyebrow="Launch" title="Launch not found">
      <EmptyState
        title="No matching demo launch"
        description="This browser has no launch with that ID. Demo data stays in local storage and does not sync between devices."
        action={
          <a className={secondaryClass} href="/launch/tokens">
            Open directory
          </a>
        }
      />
    </Page>
  );
}

export function LaunchDetail({ id }: { id: string }) {
  const { state, trade, graduate } = useDemo();
  const launch = state.launches.find((item) => item.id === id);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState(0.05);
  const [message, setMessage] = useState("");
  if (!launch) return <LaunchNotFound />;
  const remaining = Math.max(0, launch.thresholdBch - launch.raisedBch);
  const validAmount = Number.isFinite(amount) && amount > 0;
  return (
    <Page
      eyebrow="Browser demo launch"
      title={`${launch.name} · ${launch.symbol}`}
      description="Explore a simulated token lifecycle. The values below are local UI state, not live reserves or trade quotes."
      actions={
        <>
          <a className={secondaryClass} href={`/launch/${id}/manage`}>
            Manage demo
          </a>
          <a className={secondaryClass} href={`/launch/${id}/proof`}>
            Rights and proof
          </a>
        </>
      }
    >
      <Notice>
        Demo trading does not sign or broadcast transactions. Entered BCH
        amounts change a simplified progress model only; no token output,
        slippage, or contract price is calculated.
      </Notice>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Quote collected"
          value={`${launch.raisedBch.toFixed(4)} BCH`}
        />
        <Metric label="Target" value={`${launch.thresholdBch} BCH`} />
        <Metric label="Demo trades" value={String(launch.trades)} />
        <Metric
          label="Liquidity lock policy"
          value={`${launch.lockPercent}%`}
        />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <Panel
            title="Lifecycle"
            action={
              <Badge tone={launch.graduated ? "green" : "amber"}>
                {launch.graduated
                  ? "Graduated in demo"
                  : remaining === 0
                    ? "Ready for demo graduation"
                    : "Curve demo"}
              </Badge>
            }
          >
            <Progress
              value={(launch.raisedBch / launch.thresholdBch) * 100}
              label="Quote target"
            />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              {launch.graduated
                ? "The demo market is now active. A real launch would need an independently verified graduation transaction."
                : `${remaining.toFixed(4)} BCH remains to the demo threshold.`}
            </p>
            {!launch.graduated && remaining === 0 && (
              <button
                className={`${primaryClass} mt-5`}
                onClick={() => {
                  graduate(id);
                  setMessage("Demo graduation recorded in this browser.");
                }}
              >
                Simulate graduation
              </button>
            )}
          </Panel>
          <Panel title="Token terms">
            <LabelValue
              label="Fixed supply input"
              value={launch.supply.toLocaleString()}
            />
            <LabelValue
              label="Curve allocation"
              value={`${launch.curveShare}%`}
            />
            <LabelValue label="Quote" value="BCH" />
            <LabelValue
              label="Illustrative fee input"
              value={`${launch.feePercent}%`}
            />
            <LabelValue label="Token category" value="None · browser demo" />
          </Panel>
          <Panel title="Activity">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {launch.trades === 0
                ? "No simulated trades yet."
                : `${launch.trades} simulated trade${launch.trades === 1 ? "" : "s"} in this browser.`}
            </p>
            <a
              className="mt-4 inline-block text-sm font-semibold text-emerald-600 dark:text-emerald-400"
              href="/launch/examples/e1"
            >
              Inspect the separate real Chipnet case study
            </a>
          </Panel>
        </div>
        <Panel
          title={
            launch.graduated
              ? "Graduated market preview"
              : remaining === 0
                ? "Curve complete"
                : "Curve trade demo"
          }
          className="h-fit lg:sticky lg:top-24"
        >
          {launch.graduated ? (
            <>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                The simulated launch has graduated. A production page would
                route trades to its committed Mesh market and show the exact
                position UTXOs.
              </p>
              <a
                className={`${secondaryClass} mt-5 w-full`}
                href="https://champrotocol.vercel.app/mesh/new"
              >
                Open current Mesh app
              </a>
            </>
          ) : remaining === 0 ? (
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              The demo quote target has been reached. Curve trading is paused
              while you simulate graduation.
            </p>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-2 gap-2">
                <button
                  className={side === "buy" ? primaryClass : secondaryClass}
                  onClick={() => setSide("buy")}
                >
                  Buy demo
                </button>
                <button
                  className={side === "sell" ? primaryClass : secondaryClass}
                  onClick={() => setSide("sell")}
                >
                  Sell demo
                </button>
              </div>
              <Field
                label="BCH amount for progress model"
                hint={
                  side === "sell"
                    ? "For this demo, sell decreases collected BCH; it is not a token quote."
                    : `At most ${remaining.toFixed(4)} BCH counts toward the target.`
                }
              >
                <input
                  className={inputClass}
                  type="number"
                  min={0.0001}
                  step={0.0001}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </Field>
              <div className="mt-5">
                <LabelValue
                  label="Input"
                  value={`${Number.isFinite(amount) ? amount : 0} BCH`}
                />
                <LabelValue
                  label="Change to progress"
                  value={`${side === "buy" ? Math.min(amount || 0, remaining).toFixed(4) : Math.min(amount || 0, launch.raisedBch).toFixed(4)} BCH`}
                />
                {side === "buy" && (
                  <LabelValue
                    label="Above demo target"
                    value={`${Math.max(0, amount - remaining).toFixed(4)} BCH ignored`}
                  />
                )}
              </div>
              <button
                className={`${primaryClass} mt-5 w-full`}
                disabled={
                  !validAmount || (side === "sell" && launch.raisedBch === 0)
                }
                onClick={() => {
                  trade(id, side, amount);
                  setMessage(
                    `${side === "buy" ? "Buy" : "Sell"} simulated locally. No transaction was sent.`,
                  );
                }}
              >
                Simulate {side}
              </button>
              {message && (
                <p
                  role="status"
                  className="mt-3 text-sm text-emerald-700 dark:text-emerald-300"
                >
                  {message}
                </p>
              )}
            </>
          )}
        </Panel>
      </div>
    </Page>
  );
}

export function LaunchManage({ id }: { id: string }) {
  const { state, claimFees } = useDemo();
  const launch = state.launches.find((item) => item.id === id);
  const [claimed, setClaimed] = useState(false);
  if (!launch) return <LaunchNotFound />;
  return (
    <Page
      eyebrow="Creator workspace · browser demo"
      title={`Manage ${launch.name}`}
      description="See how a creator dashboard will organize launch status, fees, allocations, and market rights."
      actions={
        <a className={secondaryClass} href={`/launch/${id}`}>
          View public page
        </a>
      }
    >
      <Notice>
        Claims here only update local demo state. No wallet balance, covenant
        fee collector, or claimable on-chain output is connected.
      </Notice>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Metric
          label="Lifecycle"
          value={launch.graduated ? "Graduated" : "Curve"}
        />
        <Metric
          label="Illustrative fees"
          value={`${launch.creatorFeesBch.toFixed(4)} BCH`}
        />
        <Metric label="Locked share policy" value={`${launch.lockPercent}%`} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Launch operations">
          <LabelValue label="Demo launch ID" value={launch.id} />
          <LabelValue
            label="Template"
            value={
              state.templates.find((t) => t.id === launch.templateId)?.name ??
              launch.templateId
            }
          />
          <LabelValue
            label="Created"
            value={new Date(launch.createdAt).toLocaleDateString()}
          />
          <a
            className={`${secondaryClass} mt-5 w-full`}
            href={`/launch/${id}/proof`}
          >
            Inspect lock policy
          </a>
        </Panel>
        <Panel title="Creator fee preview">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Real creator, partner, and protocol fee claims require exact
            contract outputs and recipient verification. This value is only an
            illustrative counter.
          </p>
          <button
            className={`${primaryClass} mt-5 w-full`}
            disabled={launch.creatorFeesBch <= 0}
            onClick={() => {
              claimFees(id);
              setClaimed(true);
            }}
          >
            Simulate claim
          </button>
          {claimed && (
            <p
              role="status"
              className="mt-3 text-sm text-emerald-700 dark:text-emerald-300"
            >
              Illustrative fees cleared in this browser.
            </p>
          )}
        </Panel>
        <Panel title="Allocations and vesting">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Team and community vesting need a separately verified CashToken
            covenant before launch funding can use them.
          </p>
          <a className={`${secondaryClass} mt-5`} href="/lock">
            Explore vesting demo
          </a>
        </Panel>
        <Panel title="Analytics">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            See simulated launches, progress, and partner activity together.
          </p>
          <a
            className={`${secondaryClass} mt-5`}
            href="/launch/partner/analytics"
          >
            Open demo analytics
          </a>
        </Panel>
      </div>
    </Page>
  );
}

export function LaunchProof({ id }: { id: string }) {
  const { state } = useDemo();
  const launch = state.launches.find((item) => item.id === id);
  if (!launch) return <LaunchNotFound />;
  return (
    <Page
      eyebrow="Rights and proof"
      title={`${launch.name} · lock policy`}
      description="A production proof must verify exact output scripts, balances, manager rights, and spend paths. This demo has no transaction to verify."
      actions={
        <a className={secondaryClass} href={`/launch/${id}`}>
          Back to launch
        </a>
      }
    >
      <Notice kind="warning">
        “{launch.lockPercent}% locked” is a selected demo policy, not proof that
        funds are locked. There is no on-chain position for this simulated
        launch.
      </Notice>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Selected terms">
          <LabelValue
            label="Locked graduation principal"
            value={`${launch.lockPercent}% policy`}
          />
          <LabelValue
            label="Creator-managed portion"
            value={`${100 - launch.lockPercent}% policy`}
          />
          <LabelValue label="Destination contract" value="Not instantiated" />
          <LabelValue
            label="Spend-path verification"
            value="Unavailable in demo"
          />
        </Panel>
        <Panel title="What a real verifier checks">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
            <li>Graduation transaction outputs and exact CashToken amounts.</li>
            <li>
              Locked position artifact hash and absence of principal exit.
            </li>
            <li>Manager and owner spend paths for the unlocked share.</li>
            <li>Current unspent outpoints and any later state transitions.</li>
          </ul>
          <a href="/launch/examples/e1" className={`${secondaryClass} mt-5`}>
            View Chipnet evidence
          </a>
        </Panel>
      </div>
    </Page>
  );
}

export function TokenIdentity({ category }: { category: string }) {
  const isE1 = category === E1_CATEGORY;
  return (
    <Page
      eyebrow="Token identity"
      title={isE1 ? "E1 Chipnet launch token" : "CashToken lookup preview"}
      description="CashToken categories identify tokens; names and symbols are untrusted metadata."
      actions={
        <a href="/launch/tokens" className={secondaryClass}>
          Launch directory
        </a>
      }
    >
      {isE1 ? (
        <Notice>
          On Chipnet, the E1 example created a fixed genesis supply of 1,000,000
          fungible tokens. This page does not query the current chain or
          authenticate BCMR metadata.
        </Notice>
      ) : (
        <Notice kind="warning">
          This UI has no token-data lookup connected. It cannot confirm that
          this category exists or establish supply, mint authority, or creator
          identity.
        </Notice>
      )}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Category and provenance">
          <LabelValue
            label="Network"
            value={isE1 ? "BCH Chipnet" : "Unknown"}
          />
          <LabelValue
            label="Category"
            value={<span className="font-mono text-xs">{category}</span>}
          />
          <LabelValue
            label="Genesis"
            value={
              isE1 ? (
                <a
                  className="text-emerald-600 dark:text-emerald-400"
                  href={`${CHIPNET}90bb29d0112a2712e69d5acc2e38fca10b620f9187109119b8b2df25de774ddb`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Chipnet transaction
                </a>
              ) : (
                "Not checked"
              )
            }
          />
          <LabelValue label="BCMR metadata" value="Not checked in this UI" />
        </Panel>
        <Panel title="Independent checks">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            The future token-data service will separate metadata hash integrity,
            human creator review, liquidity lock proof, and risk flags. None
            implies price safety.
          </p>
          <a className={`${secondaryClass} mt-5`} href="/verify">
            Open verification preview
          </a>
        </Panel>
      </div>
    </Page>
  );
}

export function E1CaseStudy() {
  const stages = [
    [
      "Fixed-supply genesis",
      "90bb29d0112a2712e69d5acc2e38fca10b620f9187109119b8b2df25de774ddb",
    ],
    [
      "Opening curve buy",
      "b9352a8f8a9e4b590f38574762a040dd219360eaa8ada3fc42a7e0a79c8f41b3",
    ],
    [
      "Curve sell",
      "7ab1ea2a347f565ce7bfde1573349c1cf5a4ddff9143ef51e1633f68ef9382c2",
    ],
    [
      "Terminal partial buy and excess refund",
      "17f110cca904de78d0feae8156ee15fa0117989bdcfcb07dbb29c39cc28ff8f7",
    ],
    [
      "Graduation and permanent lock",
      "678040e3042fbba22c6d1260b4a90bf6378ed5e0e6584698a050162c8063a081",
    ],
    [
      "Post-graduation market buy",
      "23b518d264ba670c4eba28d0980e32eec17f37af6021ace930a8c3c16fc4e094",
    ],
    [
      "Creator market fee claim",
      "8f377661d82cc0f54cd4dc5adf0121b9b763aeb8e071e8df6c8fb687877edb7b",
    ],
  ];
  return (
    <Page
      eyebrow="Real Chipnet evidence"
      title="E1 launch lifecycle"
      description="A BCH-quoted launch executed across 15 confirmed Chipnet transactions on 17 November 2026. This is engineering evidence, not a public mainnet deployment or audit."
      actions={
        <a className={secondaryClass} href="/launch/tokens">
          Explore demo directory
        </a>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Confirmed transactions" value="15" />
        <Metric label="Genesis supply" value="1,000,000 FT" />
        <Metric label="Graduation lock" value="90%" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel
          title="Transaction trail"
          description="Open each transaction in a public Chipnet explorer."
        >
          <div className="space-y-0">
            {stages.map(([label, txid]) => (
              <a
                key={txid}
                href={`${CHIPNET}${txid}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-wrap justify-between gap-2 border-b border-slate-200 py-4 text-sm last:border-0 hover:text-emerald-600 dark:border-slate-800"
              >
                <span className="font-medium">{label}</span>
                <span className="font-mono text-xs text-slate-500">
                  {txid.slice(0, 12)}…{txid.slice(-8)}
                </span>
              </a>
            ))}
          </div>
        </Panel>
        <div className="space-y-5">
          <Notice>
            These transactions are historical Chipnet evidence. The interactive
            trade screens elsewhere on this site are separate browser
            simulations.
          </Notice>
          <Panel title="Committed outcomes">
            <LabelValue
              label="Launch category"
              value={
                <a
                  className="font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  href={`/tokens/${E1_CATEGORY}`}
                >
                  {E1_CATEGORY}
                </a>
              }
            />
            <LabelValue
              label="Terminal buy"
              value="Partial fill; excess refunded"
            />
            <LabelValue
              label="Locked liquidity"
              value="570,000 FT + 450,003 quote sats"
            />
            <LabelValue
              label="Creator-managed liquidity"
              value="63,333 FT + 50,000 quote sats"
            />
            <LabelValue
              label="Fee recipients"
              value="Creator, partner, protocol"
            />
          </Panel>
          <Panel title="Scope of evidence">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              The run used a laboratory funder. It does not establish a hosted
              wallet flow, public launch UI, mainnet readiness, or external
              security review.
            </p>
          </Panel>
        </div>
      </div>
    </Page>
  );
}
