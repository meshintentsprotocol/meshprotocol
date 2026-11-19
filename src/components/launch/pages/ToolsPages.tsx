import { useState } from "react";
import { useDemo } from "../demo/DemoContext";
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

export function VerifyPage() {
  const { state, requestReview } = useDemo();
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const normalized = category.trim().toLowerCase();
  const valid = /^[0-9a-f]{64}$/.test(normalized);
  return (
    <Page
      eyebrow="Token trust"
      title="Verify a token"
      description="Inspect token identity by CashToken category. Metadata integrity, creator review, and liquidity proof are separate checks."
      actions={
        <a className={secondaryClass} href="/launch/docs">
          Read verification model
        </a>
      }
    >
      <Notice kind="warning">
        This is a request-flow demo. It does not query a blockchain, validate
        BCMR, approve an identity, or issue a verified badge.
      </Notice>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Category lookup preview">
          <Field
            label="CashToken category"
            hint="Enter exactly 64 hexadecimal characters; a symbol is not a token identity."
          >
            <input
              className={`${inputClass} font-mono`}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setMessage("");
              }}
              placeholder="64-character category ID"
            />
          </Field>
          <button
            className={`${primaryClass} mt-5`}
            disabled={!valid}
            onClick={() =>
              setMessage(
                "Category format is valid. No chain or BCMR check was performed.",
              )
            }
          >
            Check format
          </button>
          {message && (
            <p
              role="status"
              className="mt-4 text-sm text-slate-600 dark:text-slate-400"
            >
              {message}
            </p>
          )}
          {valid && (
            <a
              className="mt-4 block break-all text-sm text-emerald-600 dark:text-emerald-400"
              href={`/tokens/${normalized}`}
            >
              Open category preview
            </a>
          )}
        </Panel>
        <Panel title="Independent trust signals">
          <LabelValue
            label="Category format"
            value={
              valid ? (
                <Badge tone="green">Valid format</Badge>
              ) : (
                <Badge>Not entered</Badge>
              )
            }
          />
          <LabelValue label="On-chain genesis" value="Not checked" />
          <LabelValue label="BCMR hash integrity" value="Not checked" />
          <LabelValue label="Creator identity review" value="Not reviewed" />
          <LabelValue label="Liquidity lock" value="Not checked" />
          <button
            className={`${secondaryClass} mt-5 w-full`}
            disabled={!valid || state.reviewRequests.includes(normalized)}
            onClick={() => {
              requestReview(normalized);
              setMessage("Review request saved in this browser only.");
            }}
          >
            {state.reviewRequests.includes(normalized)
              ? "Local request saved"
              : "Save demo review request"}
          </button>
        </Panel>
      </div>
    </Page>
  );
}

