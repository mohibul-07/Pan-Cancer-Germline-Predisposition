import { useState, useMemo, useEffect } from "react";

const data = [
  {cancer:"Stomach",gene:"CDH1",e:80.97,q:3.81e-5,s:"known",pw:"Tumor Suppressor"},
  {cancer:"Kidney",gene:"VHL",e:48.90,q:8.62e-7,s:"novel",pw:"Tyrosine Kinase"},
  {cancer:"Stomach",gene:"MSH2",e:45.55,q:1.56e-3,s:"novel",pw:"Mismatch Repair"},
  {cancer:"Colorectal",gene:"MSH2",e:41.55,q:1.53e-14,s:"known",pw:"Mismatch Repair"},
  {cancer:"Colorectal",gene:"MLH1",e:38.78,q:3.14e-20,s:"known",pw:"Mismatch Repair"},
  {cancer:"Ovarian",gene:"PTEN",e:39.53,q:4.40e-2,s:"novel",pw:"Tumor Suppressor"},
  {cancer:"Kidney",gene:"FH",e:36.67,q:3.64e-7,s:"novel",pw:"Tyrosine Kinase"},
  {cancer:"Stomach",gene:"MLH1",e:30.36,q:3.14e-3,s:"novel",pw:"Mismatch Repair"},
  {cancer:"Ovarian",gene:"BRCA1",e:24.58,q:1.14e-40,s:"known",pw:"Homologous Recombination"},
  {cancer:"Pancreatic",gene:"APC",e:24.19,q:1.33e-3,s:"novel",pw:"Tumor Suppressor"},
  {cancer:"Colorectal",gene:"APC",e:21.61,q:4.20e-8,s:"known",pw:"Tumor Suppressor"},
  {cancer:"Melanoma",gene:"CDKN2A",e:20.31,q:4.38e-8,s:"known",pw:"Cell Cycle"},
  {cancer:"Ovarian",gene:"BRCA2",e:13.97,q:3.80e-26,s:"known",pw:"Homologous Recombination"},
  {cancer:"Breast",gene:"BRCA1",e:10.22,q:3.13e-51,s:"known",pw:"Homologous Recombination"},
  {cancer:"Breast",gene:"BRCA2",e:10.12,q:1.42e-71,s:"known",pw:"Homologous Recombination"},
  {cancer:"Melanoma",gene:"TP53",e:9.22,q:1.24e-3,s:"novel",pw:"Tumor Suppressor"},
  {cancer:"Pancreatic",gene:"BRCA2",e:7.82,q:2.43e-7,s:"known",pw:"Homologous Recombination"},
  {cancer:"Breast",gene:"BARD1",e:7.44,q:2.11e-6,s:"novel",pw:"Homologous Recombination"},
  {cancer:"Pancreatic",gene:"ATM",e:6.63,q:5.07e-7,s:"known",pw:"Homologous Recombination"},
  {cancer:"Melanoma",gene:"MITF",e:5.58,q:9.68e-11,s:"novel",pw:"Transcription Factor"},
  {cancer:"Breast",gene:"NF1",e:5.46,q:2.00e-4,s:"novel",pw:"RAS/MAPK"},
  {cancer:"Colorectal",gene:"MSH6",e:5.38,q:5.62e-7,s:"known",pw:"Mismatch Repair"},
  {cancer:"Breast",gene:"TP53",e:4.89,q:9.60e-4,s:"known",pw:"Tumor Suppressor"},
  {cancer:"Breast",gene:"PALB2",e:4.47,q:1.12e-10,s:"known",pw:"Homologous Recombination"},
  {cancer:"Colorectal",gene:"PMS2",e:4.50,q:9.60e-4,s:"known",pw:"Mismatch Repair"},
  {cancer:"Prostate",gene:"BRCA2",e:3.32,q:2.90e-8,s:"known",pw:"Homologous Recombination"},
  {cancer:"Breast",gene:"CHEK2",e:3.15,q:7.82e-4,s:"known",pw:"Homologous Recombination"},
  {cancer:"Lung",gene:"BRCA2",e:3.19,q:2.87e-3,s:"novel",pw:"Homologous Recombination"},
  {cancer:"Breast",gene:"ATM",e:2.52,q:1.20e-6,s:"known",pw:"Homologous Recombination"},
];

