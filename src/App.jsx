import { useState, useMemo, useEffect } from "react";

// ── tiny CSV parser (our files have no quoted/comma-in-field values) ──
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const cells = line.split(",");
    const row = {};
    headers.forEach((h, i) => { row[h] = cells[i]; });
    return row;
  });
}
const num = v => (v === undefined || v === "" || v === "N/A" ? null : Number(v));

// Cohort composition (case counts per cancer type — cohort facts, not in the stats CSVs)
const COHORT = [
  ["Breast", "11,598", "#e11d48"], ["Prostate", "8,566", "#7c3aed"],
  ["Colorectal", "3,610", "#059669"], ["Melanoma", "2,532", "#d97706"],
  ["Kidney", "2,454", "#0284c7"], ["Lung", "2,435", "#64748b"],
  ["Ovarian", "1,518", "#db2777"], ["Pancreatic", "992", "#854d0e"],
  ["Stomach", "494", "#0d9488"], ["Controls", "30,000", "#374151"],
];

const CAT_STYLE = {
  Replicated: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Novel: "bg-amber-50 text-amber-700 border-amber-200",
  Suggestive: "bg-stone-100 text-stone-600 border-stone-200",
};

function ec(v) { return v >= 20 ? "#b91c1c" : v >= 10 ? "#dc2626" : v >= 5 ? "#ea580c" : v >= 2 ? "#d97706" : "#6b7280"; }
function fmtP(p) { if (p == null) return "—"; return p < 0.001 ? p.toExponential(1) : p.toFixed(3); }

