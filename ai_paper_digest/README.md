# Aether AI Research Feed ⚡

Swipeable daily digest of **AI papers, lab blogs, and essays** — bilingual EN/ZH cards, local collection + notes.

## Public site

After GitHub Pages is enabled (GitHub Actions source):

**https://ianawyy.github.io/IanaWYY/**

Anyone with the link can open it — no login required. Collection/notes stay in each visitor’s browser (`localStorage`).

## Daily update (~20 items)

```bash
cd ai_paper_digest
python3 fetch_papers.py --limit 20   # arXiv + multi-source RSS
./deploy.sh                          # commit + push → public Pages
# or one shot:
./deploy.sh --refresh
```

Sources include arXiv (cs.AI / cs.LG / cs.CL), Google DeepMind, Hugging Face, Lil’Log, Interconnects, The Gradient, BAIR, AWS ML, Microsoft Research, and more when feeds respond.

## Local preview

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8080 --directory .
# http://localhost:8080
```

## Flip counter

The deck shows a **flip-clock remaining count**. Each pass/save decrements by one until **0**.
