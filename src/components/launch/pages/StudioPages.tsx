import { useEffect, useState } from "react";
import { useDemo } from "../demo/DemoContext";
import {
  Badge,
  EmptyState,
  Field,
  LabelValue,
  Notice,
  Page,
  Panel,
  inputClass,
  primaryClass,
  secondaryClass,
} from "../ui/Primitives";

export function TemplateGallery() {
  const { state } = useDemo();
  return (
    <Page
      eyebrow="Launchpad infrastructure"
      title="Configuration gallery"
      description="Compare reusable launch policies. Reference presets and locally saved demo templates are shown separately from any on-chain commitment."
      actions={
        <a className={primaryClass} href="/launch/builders">
          Design a template
        </a>
      }
    >
      <Notice>
        These configurations are interface examples. They are not signed,
        published, or bound to a funded launch.
      </Notice>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.templates.map((template) => (
          <Panel
            key={template.id}
            title={template.name}
            action={
              <Badge
                tone={template.id.startsWith("template-") ? "blue" : "slate"}
              >
                {template.id.startsWith("template-")
                  ? "Local demo"
                  : "Reference preset"}
              </Badge>
            }
          >
            <p className="mb-5 text-sm text-slate-600 dark:text-slate-400">
              {template.partner} · BCH quote
            </p>
            <LabelValue
              label="Curve allocation"
              value={`${template.curveShare}%`}
            />
            <LabelValue
              label="Graduation target"
              value={`${template.thresholdBch} BCH`}
            />
            <LabelValue
              label="Illustrative fee input"
              value={`${template.feePercent}%`}
            />
            <LabelValue label="Lock floor" value={`${template.lockPercent}%`} />
            <a
              className={`${secondaryClass} mt-5 w-full`}
              href={`/launch/new?template=${encodeURIComponent(template.id)}`}
            >
              Use in creator preview
            </a>
          </Panel>
        ))}
      </div>
    </Page>
  );
}

