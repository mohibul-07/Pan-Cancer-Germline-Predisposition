# Pan-Cancer Germline Predisposition Analysis

![Python](https://img.shields.io/badge/Python-3.10+-blue) ![All of Us](https://img.shields.io/badge/NIH-All%20of%20Us-green) ![Associations](https://img.shields.io/badge/Significant%20Associations-54-orange)

A pan-cancer analysis of inherited pathogenic variants across 44 cancer predisposition genes and 9 cancer types, using germline whole genome sequencing data from the NIH All of Us Research Program.

This work extends the methodology of [Huang et al. (Cell, 2018)](https://doi.org/10.1016/j.cell.2018.03.039) to a larger, more ancestrally diverse cohort.

**Research conducted at Queensborough Community College, CUNY**
**Advisor: Professor Zeynep Akcay Ozkan**

---

## Key Findings

- **20/21 (95%)** of Huang's TCGA gene-cancer associations replicated in All of Us
- **34 novel associations** identified, including VHL→Kidney (49×), FH→Kidney (37×), and BARD1→Breast (7.4×)
- **Ancestry-specific patterns** revealed: BRCA2 enrichment in breast cancer is 21× in Black/AA vs 10.9× in White populations; APC enrichment in colorectal cancer is 57.7× in Hispanic vs 8.5× in White populations

## Dataset

- **Source:** NIH All of Us Researcher Workbench — Controlled Tier
- **Cohort:** 61,044 participants (31,044 cancer cases + 30,000 cancer-free controls)
- **Cancer types:** Breast (11,598), Prostate (8,566), Colorectal (3,610), Melanoma (2,532), Kidney (2,454), Lung (2,435), Ovarian (1,518), Pancreatic (992), Stomach (494)
- **Genes:** 44 cancer predisposition genes across 12 pathways
- **Ancestry groups:** White (37,096), Hispanic/Latino (8,989), Black/AA (8,604), Asian (1,618)

> ⚠️ Raw participant data is not included. Only aggregate statistics (carrier frequencies, enrichment ratios) are reported, in compliance with the All of Us Data User Code of Conduct.

## Top Significant Associations

| Cancer | Gene | Enrichment | p-value | Known/Novel |
|---|---|---|---|---|
| CDH1 | Stomach | 81× | 2.3e-06 | Known |
| VHL | Kidney | 49× | 4.1e-08 | Novel |
| MSH2 | Colorectal | 42× | 2.8e-16 | Known |
| MLH1 | Colorectal | 39× | 4.7e-22 | Known |
| FH | Kidney | 37× | 1.4e-08 | Novel |
| BRCA1 | Ovarian | 25× | 1.0e-42 | Known |
| APC | Colorectal | 22× | 1.3e-09 | Known |
| CDKN2A | Melanoma | 20× | 1.4e-09 | Known |
| BRCA2 | Ovarian | 14× | 4.6e-28 | Known |
| BRCA1 | Breast | 10× | 1.9e-53 | Known |

## Methodology

1. **Cohort Construction** — Identified cancer cases via OMOP diagnosis codes in All of Us EHR data; built cancer-free control group excluding all malignant diagnoses
2. **Variant Extraction** — Queried germline WGS for variants in 44 cancer predisposition genes; filtered to ClinVar pathogenic/likely pathogenic; excluded mixed/uncertain classifications
3. **Enrichment Analysis** — Fisher's exact test for each gene × cancer type pair; Benjamini-Hochberg FDR correction at α = 0.05
4. **Ancestry Stratification** — Repeated enrichment analysis within White, Black/AA, Hispanic/Latino, and Asian groups
5. **TCGA Comparison** — Validated against Huang et al. (2018) reported associations

## Repository Structure

```
├── notebooks/
│   ├── 01_cohort_construction.ipynb
│   ├── 02_germline_variants.ipynb
│   ├── 03_enrichment_analysis.ipynb
│   └── 04_ancestry_stratification.ipynb
├── results/
│   ├── enrichment_results.csv
│   ├── significant_associations.csv
│   ├── ancestry_enrichment.csv
│   └── replication_summary.csv
├── dashboard/                  # Interactive visualization
└── README.md
```

## References

- Huang, K.L., et al. (2018). Pathogenic Germline Variants in 10,389 Adult Cancers. *Cell*, 173(2), 355-370.
- Carrot-Zhang, J., ..., Huang, K.L., et al. (2020). Ancestry-specific predisposing germline variants in cancer. *Genome Medicine*, 12, 51.

## Citation

```
Alam, M. (2026). Pan-Cancer Germline Predisposition Analysis on All of Us.
Queensborough Community College, CUNY.
Advisor: Prof. Zeynep Akcay Ozkan.
```