const ancestryData = [
  {cancer:"Breast",gene:"BRCA1",white:"8.0×*",black:"10.1×*",hispanic:"11.7×*",asian:"inf×"},
  {cancer:"Breast",gene:"BRCA2",white:"10.9×*",black:"21.0×*",hispanic:"6.2×*",asian:"3.3×"},
  {cancer:"Ovarian",gene:"BRCA1",white:"22.3×*",black:"13.3×",hispanic:"19.2×*",asian:"inf×"},
  {cancer:"Ovarian",gene:"BRCA2",white:"14.6×*",black:"24.9×*",hispanic:"12.3×*",asian:"\u2014"},
  {cancer:"Colorectal",gene:"MLH1",white:"29.0×*",black:"inf×*",hispanic:"80.8×*",asian:"\u2014"},
  {cancer:"Colorectal",gene:"MSH2",white:"95.5×*",black:"20.7×",hispanic:"inf×",asian:"\u2014"},
  {cancer:"Colorectal",gene:"APC",white:"8.5×*",black:"\u2014",hispanic:"57.7×*",asian:"\u2014"},
  {cancer:"Melanoma",gene:"CDKN2A",white:"31.8×*",black:"\u2014",hispanic:"\u2014",asian:"\u2014"},
  {cancer:"Kidney",gene:"VHL",white:"inf×*",black:"inf×*",hispanic:"\u2014",asian:"\u2014"},
  {cancer:"Stomach",gene:"CDH1",white:"126.5×*",black:"\u2014",hispanic:"\u2014",asian:"\u2014"},
  {cancer:"Pancreatic",gene:"ATM",white:"6.1×*",black:"8.4×",hispanic:"9.1×",asian:"\u2014"},
  {cancer:"Prostate",gene:"BRCA2",white:"3.0×*",black:"5.0×",hispanic:"4.5×*",asian:"3.0×"},
];

const tcgaData = [
  {gene:"BRCA1",cancer:"Breast",h:"known",e:10.2,ok:true},{gene:"BRCA1",cancer:"Ovarian",h:"known",e:24.6,ok:true},
  {gene:"BRCA2",cancer:"Breast",h:"known",e:10.1,ok:true},{gene:"BRCA2",cancer:"Ovarian",h:"known",e:14.0,ok:true},
  {gene:"ATM",cancer:"Breast",h:"known",e:2.5,ok:true},{gene:"CHEK2",cancer:"Breast",h:"known",e:3.1,ok:true},
  {gene:"PALB2",cancer:"Breast",h:"known",e:4.5,ok:true},{gene:"TP53",cancer:"Breast",h:"known",e:4.9,ok:true},
  {gene:"BRCA2",cancer:"Prostate",h:"known",e:3.3,ok:true},{gene:"ATM",cancer:"Prostate",h:"emerging",e:2.2,ok:true},
  {gene:"MLH1",cancer:"Colorectal",h:"known",e:38.8,ok:true},{gene:"MSH2",cancer:"Colorectal",h:"known",e:41.5,ok:true},
  {gene:"MSH6",cancer:"Colorectal",h:"known",e:5.4,ok:true},{gene:"PMS2",cancer:"Colorectal",h:"known",e:4.5,ok:true},
  {gene:"APC",cancer:"Colorectal",h:"known",e:21.6,ok:true},{gene:"BRCA1",cancer:"Pancreatic",h:"emerging",e:5.2,ok:true},
  {gene:"BRCA2",cancer:"Pancreatic",h:"known",e:7.8,ok:true},{gene:"ATM",cancer:"Pancreatic",h:"known",e:6.6,ok:true},
  {gene:"CDKN2A",cancer:"Melanoma",h:"known",e:20.3,ok:true},{gene:"CDH1",cancer:"Stomach",h:"known",e:81.0,ok:true},
  {gene:"SDHA",cancer:"Melanoma",h:"novel",e:0.6,ok:false},
];

function ec(v){return v>=20?"#b91c1c":v>=10?"#dc2626":v>=5?"#ea580c":v>=2?"#d97706":"#6b7280";}

