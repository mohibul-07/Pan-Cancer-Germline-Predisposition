# Pan-Cancer Germline Predisposition Analysis

![Python](https://img.shields.io/badge/Python-3.10+-blue) ![All of Us](https://img.shields.io/badge/NIH-All%20of%20Us-green) ![Associations](https://img.shields.io/badge/Significant%20Associations-54-orange) ![Replication](https://img.shields.io/badge/TCGA%20Replication-95%25-brightgreen) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

A pan-cancer analysis of inherited pathogenic variants across 44 cancer predisposition genes and 9 cancer types, using germline whole genome sequencing data from the NIH All of Us Research Program. This work extends the methodology of [Huang et al. (Cell, 2018)](https://doi.org/10.1016/j.cell.2018.03.039) to a larger, more ancestrally diverse cohort.

**Live Dashboard:** [germline-predisposition.vercel.app](https://germline-predisposition.vercel.app)

---

## Motivation

In 2018, Huang et al. published a landmark study in *Cell* analyzing pathogenic germline variants across 33 cancer types using The Cancer Genome Atlas (TCGA). They identified 853 pathogenic variants in 8% of 10,389 cancer patients and reported 21 significant gene-cancer associations.

However, TCGA has two critical limitations:

1. **Ancestry bias** — approximately 80% of TCGA participants are of European ancestry, meaning findings may not generalize to other populations
2. **No control group** — enrichment was estimated by comparing carrier rates across cancer types rather than against cancer-free individuals

This project addresses both limitations using the NIH All of Us Research Program, which was deliberately designed for ancestral diversity (~50% non-European) and provides access to a large population of participants without cancer diagnoses to serve as proper controls.

## Key Findings

- **20/21 (95%)** of Huang's TCGA gene-cancer associations replicated in All of Us
- **34 novel associations** identified, including VHL→Kidney (49×), FH→Kidney (37×), and BARD1→Breast (7.4×)
- **Ancestry-specific patterns** revealed disparities invisible in TCGA:
  - BRCA2 enrichment in breast cancer: **21× in Black/AA** vs 10.9× in White
  - APC enrichment in colorectal cancer: **57.7× in Hispanic** vs 8.5× in White
  - MLH1 enrichment in colorectal cancer: **80.8× in Hispanic** vs 29× in White

## Dataset

| Parameter | Value |
|---|---|
| Source | NIH All of Us Researcher Workbench — Controlled Tier |
| Total participants | 61,044 |
| Cancer cases | 31,044 (across 9 cancer types) |
| Cancer-free controls | 30,000 |
| Genes analyzed | 44 cancer predisposition genes across 12 pathways |
| Variants retained | ClinVar Pathogenic / Likely Pathogenic only |

### Cancer Types

| Cancer Type | Cases | Cancer Type | Cases |
|---|---|---|---|
| Breast | 11,598 | Lung | 2,435 |
| Prostate | 8,566 | Ovarian | 1,518 |
| Colorectal | 3,610 | Pancreatic | 992 |
| Melanoma | 2,532 | Stomach | 494 |
| Kidney | 2,454 | | |

### Ancestry Distribution

| Ancestry | Participants | % of Cohort |
|---|---|---|
| White | 37,096 | 61% |
| Hispanic/Latino | 8,989 | 15% |
| Black/African American | 8,604 | 14% |
| Other | 4,737 | 8% |
| Asian | 1,618 | 3% |

> ⚠️ Raw participant data is not included in this repository. Only aggregate statistics (carrier frequencies, enrichment ratios) are reported, in compliance with the All of Us Data User Code of Conduct.

## Top Significant Associations

| Gene | Cancer | Enrichment | q-value | Status |
|---|---|---|---|---|
| CDH1 | Stomach | 81× | 3.8e-05 | Known |
| VHL | Kidney | 49× | 8.6e-07 | Novel |
| MSH2 | Colorectal | 42× | 1.5e-14 | Known |
| MLH1 | Colorectal | 39× | 3.1e-20 | Known |
| FH | Kidney | 37× | 3.6e-07 | Novel |
| BRCA1 | Ovarian | 25× | 1.1e-40 | Known |
| APC | Colorectal | 22× | 4.2e-08 | Known |
| CDKN2A | Melanoma | 20× | 4.4e-08 | Known |
| BRCA2 | Ovarian | 14× | 3.8e-26 | Known |
| BRCA1 | Breast | 10× | 3.1e-51 | Known |

**Known** = previously reported in Huang et al. (2018). **Novel** = first identified in this analysis.

Full results for all 54 significant associations are available in `results/significant_associations.csv`.

## Methodology

### 1. Cohort Construction (`01_cohort_construction.ipynb`)

Cancer cases were identified using OMOP diagnosis codes from the All of Us electronic health records. Each cancer type maps to one or more SNOMED concept IDs (e.g., breast cancer includes "Primary malignant neoplasm of female breast" + "Primary malignant neoplasm of male breast" + "Primary malignant neoplasm of breast"). Controls were participants with no cancer-related diagnosis of any type — we excluded anyone with any condition containing "malignant," "carcinoma," "melanoma," "lymphoma," "leukemia," or "sarcoma." A random sample of 30,000 controls was drawn (seed=42) to maintain a ~1:1 case-control ratio.

### 2. Gene Selection

We selected 44 established cancer predisposition genes (CPGs) spanning 12 biological pathways:

| Pathway | Genes |
|---|---|
| Homologous Recombination | BRCA1, BRCA2, PALB2, ATM, CHEK2, RAD51C, RAD51D, BRIP1, NBN, BARD1 |
| Mismatch Repair | MLH1, MSH2, MSH6, PMS2, EPCAM |
| Tumor Suppressor | TP53, APC, PTEN, RB1, CDH1, SMAD4, BMPR1A, STK11 |
| Tyrosine Kinase | RET, MET, KIT, VHL, FH, FLCN |
| TCA Cycle | SDHA, SDHB, SDHD |
| Cell Cycle | CDKN2A, CDK4 |
| RAS/MAPK | NF1, NF2 |
| Base Excision Repair | MUTYH, NTHL1 |
| DNA Replication | POLD1, POLE |
| Transcription Factor | MITF, HOXB13 |
| Chromatin Remodeling | BAP1 |
| WNT Signaling | AXIN2 |

### 3. Variant Extraction & Filtering (`02_germline_variants.ipynb`)

Germline variants were queried from the All of Us Controlled Tier whole genome sequencing data using three BigQuery tables:

- `cb_variant_attribute_genes` — maps variant IDs to gene symbols
- `cb_variant_attribute` — contains ClinVar pathogenicity annotations
- `cb_variant_to_person` — maps variants to carrier person IDs (UNNEST'd from array)

Filtering criteria:
- Gene must be in our 44-gene CPG list
- ClinVar `clinical_significance_string` must contain "pathogenic"
- Must NOT contain "benign" (to exclude "Benign/Likely benign")
- Must NOT contain "conflicting" (to exclude conflicting interpretations)
- Must NOT contain "uncertain" (to exclude mixed VUS classifications)

This conservative filtering yielded 18,881 variant-person records across 41 genes.

### 4. Enrichment Analysis (`03_enrichment_analysis.ipynb`)

For each gene × cancer type combination (333 tests total), we constructed a 2×2 contingency table:

|  | Carrier | Non-carrier |
|---|---|---|
| Cancer cases | a | b |
| Controls | c | d |

We computed:
- **Fisher's exact test** (two-sided p-value)
- **Enrichment ratio** = (a/(a+b)) / (c/(c+d)), i.e., carrier frequency in cases divided by carrier frequency in controls
- **FDR correction** using Benjamini-Hochberg at α = 0.05

54 associations passed the significance threshold.

### 5. Ancestry Stratification (`04_ancestry_stratification.ipynb`)

The enrichment analysis was repeated within four ancestry groups: White, Black/African American, Hispanic/Latino, and Asian. Hispanic/Latino was assigned from the OMOP ethnicity field and prioritized when both race and ethnicity were available. Tests were skipped for ancestry × cancer type groups with fewer than 20 cases or 50 controls.

### 6. TCGA Comparison

Each of Huang et al.'s 21 reported gene-cancer associations was checked for replication in our results. An association was "replicated" if it reached FDR q < 0.05 in our analysis. 20/21 replicated; the sole miss was SDHA→Melanoma (Huang's novel finding with limited TCGA sample size).

## Repository Structure

```
├── notebooks/
│   ├── 01_cohort_construction.ipynb     # OMOP queries, case/control cohort building
│   ├── 02_germline_variants.ipynb       # WGS variant extraction, ClinVar filtering
│   ├── 03_enrichment_analysis.ipynb     # Fisher's exact test, FDR correction
│   └── 04_ancestry_stratification.ipynb # Ancestry-specific enrichment analysis
│
├── results/
│   ├── enrichment_results.csv           # All 333 gene × cancer test results
│   ├── significant_associations.csv     # 54 FDR-significant associations
│   ├── ancestry_enrichment.csv          # Ancestry-stratified enrichment results
│   └── replication_summary.csv          # TCGA comparison table
│
├── src/                                 # React dashboard (Vite + Tailwind)
│   └── App.jsx                          # Interactive results visualization
│
├── README.md
└── package.json
```

## Getting Started

### Viewing the Results

The easiest way to explore the results is through the [live dashboard](https://germline-predisposition.vercel.app). It includes an overview of the study, interactive results tables with cancer-type filtering, ancestry-stratified enrichment, TCGA comparison, and full methodology.

Alternatively, the CSV files in `results/` contain all aggregate statistics and can be loaded in Python, R, or any spreadsheet tool.

### Running the Dashboard Locally

```bash
git clone https://github.com/mohibul-07/pan-cancer-germline-predisposition.git
cd pan-cancer-germline-predisposition
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Reproducing the Analysis

The analysis notebooks require access to the NIH All of Us Researcher Workbench (Controlled Tier). To reproduce:

1. Apply for All of Us Researcher Workbench access at [researchallofus.org](https://researchallofus.org)
2. Complete the required training and sign the Data User Code of Conduct
3. Create a new workspace with Controlled Tier data access
4. Upload the notebooks from `notebooks/` to your workspace
5. Run them in order (01 → 02 → 03 → 04)

Each notebook saves checkpoint files so you can resume from any stage. The cohort construction queries take a few minutes; the variant extraction query takes 5-10 minutes depending on cluster load.

### Extending the Analysis

If you want to build on this work, here are some directions:

- **Add more cancer types** — All of Us has data for many cancer types beyond our 9. Add new OMOP concept IDs to the `cancer_type_map` in Notebook 01.
- **Expand the gene list** — We used 44 CPGs. Huang's full list includes ~152 genes. Additional genes can be added to the `cpg_genes` dictionary in Notebook 02.
- **Integrate PRS** — A polygenic risk score (PRS) pipeline could complement the rare variant analysis. See the [colorectal-cancer-risk-prediction](https://github.com/mohibul-07/colorectal-cancer-risk-prediction) repo for an in-progress PRS pipeline on All of Us.
- **Loss of heterozygosity (LOH)** — Huang's Cell paper included a two-hit analysis checking whether tumors lost the second gene copy. This requires somatic data, which All of Us is beginning to release.
- **Add more ancestry groups** — Middle Eastern/North African and multi-ancestry participants in All of Us could be analyzed as sample sizes grow.

## Tools & Dependencies

- **Data:** NIH All of Us Researcher Workbench — Controlled Tier
- **Query:** BigQuery (OMOP CDR schema)
- **Variants:** ClinVar pathogenicity annotations
- **Analysis:** Python 3.10+, pandas, SciPy (Fisher's exact test), statsmodels (FDR correction)
- **Dashboard:** React, Vite, Tailwind CSS
- **Deployment:** Vercel

## References

- Huang, K.L., et al. (2018). Pathogenic Germline Variants in 10,389 Adult Cancers. *Cell*, 173(2), 355-370. [DOI: 10.1016/j.cell.2018.03.039](https://doi.org/10.1016/j.cell.2018.03.039)
- Carrot-Zhang, J., ..., Huang, K.L., et al. (2020). Ancestry-specific predisposing germline variants in cancer. *Genome Medicine*, 12, 51. [DOI: 10.1186/s13073-020-00744-3](https://doi.org/10.1186/s13073-020-00744-3)
- The All of Us Research Program. [researchallofus.org](https://researchallofus.org)

## Citation

```
Alam, M. (2026). Pan-Cancer Germline Predisposition Analysis
Using the NIH All of Us Research Program.
Queensborough Community College, CUNY.
```

## License

MIT
