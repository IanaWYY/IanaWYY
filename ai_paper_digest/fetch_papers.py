#!/usr/bin/env python3
"""
Aether AI Research Feed — multi-source daily collector.

Pulls ~20 hot items each run from:
  - arXiv (cs.AI / cs.LG / cs.CL papers)
  - Lab & community blogs / essays (RSS)

Writes:
  - latest_raw_papers.json  (raw dump)
  - data.js                 (frontend PAPER_DATA)

Usage:
  python3 fetch_papers.py              # default: 20 items for today
  python3 fetch_papers.py --limit 20
  python3 fetch_papers.py --papers 12 --blogs 8
"""

from __future__ import annotations

import argparse
import json
import re
import ssl
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html import unescape
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
SSL_CTX = ssl._create_unverified_context()
ATOM = {"atom": "http://www.w3.org/2005/Atom"}
ATOM_NS = "{http://www.w3.org/2005/Atom}"

FEEDS = [
    ("Google DeepMind", "https://deepmind.google/blog/rss.xml", "blog"),
    ("Hugging Face", "https://huggingface.co/blog/feed.xml", "blog"),
    ("Lil'Log", "https://lilianweng.github.io/index.xml", "essay"),
    ("Interconnects", "https://www.interconnects.ai/feed", "essay"),
    ("The Gradient", "https://thegradient.pub/rss/", "essay"),
    ("Berkeley BAIR", "https://bair.berkeley.edu/blog/feed.xml", "blog"),
    ("AWS ML", "https://aws.amazon.com/blogs/machine-learning/feed/", "blog"),
    ("Microsoft Research", "https://www.microsoft.com/en-us/research/feed/", "blog"),
    ("OpenAI", "https://openai.com/blog/rss.xml", "blog"),
]


def fetch_bytes(url: str, timeout: int = 15) -> bytes:
    req = Request(url, headers={"User-Agent": "AetherDigest/2.0 (public research feed)"})
    with urlopen(req, timeout=timeout, context=SSL_CTX) as resp:
        return resp.read()


def strip_html(text: str | None) -> str:
    text = re.sub(r"<[^>]+>", " ", text or "")
    text = unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def clip(text: str, n: int) -> str:
    text = (text or "").strip()
    if len(text) <= n:
        return text
    return text[: n - 1].rstrip() + "…"


def parse_date(raw: str) -> str:
    raw = (raw or "").strip()
    if not raw:
        return "Recent"
    m = re.search(r"(\d{1,2} \w{3} \d{4})", raw)
    if m:
        try:
            return datetime.strptime(m.group(1), "%d %b %Y").strftime("%B %d, %Y")
        except ValueError:
            pass
    m2 = re.search(r"(\d{4}-\d{2}-\d{2})", raw)
    if m2:
        try:
            return datetime.strptime(m2.group(1), "%Y-%m-%d").strftime("%B %d, %Y")
        except ValueError:
            pass
    return raw[:16]


def categorize(title: str, summary: str, content_type: str) -> str:
    blob = f"{title} {summary}".lower()
    rules = [
        ("Interpretability", ["interpret", "explain", "concept", "circuit", "mechanistic", "audit", "feature"]),
        ("Safety & Alignment", ["safety", "align", "secur", "vulnerab", "exploit", "jailbreak", "risk", "red team"]),
        ("Model Architecture", ["architecture", "attention", "transformer", "rnn", "pretrain", "mixture", "moe"]),
        ("Systems & Optimization", ["optim", "throughput", "system", "gpu", "tpu", "profile", "scalable", "inference", "kernel"]),
    ]
    for cat, keys in rules:
        if any(k in blob for k in keys):
            return cat
    if content_type == "paper":
        return "Model Architecture"
    return "Applications"