export function BuilderStudio() {
  const { addTemplate } = useDemo();
  const [name, setName] = useState("");
  const [partner, setPartner] = useState("");
  const [curveShare, setCurveShare] = useState(70);
  const [thresholdBch, setThresholdBch] = useState(0.5);
  const [feePercent, setFeePercent] = useState(1);
  const [lockPercent, setLockPercent] = useState(90);
  const valid =
    !!name.trim() &&
    !!partner.trim() &&
    curveShare >= 1 &&
    curveShare <= 100 &&
    thresholdBch > 0 &&
    feePercent >= 0 &&
    feePercent <= 10 &&
    lockPercent >= 90 &&
    lockPercent <= 100;
  return (
    <Page
      eyebrow="Build on Mesh"
      title="Config Studio"
      description="Shape a reusable BCH-quoted launch policy. Save it locally to try the creator flow; contract-bound publishing is a later integration."
      actions={
        <a href="/launch/templates" className={secondaryClass}>
          Browse templates
        </a>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <Notice>
            Demo mode: saving a template writes to this browser only. No partner
            signature, config hash, or contract transaction is produced.
          </Notice>
          <Panel
            title="Template identity"
            description="Give creators a clear preset to choose from."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Template name">
                <input
                  className={inputClass}
                  value={name}
                  maxLength={60}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Community launch"
                />
              </Field>
              <Field label="Partner name">
                <input
                  className={inputClass}
                  value={partner}
                  maxLength={60}
                  onChange={(e) => setPartner(e.target.value)}
                  placeholder="Your launchpad"
                />
              </Field>
            </div>
          </Panel>
          <Panel
            title="Market policy"
            description="BCH quote is the evidenced E1 route. Token-quoted launches need their own release gate."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Quote asset">
                <input className={inputClass} value="BCH" disabled />
              </Field>
              <Field label="Curve allocation (%)">
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  max={100}
                  value={curveShare}
                  onChange={(e) => setCurveShare(Number(e.target.value))}
                />
              </Field>
              <Field label="Graduation target (BCH)">
                <input
                  className={inputClass}
                  type="number"
                  min={0.001}
                  step={0.001}
                  value={thresholdBch}
                  onChange={(e) => setThresholdBch(Number(e.target.value))}
                />
              </Field>
              <Field label="Illustrative fee (%)">
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  max={10}
                  step={0.01}
                  value={feePercent}
                  onChange={(e) => setFeePercent(Number(e.target.value))}
                />
              </Field>
            </div>
          </Panel>
          <Panel
            title="Graduation policy"
            description="The public reference template keeps at least 90% of graduation principal in locked Mesh liquidity."
          >
            <Field label="Minimum locked principal (%)">
              <input
                className={inputClass}
                type="number"
                min={90}
                max={100}
                value={lockPercent}
                onChange={(e) => setLockPercent(Number(e.target.value))}
              />
            </Field>
          </Panel>
        </div>
        <Panel title="Policy preview" className="h-fit lg:sticky lg:top-24">
          <LabelValue label="Template" value={name || "Untitled"} />
          <LabelValue label="Partner" value={partner || "Not set"} />
          <LabelValue label="Quote" value="BCH" />
          <LabelValue label="Curve allocation" value={`${curveShare}%`} />
          <LabelValue label="Target" value={`${thresholdBch} BCH`} />
          <LabelValue label="Fee input" value={`${feePercent}%`} />
          <LabelValue label="Lock floor" value={`${lockPercent}%`} />
          <p className="my-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
            A production config also needs canonical encoding, recipient rules,
            artifact allowlists, signatures, and a launch manifest commitment.
          </p>
          <button
            className={`${primaryClass} w-full`}
            disabled={!valid}
            onClick={() => {
              addTemplate({
                name: name.trim(),
                partner: partner.trim(),
                quote: "BCH",
                curveShare,
                thresholdBch,
                feePercent,
                lockPercent,
              });
              window.location.href = "/launch/templates";
            }}
          >
            Save demo template
          </button>
        </Panel>
      </div>
    </Page>
  );
}

export function CreatorStudio() {
  const { state, setDraft } = useDemo();
  const { draft } = state;
  useEffect(() => {
    const selectedFromUrl = new URLSearchParams(window.location.search).get(
      "template",
    );
    if (
      selectedFromUrl &&
      selectedFromUrl !== draft.templateId &&
      state.templates.some((template) => template.id === selectedFromUrl)
    ) {
      setDraft({ ...draft, templateId: selectedFromUrl });
    }
    // The URL selects an initial template; later changes belong to the creator.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const template =
    state.templates.find((item) => item.id === draft.templateId) ??
    state.templates[0];
  const valid =
    !!draft.name.trim() &&
    /^[A-Za-z0-9]{2,12}$/.test(draft.symbol.trim()) &&
    Number.isSafeInteger(draft.supply) &&
    draft.supply > 0;
  const update = (change: Partial<typeof draft>) =>
    setDraft({ ...draft, ...change });
  return (
    <Page
      eyebrow="Creator preview"
      title="Design a token launch"
      description="Choose a reusable policy, define a fixed-supply token, and review the resulting terms. This browser demo does not create a CashToken."
      actions={
        <a href="/launch/templates" className={secondaryClass}>
          Compare policies
        </a>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <Notice>
            Demo mode: your draft stays in this browser. A real launch will
            require token genesis, a wallet signature, a verified manifest, and
            indexed transactions.
          </Notice>
          <Panel title="Token basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Token name">
                <input
                  className={inputClass}
                  value={draft.name}
                  maxLength={60}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Your token"
                />
              </Field>
              <Field label="Ticker" hint="2–12 letters or numbers.">
                <input
                  className={inputClass}
                  value={draft.symbol}
                  maxLength={12}
                  onChange={(e) =>
                    update({ symbol: e.target.value.toUpperCase() })
                  }
                  placeholder="TOKEN"
                />
              </Field>
              <Field label="Fixed supply">
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  step={1}
                  value={draft.supply}
                  onChange={(e) => update({ supply: Number(e.target.value) })}
                />
              </Field>
              <Field label="Description">
                <input
                  className={inputClass}
                  value={draft.description}
                  maxLength={180}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="What is this token for?"
                />
              </Field>
            </div>
          </Panel>
          <Panel
            title="Launch policy"
            description="A builder template fixes the curve, target, fee input, and lock floor."
          >
            <Field label="Template">
              <select
                className={inputClass}
                value={draft.templateId}
                onChange={(e) => update({ templateId: e.target.value })}
              >
                {state.templates.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.partner}
                  </option>
                ))}
              </select>
            </Field>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <LabelValue label="Quote" value="BCH" />
              <LabelValue
                label="Curve allocation"
                value={`${template.curveShare}%`}
              />
              <LabelValue
                label="Target"
                value={`${template.thresholdBch} BCH`}
              />
              <LabelValue
                label="Lock floor"
                value={`${template.lockPercent}%`}
              />
            </div>
          </Panel>
        </div>
        <Panel
          title="Before you continue"
          className="h-fit lg:sticky lg:top-24"
        >
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Review supply allocation, launch economics, fee recipients, and
            graduation rights before any wallet action. This demo shows only the
            fields currently modeled in the UI.
          </p>
          <div className="mt-5">
            <LabelValue label="Name" value={draft.name || "Not set"} />
            <LabelValue label="Ticker" value={draft.symbol || "Not set"} />
            <LabelValue
              label="Supply"
              value={
                Number.isFinite(draft.supply)
                  ? draft.supply.toLocaleString()
                  : "Invalid"
              }
            />
          </div>
          <button
            className={`${primaryClass} mt-5 w-full`}
            disabled={!valid}
            onClick={() => {
              setDraft(draft);
              window.location.href = "/launch/new/review";
            }}
          >
            Review demo launch
          </button>
        </Panel>
      </div>
    </Page>
  );
}

export function LaunchReview() {
  const { state, addLaunch } = useDemo();
  const { draft } = state;
  const template =
    state.templates.find((item) => item.id === draft.templateId) ??
    state.templates[0];
  const valid =
    !!draft.name.trim() &&
    /^[A-Za-z0-9]{2,12}$/.test(draft.symbol.trim()) &&
    Number.isSafeInteger(draft.supply) &&
    draft.supply > 0;
  const curveTokens = Math.floor((draft.supply * template.curveShare) / 100);
  return (
    <Page
      eyebrow="Creator preview"
      title="Review launch terms"
      description="Confirm the example values before adding a simulated launch to this browser."
      actions={
        <a href="/launch/new" className={secondaryClass}>
          Edit draft
        </a>
      }
    >
      {!valid ? (
        <EmptyState
          title="Complete the token draft"
          description="Enter a name, ticker, and valid fixed supply before review."
          action={
            <a className={primaryClass} href="/launch/new">
              Open creator preview
            </a>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <Notice kind="warning">
              This is a local simulation. It does not issue a CashToken, publish
              BCMR metadata, reserve a category, lock liquidity, or request a
              wallet signature.
            </Notice>
            <Panel title="Token and distribution">
              <LabelValue
                label="Token"
                value={`${draft.name} (${draft.symbol.toUpperCase()})`}
              />
              <LabelValue
                label="Supply"
                value={draft.supply.toLocaleString()}
              />
              <LabelValue
                label="Illustrative curve inventory"
                value={curveTokens.toLocaleString()}
              />
              <LabelValue
                label="Other allocations"
                value={(draft.supply - curveTokens).toLocaleString()}
              />
              <LabelValue
                label="Mint authority"
                value="Not created or verified"
              />
            </Panel>
            <Panel title="Market and graduation">
              <LabelValue label="Builder template" value={template.name} />
              <LabelValue label="Quote" value="BCH" />
              <LabelValue
                label="Graduation target"
                value={`${template.thresholdBch} BCH`}
              />
              <LabelValue
                label="Illustrative fee input"
                value={`${template.feePercent}%`}
              />
              <LabelValue
                label="Minimum lock"
                value={`${template.lockPercent}%`}
              />
              <LabelValue
                label="Recipient scripts"
                value="Not specified in demo"
              />
            </Panel>
          </div>
          <Panel title="Demo action" className="h-fit">
            <p className="mb-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Create a browser-only launch record, then try trading, graduation,
              and management screens using simulated state.
            </p>
            <button
              className={`${primaryClass} w-full`}
              onClick={() => {
                const id = addLaunch();
                window.location.href = `/launch/${id}`;
              }}
            >
              Create demo launch
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              No wallet or network action occurs.
            </p>
          </Panel>
        </div>
      )}
    </Page>
  );
}
