# Automated arXiv AI Paper Fetcher
# Queries the official arXiv API for the latest papers in Computer Science (Computation and Language, Machine Learning, Artificial Intelligence).

import urllib.request
import xml.etree.ElementTree as ET
import json
from datetime import datetime, timedelta

def fetch_latest_ai_papers(max_results=10):
    print("📡 Fetching latest AI research papers from arXiv API...")
    # Categories: cs.CL (Computation and Language), cs.LG (Machine Learning), cs.AI (Artificial Intelligence)
    url = f"http://export.arxiv.org/api/query?search_query=cat:cs.CL+OR+cat:cs.LG+OR+cat:cs.AI&sortBy=submittedDate&sortOrder=descending&max_results={max_results}"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            
        # Parse XML (Atom format)
        root = ET.fromstring(xml_data)
        
        # Namespace map for parsing Atom XML
        ns = {'atom': 'http://www.w3.org/2005/Atom'}
        
        papers = []
        for entry in root.findall('atom:entry', ns):
            title = entry.find('atom:title', ns).text.strip().replace('\n', ' ')
            published_str = entry.find('atom:published', ns).text
            published_date = datetime.strptime(published_str[:10], "%Y-%m-%d").strftime("%B %d, %Y")
            abstract = entry.find('atom:summary', ns).text.strip().replace('\n', ' ')
            arxiv_url = entry.find('atom:id', ns).text
            
            # Simple heuristic for categories
            category = "Machine Learning"
            if "interpret" in abstract.lower() or "circuit" in abstract.lower():
                category = "Interpretability"
            elif "align" in abstract.lower() or "safety" in abstract.lower() or "critic" in abstract.lower():
                category = "Safety & Alignment"
            elif "rnn" in abstract.lower() or "transformer" in abstract.lower() or "attention" in abstract.lower():
                category = "Model Architecture"
            elif "tpu" in abstract.lower() or "gpu" in abstract.lower() or "throughput" in abstract.lower():
                category = "Systems & Optimization"
            elif "ancient" in abstract.lower() or "medical" in abstract.lower() or "agent" in abstract.lower():
                category = "Applications"

            # Determine publisher heuristic (mostly arXiv preprint, but useful metadata)
            publisher = "arXiv Preprint"
            
            papers.append({
                "title": title,
                "publisher": publisher,
                "date": published_date,
                "category": category,
                "url": arxiv_url,
                "tldr": abstract[:140] + "...",
                "summary": abstract,
            })
            
        print(f"✅ Successfully fetched {len(papers)} papers!")
        return papers
        
    except Exception as e:
        print(f"❌ Error fetching papers: {e}")
        return []

if __name__ == "__main__":
    latest_papers = fetch_latest_ai_papers(10)
    
    # Save to a temporary raw feed file
    output_file = "latest_raw_papers.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(latest_papers, f, indent=2, ensure_ascii=False)
        
    print(f"💾 Saved {len(latest_papers)} raw papers to '{output_file}'.")
    print("💡 Next Step: Run this raw output through Gemini or LLM API to write high-fidelity bilingual summaries.")