def fetch_arxiv(max_results: int = 25) -> list[dict]:
    print(f"📡 Fetching arXiv (max {max_results})…")
    url = (
        "http://export.arxiv.org/api/query?"
        "search_query=cat:cs.CL+OR+cat:cs.LG+OR+cat:cs.AI"
        f"&sortBy=submittedDate&sortOrder=descending&max_results={max_results}"
    )
    root = ET.fromstring(fetch_bytes(url, timeout=30))
    papers = []
    for entry in root.findall("atom:entry", ATOM):
        title = entry.find("atom:title", ATOM).text.strip().replace("\n", " ")
        published = entry.find("atom:published", ATOM).text
        date = datetime.strptime(published[:10], "%Y-%m-%d").strftime("%B %d, %Y")
        abstract = entry.find("atom:summary", ATOM).text.strip().replace("\n", " ")
        arxiv_url = entry.find("atom:id", ATOM).text.replace("http://", "https://")
        m = re.match(r"(https://arxiv.org/abs/\d+\.\d+)", arxiv_url)
        if m:
            arxiv_url = m.group(1)
        papers.append(
            {
                "type": "paper",
                "title": title,
                "publisher": "arXiv",
                "date": date,
                "url": arxiv_url,
                "tldr": clip(abstract, 180),
                "summary": clip(abstract, 600),
            }
        )
    print(f"  ✅ arXiv: {len(papers)}")
    return papers


def fetch_feeds(per_feed: int = 5) -> list[dict]:
    blogs: list[dict] = []
    for publisher, feed_url, content_type in FEEDS:
        try:
            data = fetch_bytes(feed_url, timeout=12)
            root = ET.fromstring(data)
            items = root.findall(".//item")
            if not items:
                items = root.findall(f".//{ATOM_NS}entry")
            count = 0
            for item in items[:per_feed]:
                title_el = item.find("title") or item.find(f"{ATOM_NS}title")
                link_el = item.find("link") or item.find(f"{ATOM_NS}link")
                desc_el = (
                    item.find("description")
                    or item.find("summary")
                    or item.find(f"{ATOM_NS}summary")
                    or item.find(f"{ATOM_NS}content")
                )
                pub_el = (
                    item.find("pubDate")
                    or item.find(f"{ATOM_NS}published")
                    or item.find(f"{ATOM_NS}updated")
                )
                title = strip_html(title_el.text if title_el is not None else "")
                if link_el is not None:
                    link = link_el.get("href") or (link_el.text or "")
                else:
                    link = ""
                desc = strip_html(desc_el.text if desc_el is not None and desc_el.text else "")
                date_str = parse_date(pub_el.text if pub_el is not None else "")
                if not title or not link:
                    continue
                blogs.append(
                    {
                        "type": content_type,
                        "title": title,
                        "publisher": publisher,
                        "date": date_str,
                        "url": link.strip(),
                        "tldr": clip(desc, 180) if desc else clip(title, 180),
                        "summary": clip(desc, 600) if desc else title,
                    }
                )
                count += 1
            print(f"  ✅ {publisher}: {count}")
        except Exception as exc:  # noqa: BLE001 — keep collecting other feeds
            print(f"  ⚠️  {publisher}: {type(exc).__name__}: {exc}")
    return blogs


def diversify_blogs(blogs: list[dict], limit: int) -> list[dict]:
    """Prefer publisher diversity (≤2 per source)."""
    out: list[dict] = []
    counts: dict[str, int] = {}
    for b in blogs:
        pub = b["publisher"]
        if counts.get(pub, 0) >= 2:
            continue
        out.append(b)
        counts[pub] = counts.get(pub, 0) + 1
        if len(out) >= limit:
            break
    # fill remainder if still short
    if len(out) < limit:
        seen = {x["url"] for x in out}
        for b in blogs:
            if b["url"] in seen:
                continue
            out.append(b)
            if len(out) >= limit:
                break
    return out


def to_card(item: dict) -> dict:
    ctype = item.get("type", "paper")
    title = item["title"]
    tldr = item.get("tldr") or title
    summary = item.get("summary") or tldr
    cat = categorize(title, summary, ctype)
    tag = {"paper": "论文", "blog": "博客", "essay": "长文"}.get(ctype, "文章")
    return {
        "title": title,
        "title_zh": f"【{tag}】{title}",
        "publisher": item["publisher"],
        "date": item["date"],
        "category": cat,
        "content_type": ctype,
        "url": item["url"],
        "tldr": tldr,
        "tldr_zh": f"摘要：{clip(tldr, 160)}",
        "summary": summary,
        "summary_zh": f"全文要点：{clip(summary, 400)}",
    }