function FloatingGenes() {
  const genes = ["BRCA1","BRCA2","TP53","MLH1","APC","ATM","PTEN","VHL","CDH1","CHEK2","PALB2","MSH2","CDKN2A","NF1","FH","MITF"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {genes.map((g,i) => (
        <span key={g} className="absolute font-mono text-white/[0.04] text-sm" style={{
          left: `${5 + (i * 6) % 90}%`,
          top: `${10 + (i * 17) % 75}%`,
          fontSize: `${12 + (i % 4) * 4}px`,
          animation: `float ${8 + i % 5}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.4}s`,
        }}>{g}</span>
      ))}
      <style>{`@keyframes float { from { transform: translateY(0px) } to { transform: translateY(-20px) } }`}</style>
    </div>
  );
}

function EnrichmentBar({ items }) {
  const max = Math.max(...items.map(d => d.e));
  return (
    <div className="space-y-2">
      {items.slice(0, 12).map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs font-mono text-stone-500 w-20 text-right shrink-0">{d.gene}</span>
          <div className="flex-1 bg-stone-100 rounded-full h-5 relative overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000 flex items-center" style={{
              width: `${Math.max((d.e / max) * 100, 3)}%`,
              backgroundColor: ec(d.e),
            }}>
              <span className="text-[10px] font-bold text-white ml-2 whitespace-nowrap">{d.e.toFixed(0)}×</span>
            </div>
          </div>
          <span className="text-xs text-stone-400 w-20 shrink-0">{d.cancer}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("overview");
  const [fc, setFc] = useState("All");
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);
  const types = useMemo(() => ["All", ...[...new Set(data.map(d => d.cancer))].sort()], []);
  const filtered = useMemo(() => fc === "All" ? data : data.filter(d => d.cancer === fc), [fc]);
  const tabs = [{id:"overview",l:"Overview"},{id:"results",l:"Results"},{id:"ancestry",l:"Ancestry"},{id:"tcga",l:"TCGA Replication"},{id:"methods",l:"Methods"}];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">

      {/* ── HERO ── */}
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
                Do inherited cancer risk genes affect all populations equally? We analyzed 61,044 participants to find out — extending Huang et al.&apos;s landmark <em>Cell</em> (2018) study to the most diverse genomic cohort available.
              </p>
              <div className={`flex flex-wrap gap-2.5 mt-8 transition-all duration-1000 delay-400 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {[["61,044","Participants"],["9","Cancers"],["44","Genes"],["54","Significant"],["95%","Replicated"],["34","Novel"]].map(([v,l])=>(
                  <div key={l} className="bg-white/5 backdrop-blur border border-white/10 rounded-lg px-4 py-2.5">
                    <span className="text-white font-bold text-lg">{v}</span>
                    <span className="text-stone-500 text-xs ml-1.5">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`hidden lg:block transition-all duration-1000 delay-500 ${vis ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                <p className="text-xs font-mono text-stone-500 mb-4 uppercase tracking-wider">Top Enrichment Signals</p>
                <EnrichmentBar items={data} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── NAV ── */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 flex gap-0.5 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                tab === t.id ? "border-stone-900 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"
              }`}>{t.l}</button>
          ))}
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <main className="max-w-[1400px] mx-auto px-8 py-10">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <div className="grid lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold mb-4">Why This Study Exists</h2>
                <div className="space-y-4 text-stone-600 leading-relaxed text-[15px]">
                  <p>Some people are born with inherited DNA variants that significantly increase their risk of developing cancer. These <strong className="text-stone-800">germline pathogenic variants</strong> exist in every cell from birth, passed down from parents.</p>
                  <p>In 2018, Kuan-Lin Huang and colleagues published a landmark study in <em>Cell</em> analyzing these variants across 33 cancer types using TCGA. They found pathogenic variants in 8% of 10,389 cancer patients and identified 21 gene–cancer associations.</p>
                  <p>The problem: <strong className="text-stone-800">TCGA is ~80% European ancestry</strong>. Findings may not apply to African, Hispanic, Asian, or other populations — groups already facing cancer disparities.</p>
                  <p>We used the <strong className="text-stone-800">NIH All of Us Research Program</strong> — deliberately designed for diversity with ~50% non-European participants — to test whether Huang&apos;s findings hold across all populations, and what new patterns emerge.</p>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <h3 className="font-bold text-sm text-stone-500 uppercase tracking-wider mb-3">Key Results</h3>
                  <div className="space-y-4">
                    {[
                      ["95%", "Replication", "20/21 TCGA associations confirmed in All of Us"],
                      ["34", "Novel Hits", "New gene-cancer links including VHL→Kidney (49×)"],
                      ["2×", "BRCA2 Disparity", "21× enrichment in Black/AA vs 10.9× in White breast cancer"],
                      ["7×", "APC Disparity", "57.7× in Hispanic vs 8.5× in White colorectal cancer"],
                    ].map(([num, title, desc]) => (
                      <div key={title} className="flex gap-3">
                        <div className="text-2xl font-bold text-stone-900 w-14 shrink-0">{num}</div>
                        <div><div className="font-semibold text-sm text-stone-800">{title}</div><div className="text-xs text-stone-500">{desc}</div></div>
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
                    <div className="flex justify-between"><span className="text-stone-400">Control group</span><span><span className="text-stone-500">None</span> → <span className="font-bold">30,000</span></span></div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-xl mt-12 mb-4">Cohort Composition</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
              {[["Breast","11,598","#e11d48"],["Prostate","8,566","#7c3aed"],["Colorectal","3,610","#059669"],["Melanoma","2,532","#d97706"],["Kidney","2,454","#0284c7"],["Lung","2,435","#64748b"],["Ovarian","1,518","#db2777"],["Pancreatic","992","#854d0e"],["Stomach","494","#0d9488"],["Controls","30,000","#374151"]].map(([n,c,col])=>(
                <div key={n} className="rounded-xl p-3 bg-white border border-stone-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1" style={{backgroundColor:col}}/>
                  <div className="font-bold text-sm mt-1">{c}</div>
                  <div className="text-xs text-stone-500">{n}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS */}
        {tab === "results" && (
          <div>
            <div className="flex items-start justify-between mb-6">
              <div><h2 className="text-3xl font-bold">Gene–Cancer Associations</h2><p className="text-stone-500 text-sm mt-1">Fisher's exact test · FDR q &lt; 0.05 · Enrichment = carrier frequency in cases ÷ controls</p></div>
              <select value={fc} onChange={e => setFc(e.target.value)} className="text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white">{types.map(c=><option key={c}>{c}</option>)}</select>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead><tr className="bg-stone-50 border-b border-stone-200 text-xs text-stone-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Cancer</th><th className="text-left px-5 py-3">Gene</th><th className="text-left px-5 py-3">Pathway</th>
                  <th className="text-right px-5 py-3">Enrichment</th><th className="text-left px-5 py-3 w-64">Magnitude</th>
                  <th className="text-right px-5 py-3">q-value</th><th className="text-center px-5 py-3">Status</th>
                </tr></thead>
                <tbody>{filtered.map((d,i)=>(<tr key={i} className="border-b border-stone-100 hover:bg-stone-50/50 transition">
                  <td className="px-5 py-3 font-medium">{d.cancer}</td>
                  <td className="px-5 py-3 font-mono font-semibold text-stone-700">{d.gene}</td>
                  <td className="px-5 py-3 text-xs text-stone-400">{d.pw}</td>
                  <td className="px-5 py-3 text-right text-lg font-bold" style={{color:ec(d.e)}}>{d.e.toFixed(1)}×</td>
                  <td className="px-5 py-3"><div className="w-full bg-stone-100 rounded-full h-2.5"><div className="h-2.5 rounded-full transition-all" style={{width:`${Math.min((Math.log2(d.e+1)/Math.log2(82))*100,100)}%`,backgroundColor:ec(d.e)}}/></div></td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-stone-400">{d.q<0.001?d.q.toExponential(1):d.q.toFixed(3)}</td>
                  <td className="px-5 py-3 text-center"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${d.s==="known"?"bg-blue-50 text-blue-700":"bg-amber-50 text-amber-700"}`}>{d.s==="known"?"Known":"Novel"}</span></td>
                </tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANCESTRY */}
        {tab === "ancestry" && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Ancestry-Stratified Enrichment</h2>
            <p className="text-stone-500 text-sm mb-8 max-w-3xl">Same gene, same cancer — different risk across populations. * = significant (FDR &lt; 0.05). — = too few samples.</p>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm"><thead><tr className="bg-stone-50 border-b border-stone-200 text-xs text-stone-500 uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Cancer</th><th className="text-left px-5 py-3">Gene</th>
                    <th className="text-center px-5 py-3">White</th><th className="text-center px-5 py-3">Black/AA</th>
                    <th className="text-center px-5 py-3">Hispanic</th><th className="text-center px-5 py-3">Asian</th>
                  </tr></thead>
                  <tbody>{ancestryData.map((d,i)=>(<tr key={i} className="border-b border-stone-100 hover:bg-stone-50/50">
                    <td className="px-5 py-3 font-medium">{d.cancer}</td><td className="px-5 py-3 font-mono text-stone-700">{d.gene}</td>
                    {["white","black","hispanic","asian"].map(a=>{const v=d[a];const sig=v.includes("*");const na=v==="\u2014";return(
                      <td key={a} className="px-5 py-3 text-center"><span className={`font-mono text-sm ${na?"text-stone-300":sig?"font-bold text-stone-900":"text-stone-500"}`}>{v}</span></td>
                    );})}
                  </tr>))}</tbody></table>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  {title:"BRCA2 → Breast",stat:"21× Black/AA vs 10.9× White",desc:"Nearly double the enrichment — critical for screening guidelines developed from European data.",color:"bg-rose-50 border-rose-200 text-rose-800"},
                  {title:"APC → Colorectal",stat:"57.7× Hispanic vs 8.5× White",desc:"7-fold difference. APC-driven colorectal cancer may disproportionately affect Hispanic communities.",color:"bg-amber-50 border-amber-200 text-amber-800"},
                  {title:"MLH1 → Colorectal",stat:"80.8× Hispanic vs 29× White",desc:"Lynch syndrome variants are far more enriched in Hispanic populations than TCGA could detect.",color:"bg-emerald-50 border-emerald-200 text-emerald-800"},
                ].map(d => (
                  <div key={d.title} className={`${d.color} border rounded-xl p-5`}>
                    <div className="font-bold text-sm">{d.title}</div>
                    <div className="font-mono font-bold text-lg mt-1">{d.stat}</div>
                    <p className="text-xs mt-2 opacity-80">{d.desc}</p>
                  </div>
                ))}
                <div className="bg-stone-900 text-white rounded-xl p-5">
                  <p className="text-sm text-stone-300 leading-relaxed">These patterns were <strong className="text-white">invisible in TCGA</strong> with ~80% European participants. All of Us was built to reveal exactly these disparities.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TCGA */}
        {tab === "tcga" && (
          <div>
            <h2 className="text-3xl font-bold mb-2">TCGA Replication</h2>
            <p className="text-stone-500 text-sm mb-8">Huang et al. reported 21 gene–cancer associations from TCGA. We tested each one independently in All of Us.</p>
            <div className="grid lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 lg:col-span-2">
                <div className="text-5xl font-bold text-emerald-700">95%</div>
                <div className="text-sm text-emerald-800 mt-1 font-semibold">Replication Rate</div>
                <p className="text-xs text-emerald-600 mt-3 leading-relaxed">20 of 21 associations confirmed. The only miss: SDHA→Melanoma, Huang&apos;s novel finding with limited TCGA samples.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="text-5xl font-bold text-amber-700">34</div>
                <div className="text-sm text-amber-800 mt-1 font-semibold">Novel Associations</div>
                <p className="text-xs text-amber-600 mt-3">VHL→Kidney 49×, FH→Kidney 37×, BARD1→Breast 7.4×</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="text-5xl font-bold text-blue-700">6×</div>
                <div className="text-sm text-blue-800 mt-1 font-semibold">Larger Cohort</div>
                <p className="text-xs text-blue-600 mt-3">61,044 participants vs TCGA&apos;s 10,389 — with proper case-control design</p>
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm"><thead><tr className="bg-stone-50 border-b border-stone-200 text-xs text-stone-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Gene</th><th className="text-left px-5 py-3">Cancer</th><th className="text-center px-5 py-3">Huang Status</th><th className="text-right px-5 py-3">Our Enrichment</th><th className="text-center px-5 py-3">Replicated</th>
              </tr></thead>
              <tbody>{tcgaData.map((d,i)=>(<tr key={i} className={`border-b border-stone-100 ${!d.ok?"bg-red-50/50":"hover:bg-stone-50/50"}`}>
                <td className="px-5 py-3 font-mono font-semibold text-stone-700">{d.gene}</td><td className="px-5 py-3 font-medium">{d.cancer}</td>
                <td className="px-5 py-3 text-center"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${d.h==="known"?"bg-stone-100 text-stone-600":d.h==="emerging"?"bg-blue-50 text-blue-600":"bg-purple-50 text-purple-600"}`}>{d.h}</span></td>
                <td className="px-5 py-3 text-right font-bold text-lg" style={{color:ec(d.e)}}>{d.e.toFixed(1)}×</td>
                <td className="px-5 py-3 text-center text-xl">{d.ok?"✅":"❌"}</td>
              </tr>))}</tbody></table>
            </div>
          </div>
        )}

        {/* METHODS */}
        {tab === "methods" && (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-8">Methodology</h2>
              <div className="space-y-8">
                {[
                  {s:"1",t:"Cohort Construction",d:"Identified cancer cases across 9 major types using OMOP diagnosis codes in All of Us EHR data. Controls: participants with no cancer diagnosis of any type. Total: 31,044 cases + 30,000 controls."},
                  {s:"2",t:"Gene Selection",d:"44 established cancer predisposition genes spanning 12 pathways: mismatch repair (MLH1, MSH2, MSH6, PMS2), homologous recombination (BRCA1, BRCA2, ATM, PALB2), tumor suppressors (TP53, APC, PTEN), and others."},
                  {s:"3",t:"Variant Extraction",d:"Queried germline WGS from the Controlled Tier. Retained only ClinVar 'Pathogenic' or 'Likely pathogenic' variants. Excluded mixed/uncertain classifications for high-confidence calls."},
                  {s:"4",t:"Enrichment Testing",d:"Fisher's exact test on 2×2 contingency tables (carriers vs non-carriers × cases vs controls) for each gene × cancer pair. Benjamini-Hochberg FDR correction across 333 tests, q < 0.05."},
                  {s:"5",t:"Ancestry Stratification",d:"Repeated analysis within White, Black/AA, Hispanic/Latino, and Asian groups. Hispanic/Latino from OMOP ethnicity field, prioritized over race. Groups with <20 cases or <50 controls excluded."},
                  {s:"6",t:"TCGA Comparison",d:"Compared our significant associations against Huang et al.'s 21 reported findings. 'Replicated' = significant at q < 0.05 in our analysis. 'Novel' = significant here but not in TCGA."},
                ].map(({s,t,d}) => (
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
                  {[["Data","NIH All of Us Controlled Tier"],["Query","BigQuery (OMOP CDR)"],["Variants","ClinVar P/LP annotations"],["Analysis","Python, SciPy, statsmodels"],["Viz","React, Tailwind CSS"],["Deploy","Vercel"]].map(([k,v])=>(
                    <div key={k} className="flex justify-between"><span className="text-stone-400">{k}</span><span className="font-medium">{v}</span></div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <h3 className="font-bold text-sm text-stone-500 uppercase tracking-wider mb-2">Reference</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">Huang, K.L., et al. (2018). Pathogenic Germline Variants in 10,389 Adult Cancers. <em>Cell</em>, 173(2), 355-370.</p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <p className="text-xs text-stone-400">Aggregate statistics only. No individual data displayed. All of Us compliant.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex flex-col sm:flex-row justify-between gap-2">
          <div><p className="text-sm font-semibold text-stone-700">Md Mohibul Alam</p><p className="text-xs text-stone-400">Queensborough Community College, CUNY · Advisor: Prof. Zeynep Akcay Ozkan</p></div>
          <div className="text-xs text-stone-400 sm:text-right"><p>CUNY Research Scholars Program</p><p>Aggregate data only · All of Us compliant</p></div>
        </div>
      </footer>
    </div>
  );
}
