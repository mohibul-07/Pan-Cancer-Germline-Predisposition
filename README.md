# Pan-Cancer Germline Predisposition Analysis

![Python](https://img.shields.io/badge/Python-3.10+-blue) ![All of Us](https://img.shields.io/badge/NIH-All%20of%20Us-green) ![Associations](https://img.shields.io/badge/Significant%20Associations-35-orange) ![Replication](https://img.shields.io/badge/TCGA%20Replication-70%25-brightgreen) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

A pan-cancer analysis of inherited pathogenic variants across 44 cancer predisposition genes and 9 cancer types, using germline whole-genome sequencing data from the NIH All of Us Research Program. This work extends the methodology of [Huang et al. (*Cell*, 2018)](https://doi.org/10.1016/j.cell.2018.03.039) to a larger, more ancestrally diverse cohort with a matched control group and covariate-adjusted modeling.

**Author:** Md Mohibul Alam
**Supervisor:** Dr. Kuang-Lin Huang

**Live Dashboard:** [pan-cancer-germline-predisposition.vercel.app](https://pan-cancer-germline-predisposition.vercel.app)

---

## Motivation

In 2018, Huang et al. published a landmark study in *Cell* analyzing pathogenic germline variants across 33 cancer types using The Cancer Genome Atlas (TCGA). They identified pathogenic variants in ~8% of 10,389 cancer patients and reported gene–cancer predisposition associations.

However, TCGA has two critical limitations:

1. **Ancestry bias** — approximately 80% of TCGA participants are of European ancestry, so findings may not generalize to other populations.
2. **No matched control group** — enrichment was estimated by comparing carrier rates across cancer types rather than against cancer-free individuals.

This project addresses both limitations using the NIH All of Us Research Program ([All of Us Research Program Genomics Investigators, *Nature*, 2024](https://doi.org/10.1038/s41586-023-06957-x)), which was deliberately designed for ancestral diversity (~50% non-European) and provides a large population of cancer-free participants to serve as proper controls. Associations are estimated with **logistic regression adjusted for age, sex, and 16 ancestry principal components** — rather than an unadjusted contingency-table test — to guard against population-structure and demographic confounding.

## Key Findings

- **14/20 (70%)** of Huang's TCGA gene–cancer associations replicated at FDR < 0.05 in All of Us. A further 5 were nominally significant (raw *p* < 0.05) but did not survive multiple-testing correction, and 1 (ATM→Ovarian) was not significant.
- **35 significant associations** overall (FDR < 0.05), grouped into three tiers:
  - **8 Replicated** — FDR < 0.05, ≥10 carriers in both cases and controls, and reported in Huang et al.
  - **3 Novel** — same statistical bar, not reported in Huang et al.: ATM→Pancreatic (5.9×), BRCA2→Pancreatic (6.2×), MITF→Melanoma (2.8×)
  - **24 Suggestive** — FDR < 0.05 but with <10 carriers in at least one group
- **Ancestry-stratified analysis is in progress** — per-ancestry associations are being finalized with the same covariate-adjusted logistic-regression model and will be reported once complete.

## Dataset

| Parameter | Value |
|---|---|
| Source | NIH All of Us Researcher Workbench — Controlled Tier (v8) |
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

> ⚠️ Raw participant data is not included in this repository. Only aggregate statistics (carrier counts, odds ratios) are reported, in compliance with the All of Us Data User Code of Conduct.

## Top Significant Associations

| Gene | Cancer | Adjusted OR | FDR | Category |
|---|---|---|---|---|
| BRCA1 | Ovarian | 25.6× | 3.1e-30 | Replicated |
| BRCA1 | Breast | 14.8× | 3.2e-33 | Replicated |
| BRCA2 | Breast | 10.9× | 4.9e-34 | Replicated |
| BRCA2 | Ovarian | 10.9× | 1.7e-19 | Replicated |
| PALB2 | Breast | 6.6× | 2.0e-08 | Replicated |
| BRCA2 | Prostate | 4.0× | 1.6e-05 | Replicated |
| MSH6 | Colorectal | 4.4× | 2.2e-05 | Replicated |
| ATM | Prostate | 2.7× | 1.4e-02 | Replicated |
| BRCA2 | Pancreatic | 6.2× | 1.8e-07 | Novel |
| ATM | Pancreatic | 5.9× | 5.9e-08 | Novel |
| MITF | Melanoma | 2.8× | 2.5e-04 | Novel |

**Replicated** = FDR < 0.05, ≥10 carriers in both groups, reported in Huang et al. (2018). **Novel** = same bar, first identified here. **Suggestive** (not shown) = FDR < 0.05 but limited carriers. Full results for all 35 associations are in `fdr_significant_results.csv`.

## Methodology

### 1. Cohort Construction

Cancer cases were identified using OMOP diagnosis codes from the All of Us electronic health records, mapping each cancer type to its SNOMED concept IDs. Controls were participants with no cancer-related diagnosis of any type (excluding any condition containing "malignant," "carcinoma," "melanoma," "lymphoma," "leukemia," or "sarcoma"). A random sample of 30,000 controls was drawn (seed = 42) for a ~1:1 case–control ratio.

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

### 3. Variant Extraction & Filtering

Germline variants were queried from the All of Us Controlled Tier whole-genome sequencing data using three BigQuery tables:

- `cb_variant_attribute_genes` — maps variant IDs to gene symbols
- `cb_variant_attribute` — contains ClinVar pathogenicity annotations
- `cb_variant_to_person` — maps variants to carrier person IDs

Following ACMG/AMP interpretation standards ([Richards et al., *Genet. Med.*, 2015](https://doi.org/10.1038/gim.2015.30)), only ClinVar Pathogenic or Likely Pathogenic variants were retained; benign, conflicting, and uncertain-significance classifications were excluded. A participant was defined as a **carrier** for a gene if they carried at least one P/LP variant in it.

### 4. Association Analysis (Logistic Regression)

For each gene × cancer-type pair, cancer status was modeled as a function of carrier status with demographic and ancestry covariates:

```
cancer ~ carrier + age + sex + PC1 + ... + PC16
```

where PC1–PC16 are the 16 ancestry principal components provided in All of Us v8. The exponentiated carrier coefficient gives the **adjusted odds ratio (OR)** with its 95% confidence interval. *p*-values were corrected across all tested pairs using the Benjamini–Hochberg procedure (FDR, α = 0.05). This adjusted model supersedes an earlier unadjusted contingency-table analysis; only the covariate-adjusted logistic-regression results are reported here and on the dashboard.

Significant associations (FDR < 0.05) were classified into three tiers:

- **Replicated** — ≥10 carriers in both groups and present in Huang et al. (2018)
- **Novel** — ≥10 carriers in both groups but not in Huang et al.
- **Suggestive** — FDR-significant but <10 carriers in at least one group

### 5. Ancestry Stratification (in progress)

The logistic-regression analysis is being repeated within four self-reported ancestry groups (White, Black/African American, Hispanic/Latino, Asian), each adjusted for age, sex, and ancestry PCs. Hispanic/Latino is assigned from the OMOP ethnicity field, prioritized over race; groups with too few cases or controls for a given gene × cancer pair are skipped. Per-ancestry results are being finalized and will be added to the dashboard and this repository once the principal-component adjustment is complete.

### 6. TCGA Comparison

Each of the 20 gene–cancer associations reported by Huang et al. was tested for replication in All of Us. An association was counted as **replicated** if it reached FDR < 0.05 in our adjusted model. 14/20 replicated; 5 more were nominally significant (raw *p* < 0.05) but did not survive FDR correction, and 1 (ATM→Ovarian) was not significant. Per-association adjusted ORs are in `replication_summary_pc_adjusted.csv`.

## Repository Structure

```
├── fdr_significant_results.csv             # 35 FDR-significant associations, 3 categories
├── replication_summary_pc_adjusted.csv     # TCGA (Huang et al.) replication table
├── cohort_summary.json                     # Top-level cohort statistics
├── src/                                    # React dashboard (Vite + Tailwind)
│   └── App.jsx                             # Interactive results visualization
├── README.md
└── package.json
```

## Getting Started

### Viewing the Results

The easiest way to explore the results is through the [live dashboard](https://pan-cancer-germline-predisposition.vercel.app): study overview, interactive results tables with category and cancer-type filtering, ancestry-stratified enrichment, TCGA replication, and full methodology. The CSV files in the repository root contain all aggregate statistics and can be loaded in Python, R, or any spreadsheet tool.

### Running the Dashboard Locally

```bash
git clone https://github.com/mohibul-07/Pan-Cancer-Germline-Predisposition.git
cd Pan-Cancer-Germline-Predisposition
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Reproducing the Analysis

The analysis notebooks require access to the NIH All of Us Researcher Workbench (Controlled Tier):

1. Apply for access at [researchallofus.org](https://researchallofus.org)
2. Complete the required training and sign the Data User Code of Conduct
3. Create a workspace with Controlled Tier (v8) data access
4. Upload and run the notebooks from `notebooks/`

## Tools & Dependencies

- **Data:** NIH All of Us Researcher Workbench — Controlled Tier (v8)
- **Query:** BigQuery (OMOP CDR schema)
- **Variants:** ClinVar P/LP annotations (ACMG/AMP standards)
- **Analysis:** Python 3.10+, pandas, statsmodels (logistic regression, FDR correction)
- **Dashboard:** React, Vite, Tailwind CSS
- **Deployment:** Vercel

## References

- Huang, K.L., et al. (2018). Pathogenic Germline Variants in 10,389 Adult Cancers. *Cell*, 173(2), 355–370. [DOI: 10.1016/j.cell.2018.03.039](https://doi.org/10.1016/j.cell.2018.03.039)
- All of Us Research Program Genomics Investigators. (2024). Genomic data in the All of Us Research Program. *Nature*, 627, 340–346. [DOI: 10.1038/s41586-023-06957-x](https://doi.org/10.1038/s41586-023-06957-x)
- Richards, S., et al. (2015). Standards and guidelines for the interpretation of sequence variants. *Genet. Med.*, 17, 405–424. [DOI: 10.1038/gim.2015.30](https://doi.org/10.1038/gim.2015.30)

## Citation

```
Alam, M. (2026). Pan-Cancer Germline Predisposition Analysis
Using the NIH All of Us Research Program.
Supervised by Dr. Kuang-Lin Huang.
```

## License

MIT