def merge_previous_archive(new_week: dict) -> list[dict]:
    """Keep prior days from existing data.js (max 6 weeks)."""
    data_path = ROOT / "data.js"
    if not data_path.exists():
        return [new_week]
    try:
        text = data_path.read_text(encoding="utf-8")
        m = re.search(r"const PAPER_DATA = (\{.*\});\s*$", text, re.S)
        if not m:
            return [new_week]
        old = json.loads(m.group(1))
        weeks = [new_week]
        for w in old.get("weeks", []):
            if w.get("id") == new_week["id"]:
                continue
            weeks.append(w)
            if len(weeks) >= 6:
                break
        return weeks
    except Exception:
        return [new_week]


def write_outputs(papers: list[dict], blogs: list[dict], cards: list[dict], paper_n: int, blog_n: int) -> None:
    now = datetime.now(timezone.utc)
    raw = {
        "fetched_at": now.isoformat().replace("+00:00", "Z"),
        "papers": papers,
        "blogs": blogs,
    }
    (ROOT / "latest_raw_papers.json").write_text(
        json.dumps(raw, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )

    day_id = f"day-{now.strftime('%Y-%m-%d')}"
    week = {
        "id": day_id,
        "title": f"Today · {now.strftime('%B %d, %Y')}",
        "summary": (
            f"Daily digest of {len(cards)} AI papers, lab blogs, and essays "
            f"({paper_n} arXiv + {blog_n} blogs/essays). Sources include DeepMind, "
            "Hugging Face, BAIR, Lil'Log, Interconnects, The Gradient, AWS ML, and more."
        ),
        "summary_zh": (
            f"今日AI精选 {len(cards)} 篇：arXiv 论文 {paper_n} 篇 + 博客/长文 {blog_n} 篇，"
            "覆盖 DeepMind、Hugging Face、BAIR、Lil'Log、Interconnects 等热点源。"
        ),
        "papers": cards,
    }
    data = {"weeks": merge_previous_archive(week)}
    js = (
        "// Auto-generated by fetch_papers.py — run daily for ~20 fresh items\n"
        "const PAPER_DATA = "
        + json.dumps(data, indent=2, ensure_ascii=False)
        + ";\n"
    )
    (ROOT / "data.js").write_text(js, encoding="utf-8")
    print(f"💾 Wrote latest_raw_papers.json + data.js ({len(cards)} cards for {day_id})")


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch daily AI papers/blogs for Aether feed")
    parser.add_argument("--limit", type=int, default=20, help="Total items (default 20)")
    parser.add_argument("--papers", type=int, default=None, help="arXiv paper count")
    parser.add_argument("--blogs", type=int, default=None, help="Blog/essay count")
    args = parser.parse_args()

    total = max(1, args.limit)
    paper_n = args.papers if args.papers is not None else max(1, int(round(total * 0.6)))
    blog_n = args.blogs if args.blogs is not None else max(0, total - paper_n)
    if paper_n + blog_n != total:
        blog_n = max(0, total - paper_n)

    print(f"🎯 Target: {total} items ({paper_n} papers + {blog_n} blogs/essays)")
    arxiv = fetch_arxiv(max_results=max(25, paper_n + 5))
    feeds = fetch_feeds(per_feed=5)
    picked_papers = arxiv[:paper_n]
    picked_blogs = diversify_blogs(feeds, blog_n)

    # If blogs fail, top up with more arXiv
    if len(picked_blogs) < blog_n:
        need = total - len(picked_papers) - len(picked_blogs)
        extra = arxiv[paper_n : paper_n + need]
        picked_papers = picked_papers + extra
        print(f"  ℹ️  Topped up with {len(extra)} extra arXiv papers")

    cards = [to_card(x) for x in picked_papers + picked_blogs][:total]
    write_outputs(arxiv[:20], feeds, cards, len(picked_papers), len(picked_blogs))
    print("✅ Done. Open index.html or push to publish.")


if __name__ == "__main__":
    main()