export function LockPage() {
  const { state, addLock, claimLock } = useDemo();
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState(1000);
  const [beneficiary, setBeneficiary] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [message, setMessage] = useState("");
  const valid =
    !!token.trim() &&
    !!beneficiary.trim() &&
    Number.isFinite(amount) &&
    amount > 0 &&
    !!unlockDate;
  return (
    <Page
      eyebrow="Allocation tools"
      title="Token vesting demo"
      description="Explore beneficiary locks and claim states. Token vesting and liquidity principal locks are different products."
      actions={
        <a className={secondaryClass} href="/launch/examples/e1">
          View real LP lock evidence
        </a>
      }
    >
      <Notice kind="warning">
        This page stores schedules in your browser. It does not hold CashTokens,
        enforce unlock heights, or authorize beneficiary claims. The vesting
        covenant is still a separate release gate.
      </Notice>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Create a demo schedule">
          <div className="space-y-4">
            <Field
              label="Token label"
              hint="A label only; no category is resolved."
            >
              <input
                className={inputClass}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="TEAM"
              />
            </Field>
            <Field label="Amount">
              <input
                className={inputClass}
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </Field>
            <Field label="Beneficiary label or address">
              <input
                className={inputClass}
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                placeholder="Beneficiary"
              />
            </Field>
            <Field label="Unlock date">
              <input
                className={inputClass}
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
              />
            </Field>
            <button
              className={`${primaryClass} w-full`}
              disabled={!valid}
              onClick={() => {
                addLock({
                  token: token.trim(),
                  amount,
                  beneficiary: beneficiary.trim(),
                  unlockDate,
                });
                setMessage("Demo vesting schedule saved locally.");
                setToken("");
                setBeneficiary("");
              }}
            >
              Save demo schedule
            </button>
            {message && (
              <p
                role="status"
                className="text-sm text-emerald-700 dark:text-emerald-300"
              >
                {message}
              </p>
            )}
          </div>
        </Panel>
        <Panel
          title="Demo schedules"
          description="Claims only change the local status after the selected date."
        >
          {state.locks.length === 0 ? (
            <EmptyState
              title="No schedules yet"
              description="Create one to preview the claim experience."
            />
          ) : (
            <div className="space-y-3">
              {state.locks.map((lock) => {
                const unlocked =
                  new Date(lock.unlockDate).getTime() <= Date.now();
                return (
                  <div
                    key={lock.id}
                    className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                  >
                    <div className="flex flex-wrap justify-between gap-2">
                      <h3 className="font-semibold">
                        {lock.amount.toLocaleString()} {lock.token}
                      </h3>
                      <Badge
                        tone={
                          lock.claimed ? "green" : unlocked ? "blue" : "amber"
                        }
                      >
                        {lock.claimed
                          ? "Claimed in demo"
                          : unlocked
                            ? "Date reached"
                            : "Scheduled"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {lock.beneficiary} · {lock.unlockDate}
                    </p>
                    <button
                      className={`${secondaryClass} mt-4`}
                      disabled={!unlocked || lock.claimed}
                      onClick={() => claimLock(lock.id)}
                    >
                      Simulate claim
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
    </Page>
  );
}

export function SalesPage() {
  const { state, addSale, depositSale, settleSale, refundSale } = useDemo();
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [mode, setMode] = useState<
    "Presale" | "Alpha allocation" | "Alpha pool buy"
  >("Presale");
  const [target, setTarget] = useState(1);
  const [depositAmount, setDepositAmount] = useState<Record<string, number>>(
    {},
  );
  return (
    <Page
      eyebrow="Launch extensions"
      title="Presale and Alpha demos"
      description="Compare a standalone sale with early allocation and pool-buy concepts before their separate contract flows are ready."
    >
      <Notice kind="warning">
        All deposits, settlements, and refunds on this page are simulated in
        local browser state. No BCH or CashTokens move, and no participant
        entitlement is created.
      </Notice>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Panel title="Set up a demo sale">
          <div className="space-y-4">
            <Field label="Sale name">
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Community presale"
              />
            </Field>
            <Field label="Token label">
              <input
                className={inputClass}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="TOKEN"
              />
            </Field>
            <Field label="Mode">
              <select
                className={inputClass}
                value={mode}
                onChange={(e) => setMode(e.target.value as typeof mode)}
              >
                <option>Presale</option>
                <option>Alpha allocation</option>
                <option>Alpha pool buy</option>
              </select>
            </Field>
            <Field label="Target (BCH)">
              <input
                className={inputClass}
                type="number"
                min={0.001}
                step={0.001}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
              />
            </Field>
            <button
              className={`${primaryClass} w-full`}
              disabled={
                !name.trim() ||
                !token.trim() ||
                !Number.isFinite(target) ||
                target <= 0
              }
              onClick={() => {
                addSale({
                  name: name.trim(),
                  token: token.trim(),
                  mode,
                  targetBch: target,
                });
                setName("");
                setToken("");
              }}
            >
              Create demo sale
            </button>
          </div>
        </Panel>
        <div className="space-y-4">
          {state.sales.length === 0 && (
            <EmptyState
              title="No demo sales yet"
              description="Create one to explore deposits, target success, settlement, and refund screens."
            />
          )}
          {state.sales.map((sale) => (
            <Panel
              key={sale.id}
              title={sale.name}
              action={
                <Badge
                  tone={
                    sale.status === "Open"
                      ? "blue"
                      : sale.status === "Settled"
                        ? "green"
                        : "amber"
                  }
                >
                  {sale.status} · demo
                </Badge>
              }
            >
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                {sale.mode} · {sale.token}
              </p>
              <Progress
                value={(sale.depositedBch / sale.targetBch) * 100}
                label={`${sale.depositedBch} / ${sale.targetBch} BCH`}
              />
              <div className="mt-5 flex flex-wrap items-end gap-2">
                {sale.status === "Open" && (
                  <>
                    <div className="w-36">
                      <Field label="Demo deposit">
                        <input
                          className={inputClass}
                          type="number"
                          min={0.001}
                          step={0.001}
                          value={depositAmount[sale.id] ?? 0.1}
                          onChange={(e) =>
                            setDepositAmount((previous) => ({
                              ...previous,
                              [sale.id]: Number(e.target.value),
                            }))
                          }
                        />
                      </Field>
                    </div>
                    <button
                      className={secondaryClass}
                      disabled={
                        !Number.isFinite(depositAmount[sale.id] ?? 0.1) ||
                        (depositAmount[sale.id] ?? 0.1) <= 0
                      }
                      onClick={() =>
                        depositSale(sale.id, depositAmount[sale.id] ?? 0.1)
                      }
                    >
                      Simulate deposit
                    </button>
                    <button
                      className={primaryClass}
                      disabled={sale.depositedBch < sale.targetBch}
                      onClick={() => settleSale(sale.id)}
                    >
                      Simulate settlement
                    </button>
                    <button
                      className={secondaryClass}
                      onClick={() => refundSale(sale.id)}
                    >
                      Simulate refund
                    </button>
                  </>
                )}
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </Page>
  );
}

export function AnalyticsPage() {
  const { state } = useDemo();
  const graduated = state.launches.filter((launch) => launch.graduated).length;
  const collected = state.launches.reduce(
    (sum, launch) => sum + launch.raisedBch,
    0,
  );
  const trades = state.launches.reduce((sum, launch) => sum + launch.trades, 0);
  return (
    <Page
      eyebrow="Builder workspace"
      title="Demo analytics"
      description="A preview of partner reporting. Figures come only from this browser's simulated launches and are never presented as protocol activity."
      actions={
        <a className={secondaryClass} href="/launch/builders">
          Config Studio
        </a>
      }
    >
      <Notice>
        Local data only. No indexer, market feed, on-chain volume, or fee ledger
        is connected.
      </Notice>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Demo launches" value={String(state.launches.length)} />
        <Metric label="Graduated in demo" value={String(graduated)} />
        <Metric
          label="Simulated quote collected"
          value={`${collected.toFixed(3)} BCH`}
        />
        <Metric label="Simulated trades" value={String(trades)} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Launches by template">
          {state.templates.map((template) => (
            <LabelValue
              key={template.id}
              label={template.name}
              value={String(
                state.launches.filter(
                  (launch) => launch.templateId === template.id,
                ).length,
              )}
            />
          ))}
        </Panel>
        <Panel title="Lifecycle overview">
          <LabelValue
            label="Curve demo"
            value={state.launches.length - graduated}
          />
          <LabelValue label="Graduated demo" value={graduated} />
          <LabelValue
            label="Open demo sales"
            value={state.sales.filter((sale) => sale.status === "Open").length}
          />
          <LabelValue label="Demo locks" value={state.locks.length} />
        </Panel>
      </div>
    </Page>
  );
}

export function BuilderDocsPage() {
  return (
    <Page
      eyebrow="Build on Mesh"
      title="Launch integration guide"
      description="The intended flow for teams building their own BCH launchpad on Blaze. This page describes the integration plan, not a released SDK."
      actions={
        <a className={secondaryClass} href="/launch/builders">
          Explore Config Studio
        </a>
      }
    >
      <Notice>
        The Config Studio currently saves browser-local demos. A signed,
        versioned builder config and config-to-manifest contract commitment
        remain implementation work.
      </Notice>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Panel title="Configuration">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Define quote policy, curve bounds, supply allocations, fee
            recipients, graduation destination, lock floor, and allowed creator
            inputs. Version and sign the canonical bytes.
          </p>
        </Panel>
        <Panel title="Launch instance">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            A creator chooses the template, supplies a fixed-supply CashToken
            genesis and launch metadata, and reviews a manifest containing exact
            destinations and rights before signing.
          </p>
        </Panel>
        <Panel title="Trading and graduation">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            The curve covenant enforces buys and sells. At its threshold, a
            permissionless graduation transaction must fund the committed Mesh
            market and verify the locked share.
          </p>
        </Panel>
        <Panel title="Independent verification">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Builders need a canonical config hash, artifact hashes,
            deterministic transaction builders, raw transaction verifiers, a
            category-keyed indexer, and a recovery path for stale UTXOs.
          </p>
        </Panel>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Planned builder API">
          <div className="font-mono text-sm leading-8 text-slate-700 dark:text-slate-300">
            createConfig
            <br />
            verifyConfig
            <br />
            instantiateLaunch
            <br />
            buildGenesis
            <br />
            quoteBuy / quoteSell
            <br />
            buildGraduation
            <br />
            verifyLockedLiquidity
            <br />
            getLaunch
          </div>
        </Panel>
        <Panel title="Current engineering evidence">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            The BCH-quoted E1 lab flow has 15 confirmed Chipnet transactions.
            CashToken-quoted E2 has local VM evidence and still needs a complete
            Chipnet run. Vesting, presale, and Alpha each need separate gates.
          </p>
          <a href="/launch/examples/e1" className={`${secondaryClass} mt-5`}>
            Open E1 case study
          </a>
        </Panel>
      </div>
    </Page>
  );
}