function FloatingGenes() {
  const genes = ["BRCA1", "BRCA2", "TP53", "MLH1", "APC", "ATM", "PTEN", "VHL", "CDH1", "CHEK2", "PALB2", "MSH2", "CDKN2A", "NF1", "FH", "MITF"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {genes.map((g, i) => (
        <span key={g} className="absolute font-mono text-white/[0.04] text-sm" style={{
          left: `${5 + (i * 6) % 90}%`, top: `${10 + (i * 17) % 75}%`,
          fontSize: `${12 + (i % 4) * 4}px`,
          animation: `float ${8 + i % 5}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.4}s`,
        }}>{g}</span>
      ))}
      <style>{`@keyframes float { from { transform: translateY(0px) } to { transform: translateY(-20px) } }`}</style>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("overview");
  const [cat, setCat] = useState("All");
  const [fc, setFc] = useState("All");
  const [vis, setVis] = useState(false);
  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState([]);
  const [repl, setRepl] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setTimeout(() => setVis(true), 100);
    Promise.all([
      fetch("cohort_summary.json").then(r => r.json()),
      fetch("fdr_significant_results.csv").then(r => r.text()).then(parseCSV),
      fetch("replication_summary_pc_adjusted.csv").then(r => r.text()).then(parseCSV),
    ]).then(([s, res, rp]) => {
      setSummary(s);
      setResults(res.map(r => ({
        cancer: r.cancer, gene: r.gene,
        cc: num(r.carriers_cases), ct: num(r.carriers_controls),
        or: num(r.adj_OR), p: num(r.adj_p), fdr: num(r.fdr_p), category: r.category,
      })).sort((a, b) => b.or - a.or));
      setRepl(rp.map(r => ({
        cancer: r.cancer, gene: r.gene, or: num(r.adj_OR),
        fdr: num(r.fdr_p), status: r.status, ok: r.fdr_significant === "True",
      })));
    }).catch(e => setErr(String(e)));
  }, []);

  const cancers = useMemo(() => ["All", ...[...new Set(results.map(d => d.cancer))].sort()], [results]);
  const counts = useMemo(() => {
    const c = { Replicated: 0, Novel: 0, Suggestive: 0 };
    results.forEach(r => { if (c[r.category] != null) c[r.category]++; });
    return c;
  }, [results]);
  const filtered = useMemo(() => results.filter(d =>
    (cat === "All" || d.category === cat) && (fc === "All" || d.cancer === fc)), [results, cat, fc]);

  const tabs =[{ id: "overview", l: "Overview" }, { id: "results", l: "Results" }, { id: "ancestry", l: "Ancestry" }, { id: "tcga", l: "TCGA Replication" }, { id: "methods", l: "Methods" }];
  const loading = !summary && !err;

  if (err) return <div className="min-h-screen flex items-center justify-center text-red-600 p-8">Failed to load data: {err}</div>;
  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-400">Loading results…</div>;

  const heroStats = [
    ["61,044", "Participants"], ["9", "Cancers"], ["44", "Genes"],
    [String(summary.significant_associations), "Significant"],
    [`${summary.huang_replicated_pct}%`, "Replicated"], [String(summary.novel), "Novel"],
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* HERO */}
      <header className="bg-stone-900 text-white relative overflow-hidden">
        <FloatingGenes />
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono tracking-[0.2em] text-stone-500 uppercase mb-4">Computational Genomics · NIH All of Us</p>
              <h1 className={`text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] transition-all duration-1000 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                Pan-Cancer Germline<br />Predisposition Analysis
              </h1>
              <p className={`text-stone-400 mt-5 leading-relaxed text-[15px] max-w-lg transition-all duration-1000 delay-200 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                Do inherited cancer-risk genes affect all populations equally? We analyzed 61,044 participants to find out — extending Huang et al.&apos;s landmark <em>Cell</em> (2018) study to the most diverse genomic cohort available, with a matched control group and covariate-adjusted modeling.
              </p>
              <div className={`flex flex-wrap gap-2.5 mt-8 transition-all duration-1000 delay-400 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {heroStats.map(([v, l]) => (
                  <div key={l} className="bg-white/5 backdrop-blur border border-white/10 rounded-lg px-4 py-2.5">
                    <span className="text-white font-bold text-lg">{v}</span>
                    <span className="text-stone-500 text-xs ml-1.5">{l}</span>
                  </div>
                ))}
              </div>
              <p className={`text-xs text-stone-500 mt-6 transition-all duration-1000 delay-500 ${vis ? "opacity-100" : "opacity-0"}`}>
                Md Mohibul Alam · Supervised by Dr. Kuang-Lin Huang
              </p>
            </div>
            <div className={`hidden lg:block transition-all duration-1000 delay-500 ${vis ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                <p className="text-xs font-mono text-stone-500 mb-4 uppercase tracking-wider">Top Adjusted Odds Ratios</p>
                <div className="space-y-2">
                  {results.slice(0, 12).map((d, i) => {
                    const max = results[0].or;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs font-mono text-stone-500 w-16 text-right shrink-0">{d.gene}</span>
                        <div className="flex-1 bg-white/10 rounded-full h-5 relative overflow-hidden">
                          <div className="h-full rounded-full flex items-center" style={{ width: `${Math.max((d.or / max) * 100, 6)}%`, backgroundColor: ec(d.or) }}>
                            <span className="text-[10px] font-bold text-white ml-2 whitespace-nowrap">{d.or.toFixed(1)}×</span>
                          </div>
                        </div>
                        <span className="text-xs text-stone-400 w-20 shrink-0">{d.cancer}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 flex gap-0.5 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${tab === t.id ? "border-stone-900 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"}`}>{t.l}</button>
          ))}
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-8 py-10">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <div className="grid lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold mb-4">Why This Study Exists</h2>
                <div className="space-y-4 text-stone-600 leading-relaxed text-[15px]">
                  <p>Some people are born with inherited DNA variants that significantly increase their risk of developing cancer. These <strong className="text-stone-800">germline pathogenic variants</strong> exist in every cell from birth, passed down from parents.</p>
                  <p>In 2018, Kuang-Lin Huang and colleagues published a landmark study in <em>Cell</em> analyzing these variants across 33 cancer types using TCGA — finding pathogenic variants in ~8% of 10,389 cancer patients.</p>
                  <p>The problem: <strong className="text-stone-800">TCGA is ~80% European ancestry</strong>. Findings may not apply to African, Hispanic, Asian, or other populations — groups already facing cancer disparities.</p>
                  <p>We used the <strong className="text-stone-800">NIH All of Us Research Program</strong> (Nature 2024) — ~50% non-European — to test whether Huang&apos;s findings hold across populations, using <strong className="text-stone-800">logistic regression adjusted for age, sex, and 16 ancestry PCs</strong> against a matched control group.</p>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <h3 className="font-bold text-sm text-stone-500 uppercase tracking-wider mb-3">Key Results</h3>
                  <div className="space-y-4">
                    {[
                      [`${summary.huang_replicated_pct}%`, "Replication", `${summary.huang_replicated_fdr}/${summary.huang_total} Huang associations confirmed at FDR < 0.05`],
                      [String(summary.significant_associations), "Significant", `${summary.replicated} Replicated · ${summary.novel} Novel · ${summary.suggestive} Suggestive`],
                      [results[0] ? `${results[0].or.toFixed(1)}×` : "—", "Strongest Signal", results[0] ? `${results[0].gene} → ${results[0].cancer}, highest adjusted OR` : ""],
                      [String(summary.novel), "Novel Hits", "High-confidence associations new to All of Us: ATM & BRCA2 → Pancreatic, MITF → Melanoma"],
                    ].map(([n, t, d]) => (
                      <div key={t} className="flex gap-3">
                        <div className="text-2xl font-bold text-stone-900 w-16 shrink-0">{n}</div>
                        <div><div className="font-semibold text-sm text-stone-800">{t}</div><div className="text-xs text-stone-500">{d}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-stone-900 text-white rounded-xl p-5">
                  <h3 className="font-bold text-sm text-stone-400 uppercase tracking-wider mb-3">TCGA vs All of Us</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-stone-400">Participants</span><span><span className="text-stone-500">10,389</span> → <span className="font-bold">61,044</span></span></div>
                    <div className="flex justify-between"><span className="text-stone-400">European %</span><span><span className="text-stone-500">~80%</span> → <span className="font-bold">~61%</span></span></div>
                    <div className="flex justify-between"><span className="text-stone-400">Hispanic</span><span><span className="text-stone-500">~3%</span> → <span className="font-bold">~15%</span></span></div>
                    <div className="flex justify-between"><span className="text-stone-400">Black/AA</span><span><span className="text-stone-500">~8%</span> → <span className="font-bold">~14%</span></span></div>
                    <div className="flex justify-between"><span className="text-stone-400">Controls</span><span><span className="text-stone-500">None</span> → <span className="font-bold">30,000</span></span></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-xl mt-12 mb-4">Cohort Composition</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
              {COHORT.map(([n, c, col]) => (
                <div key={n} className="rounded-xl p-3 bg-white border border-stone-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: col }} />
                  <div className="font-bold text-sm mt-1">{c}</div>
                  <div className="text-xs text-stone-500">{n}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-8">Extends Huang et al. (<em>Cell</em>, 2018) using the All of Us Research Program (<em>Nature</em>, 2024). Variant classification per ClinVar / ACMG standards (Richards et al., 2015).</p>
          </div>
        )}

        {/* RESULTS */}
        {tab === "results" && (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold">Gene–Cancer Associations</h2>
                <p className="text-stone-500 text-sm mt-1">Logistic regression · <span className="font-mono text-xs">cancer ~ carrier + age + sex + PC1–PC16</span> · BH FDR &lt; 0.05</p>
              </div>
              <select value={fc} onChange={e => setFc(e.target.value)} className="text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white">{cancers.map(c => <option key={c}>{c}</option>)}</select>
            </div>

            <div className="bg-stone-900 text-white rounded-xl px-6 py-4 mb-6 flex flex-wrap items-center gap-x-8 gap-y-2">
              <div><span className="text-2xl font-bold">{summary.significant_associations}</span><span className="text-stone-400 text-sm ml-2">significant associations</span></div>
              <div className="flex gap-6 text-sm">
                <span><span className="font-bold text-emerald-400">{counts.Replicated}</span> Replicated</span>
                <span><span className="font-bold text-amber-400">{counts.Novel}</span> Novel</span>
                <span><span className="font-bold text-stone-300">{counts.Suggestive}</span> Suggestive</span>
              </div>
            </div>

            <div className="flex gap-1.5 mb-5">
              {["All", "Replicated", "Novel", "Suggestive"].map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${cat === c ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-500 border-stone-200 hover:text-stone-800"}`}>{c}</button>
              ))}
            </div>

            <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-sm min-w-[720px]">
                <thead><tr className="bg-stone-50 border-b border-stone-200 text-xs text-stone-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Cancer</th><th className="text-left px-5 py-3">Gene</th>
                  <th className="text-left px-5 py-3">Category</th><th className="text-right px-5 py-3">Adjusted OR</th>
                  <th className="text-right px-5 py-3">FDR</th><th className="text-right px-5 py-3">Carriers (case / ctrl)</th>
                </tr></thead>
                <tbody>{filtered.map((d, i) => (
                  <tr key={i} className="border-b border-stone-100 hover:bg-stone-50/50 transition">
                    <td className="px-5 py-3 font-medium">{d.cancer}</td>
                    <td className="px-5 py-3 font-mono font-semibold text-stone-700">{d.gene}</td>
                    <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CAT_STYLE[d.category]}`}>{d.category}</span></td>
                    <td className="px-5 py-3 text-right text-lg font-bold" style={{ color: ec(d.or) }}>{d.or.toFixed(1)}×</td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-stone-400">{fmtP(d.fdr)}</td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-stone-500">{d.cc} / {d.ct}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <p className="text-xs text-stone-400 mt-4">Variant classification per ClinVar / ACMG standards (Richards et al., 2015). Replication assessed against Huang et al. (<em>Cell</em>, 2018).</p>
          </div>
        )}

        {/* ANCESTRY (placeholder — PC-adjusted stratified analysis in progress) */}
        {tab === "ancestry" && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> In progress
            </div>
            <h2 className="text-3xl font-bold mb-3">Ancestry-Stratified Analysis in Progress</h2>
            <p className="text-stone-500 leading-relaxed">
              Enrichment stratified by self-reported ancestry (White, Black/AA, Hispanic/Latino, Asian) is being finalized with the same covariate-adjusted logistic-regression model used throughout this study. Results will appear here once the per-ancestry principal-component adjustment is complete.
            </p>
          </div>
        )}

        {/* TCGA */}
        {tab === "tcga" && (
          <div>
            <h2 className="text-3xl font-bold mb-2">TCGA Replication</h2>
            <p className="text-stone-500 text-sm mb-8">Huang et al. reported {summary.huang_total} gene–cancer associations from TCGA. We tested each independently in All of Us using the adjusted model.</p>
            <div className="grid lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 lg:col-span-2">
                <div className="text-5xl font-bold text-emerald-700">{summary.huang_replicated_fdr}/{summary.huang_total}</div>
                <div className="text-sm text-emerald-800 mt-1 font-semibold">Replicated at FDR &lt; 0.05 ({summary.huang_replicated_pct}%)</div>
                <p className="text-xs text-emerald-600 mt-3 leading-relaxed">5 additional associations were nominally significant (raw <em>p</em> &lt; 0.05) but did not survive multiple-testing correction; 1 (ATM→Ovarian) was not significant.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="text-5xl font-bold text-amber-700">{summary.novel}</div>
                <div className="text-sm text-amber-800 mt-1 font-semibold">Novel Associations</div>
                <p className="text-xs text-amber-600 mt-3">High-confidence hits not in Huang et al.: ATM & BRCA2 → Pancreatic, MITF → Melanoma</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="text-5xl font-bold text-blue-700">6×</div>
                <div className="text-sm text-blue-800 mt-1 font-semibold">Larger Cohort</div>
                <p className="text-xs text-blue-600 mt-3">61,044 participants vs TCGA&apos;s 10,389 — with a matched case–control design</p>
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-sm min-w-[640px]"><thead><tr className="bg-stone-50 border-b border-stone-200 text-xs text-stone-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Gene</th><th className="text-left px-5 py-3">Cancer</th>
                <th className="text-right px-5 py-3">Adjusted OR</th><th className="text-right px-5 py-3">FDR</th><th className="text-left px-5 py-3">Status</th>
              </tr></thead>
              <tbody>{repl.map((d, i) => {
                const color = d.status === "Replicated" ? "bg-emerald-50 text-emerald-700" : d.status.startsWith("Nominally") ? "bg-amber-50 text-amber-700" : "bg-stone-100 text-stone-500";
                return (
                  <tr key={i} className={`border-b border-stone-100 ${d.ok ? "hover:bg-stone-50/50" : "bg-stone-50/40"}`}>
                    <td className="px-5 py-3 font-mono font-semibold text-stone-700">{d.gene}</td>
                    <td className="px-5 py-3 font-medium">{d.cancer}</td>
                    <td className="px-5 py-3 text-right font-bold text-lg" style={{ color: d.or ? ec(d.or) : "#a8a29e" }}>{d.or ? `${d.or.toFixed(1)}×` : "—"}</td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-stone-400">{fmtP(d.fdr)}</td>
                    <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>{d.status}</span></td>
                  </tr>
                );
              })}</tbody></table>
            </div>
            <p className="text-xs text-stone-400 mt-4">Comparison against Huang, K.L. et al. (<em>Cell</em>, 2018). Odds ratios from logistic regression adjusted for age, sex, and 16 ancestry PCs.</p>
          </div>
        )}

        {/* METHODS */}
        {tab === "methods" && (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-8">Methodology</h2>
              <div className="space-y-8">
                {[
                  { s: "1", t: "Cohort Construction", d: "Cancer cases across 9 types identified via OMOP diagnosis codes in All of Us EHR data (Controlled Tier v8). Controls: participants with no cancer diagnosis of any type. Total: 31,044 cases + 30,000 controls." },
                  { s: "2", t: "Gene Selection", d: "44 established cancer predisposition genes across 12 pathways: mismatch repair (MLH1, MSH2, MSH6, PMS2), homologous recombination (BRCA1, BRCA2, ATM, PALB2), tumor suppressors (TP53, APC, PTEN), and others." },
                  { s: "3", t: "Variant Extraction", d: "Germline WGS queried from three Controlled Tier tables (cb_variant_attribute_genes, cb_variant_attribute, cb_variant_to_person). Retained only ClinVar Pathogenic / Likely Pathogenic variants per ACMG/AMP standards (Richards et al., 2015)." },
                  { s: "4", t: "Association Analysis", d: "Logistic regression per gene × cancer pair: cancer ~ carrier + age + sex + PC1–PC16 (16 ancestry principal components). The exponentiated carrier coefficient gives the adjusted odds ratio with 95% CI. Benjamini-Hochberg FDR correction, q < 0.05." },
                  { s: "5", t: "Result Categories", d: "Replicated = FDR < 0.05, ≥10 carriers in both groups, in Huang et al. (2018). Novel = same bar, not in Huang et al. Suggestive = FDR < 0.05 but <10 carriers in at least one group." },
                  { s: "6", t: "Ancestry Stratification", d: "Analysis repeated within White, Black/AA, Hispanic/Latino, and Asian groups. Hispanic/Latino assigned from OMOP ethnicity, prioritized over race. Groups with insufficient cases/controls per pair were excluded." },
                  { s: "7", t: "TCGA Comparison", d: "Each of Huang et al.'s 20 reported associations was tested for replication. 14/20 reached FDR < 0.05; 5 were nominally significant (raw p < 0.05) but missed FDR; 1 (ATM→Ovarian) was not significant." },
                ].map(({ s, t, d }) => (
                  <div key={s} className="flex gap-6">
                    <div className="text-3xl font-bold text-stone-200 w-10 shrink-0 text-right">{s}</div>
                    <div><h3 className="font-bold text-lg text-stone-900 mb-1">{t}</h3><p className="text-stone-600 text-sm leading-relaxed">{d}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 rounded-xl p-6 sticky top-20">
                <h3 className="font-bold text-sm text-stone-500 uppercase tracking-wider mb-4">Tools & Stack</h3>
                <div className="space-y-3 text-sm text-stone-600">
                  {[["Data", "All of Us Controlled Tier v8"], ["Query", "BigQuery (OMOP CDR)"], ["Variants", "ClinVar P/LP (ACMG)"], ["Model", "Logistic regression + 16 PCs"], ["Analysis", "Python, pandas, statsmodels"], ["Viz", "React, Tailwind CSS"], ["Deploy", "Vercel"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3"><span className="text-stone-400">{k}</span><span className="font-medium text-right">{v}</span></div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <h3 className="font-bold text-sm text-stone-500 uppercase tracking-wider mb-2">References</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">Huang, K.L. et al. (2018). <em>Cell</em> 173(2), 355–370.</p>
                  <p className="text-xs text-stone-600 leading-relaxed mt-2">All of Us Research Program Genomics Investigators (2024). <em>Nature</em> 627, 340–346.</p>
                  <p className="text-xs text-stone-600 leading-relaxed mt-2">Richards, S. et al. (2015). <em>Genet. Med.</em> 17, 405–424.</p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <p className="text-xs text-stone-400">Aggregate statistics only. No individual-level data displayed. All of Us compliant.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex flex-col sm:flex-row justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-stone-700">Md Mohibul Alam</p>
            <p className="text-xs text-stone-400">Supervised by Dr. Kuang-Lin Huang</p>
          </div>
          <div className="text-xs text-stone-400 sm:text-right">
            <p>Extends Huang et al. (<em>Cell</em>, 2018) · All of Us (<em>Nature</em>, 2024)</p>
            <p>Aggregate data only · All of Us compliant</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
