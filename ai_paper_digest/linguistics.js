// Aether AI Research Feed - Linguistic Analysis Engine
// Analyzes active week paper data (English abstract/text) to construct word frequency cloud,
// sentiment orientation, and semantic vector metrics (Radar layout).

const STOPWORDS = new Set([
  'the', 'and', 'of', 'to', 'in', 'a', 'is', 'that', 'for', 'on', 'with', 'as', 'by', 'at', 'an', 'be', 'this', 'are', 'from', 'it', 'or', 'was', 'which', 'were',
  'our', 'their', 'its', 'we', 'they', 'he', 'she', 'you', 'your', 'my', 'me', 'us', 'them', 'can', 'will', 'would', 'could', 'should', 'have', 'has', 'had', 'having',
  'do', 'does', 'did', 'doing', 'about', 'above', 'after', 'against', 'along', 'among', 'around', 'before', 'behind', 'below', 'beneath', 'beside', 'between',
  'beyond', 'during', 'except', 'near', 'opposite', 'out', 'outside', 'over', 'past', 'round', 'through', 'toward', 'towards', 'under', 'underneath', 'until',
  'upon', 'via', 'within', 'without', 'also', 'more', 'new', 'latest', 'key', 'main', 'first', 'two', 'using', 'based', 'used', 'use', 'show', 'presents', 'presented',
  'paper', 'research', 'work', 'focusing', 'focus', 'than', 'while', 'other', 'another', 'into', 'both', 'three', 'many', 'some', 'any', 'each', 'all', 'such',
  'only', 'very', 'own', 'too', 'just', 'but', 'how', 'so', 'than', 's', 't', 'd'
]);

// Helper: Tokenizes and counts word frequencies for a week
function computeWordFrequencies(weekData) {
  const wordsMap = {};
  
  // Aggregate all English text fields
  weekData.papers.forEach(paper => {
    const textBlob = `${paper.title} ${paper.tldr} ${paper.summary} ${paper.category} ${paper.publisher} ${paper.impact}`;
    // Clean and split words
    const tokens = textBlob.toLowerCase()
      .replace(/[^a-zA-Z-\s]/g, ' ')
      .split(/\s+/);
      
    tokens.forEach(token => {
      if (token.length > 2 && !STOPWORDS.has(token)) {
        wordsMap[token] = (wordsMap[token] || 0) + 1;
      }
    });
  });

  // Convert to sorted array
  return Object.keys(wordsMap).map(word => ({
    text: word,
    count: wordsMap[word]
  })).sort((a, b) => b.count - a.count);
}

// Draw the Word Cloud using a spiral collision detection placement on Canvas
function renderWordCloud(canvasId, words) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Clear and resize matching parent dimensions
  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth;
  canvas.height = 250;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (words.length === 0) return;

  const maxCount = words[0].count;
  const placedWords = [];
  
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Muted premium colors palette
  const colors = [
    '#5c7cfa', // Muted steel blue
    '#c97f63', // Soft terracotta
    '#5c8f76', // Muted sage green
    '#8f74a8', // Dusty purple
    '#cfa182'  // Soft linen beige
  ];

  for (let i = 0; i < Math.min(words.length, 35); i++) {
    const word = words[i];
    // Dynamic sizing based on frequency ratio
    const fontSize = Math.max(12, Math.min(32, (word.count / maxCount) * 22 + 10));
    ctx.font = `bold ${fontSize}px 'Outfit', sans-serif`;
    ctx.fillStyle = colors[i % colors.length];

    const textWidth = ctx.measureText(word.text).width + 8;
    const textHeight = fontSize + 6;

    let placed = false;
    let angle = 0;
    let radius = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Spiral outwards to find non-colliding location
    while (!placed && radius < Math.max(canvas.width, canvas.height) / 2) {
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Check collision
      let collision = false;
      for (const pw of placedWords) {
        if (x - textWidth/2 < pw.x + pw.w/2 &&
            x + textWidth/2 > pw.x - pw.w/2 &&
            y - textHeight/2 < pw.y + pw.h/2 &&
            y + textHeight/2 > pw.y - pw.h/2) {
          collision = true;
          break;
        }
      }

      // Check boundary constraints
      if (x - textWidth/2 < 10 || x + textWidth/2 > canvas.width - 10 ||
          y - textHeight/2 < 10 || y + textHeight/2 > canvas.height - 10) {
        collision = true;
      }

      if (!collision) {
        ctx.fillText(word.text, x, y);
        placedWords.push({ x, y, w: textWidth, h: textHeight });
        placed = true;
      }

      angle += 0.25;
      radius += 0.4;
    }
  }
}

// Compute semantic vector metrics across 4 key dimensions
function computeLinguisticDimensions(weekData) {
  const keywordAxes = {
    empirical: ['performance', 'throughput', 'optimization', 'optimize', 'scale', 'hardware', 'spanner', 'routing', 'inference', 'cost', 'latency', 'tpu', 'circuit', 'silicon', 'efficiency', 'computational', 'algorithms'],
    theoretical: ['formal', 'framework', 'theorem', 'proof', 'mathematical', 'jacobian', 'lens', 'space', 'representation', 'activation', 'activations', 'workspace', 'dictionary', 'circuits', 'representations', 'mental'],
    safety: ['safety', 'alignment', 'ethics', 'containment', 'gate', 'sandbox', 'audit', 'verification', 'critic', 'deceptive', 'deception', 'gated', 'cybersecurity', 'virology', 'weapon', 'risks', 'alignment', 'failure'],
    autonomy: ['autonomous', 'agent', 'self-improvement', 'recursive', 'discovery', 'creation', 'exploration', 'agents', 'evolve', 'improvement', 'automates', 'discovery']
  };

  const scores = { empirical: 0, theoretical: 0, safety: 0, autonomy: 0 };
  
  weekData.papers.forEach(paper => {
    const textBlob = `${paper.title} ${paper.tldr} ${paper.summary} ${paper.impact}`.toLowerCase();
    
    Object.keys(keywordAxes).forEach(axis => {
      keywordAxes[axis].forEach(keyword => {
        // Count occurrences
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        const matches = textBlob.match(regex);
        if (matches) {
          scores[axis] += matches.length;
        }
      });
    });
  });

  // Apply basic normalization so scores map smoothly on radar chart (range 0 to 10)
  const maxScore = Math.max(...Object.values(scores), 1);
  const normalized = {};
  Object.keys(scores).forEach(axis => {
    normalized[axis] = Math.max(1.5, Math.min(10, (scores[axis] / maxScore) * 8 + 2));
  });

  return { raw: scores, normalized };
}

// Draw a glowing premium Radar Chart on Canvas
function renderRadarChart(canvasId, dimensions) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth;
  canvas.height = 250;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = 90;
  
  const axes = [
    { name: 'Empirical Scale / 应用工程', key: 'empirical', angle: -Math.PI / 2 },
    { name: 'Theoretical Rigor / 理论架构', key: 'theoretical', angle: 0 },
    { name: 'Safety & Control / 对齐控制', key: 'safety', angle: Math.PI / 2 },
    { name: 'Agent Autonomy / 智能自治', key: 'autonomy', angle: Math.PI }
  ];

  // Draw concentric grid circles
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let r = 1; r <= 4; r++) {
    const radius = (r / 4) * maxRadius;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Grid markers
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = '8px monospace';
    ctx.fillText(`${r * 25}%`, centerX + 4, centerY - radius + 3);
  }

  // Draw axis lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  axes.forEach(axis => {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + maxRadius * Math.cos(axis.angle), centerY + maxRadius * Math.sin(axis.angle));
    ctx.stroke();
    
    // Draw Axis Label
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.font = '10px Outfit, sans-serif';
    
    let textX = centerX + (maxRadius + 15) * Math.cos(axis.angle);
    let textY = centerY + (maxRadius + 12) * Math.sin(axis.angle);
    
    if (axis.angle === 0) {
      ctx.textAlign = 'left';
    } else if (axis.angle === Math.PI) {
      ctx.textAlign = 'right';
    } else {
      ctx.textAlign = 'center';
    }
    ctx.fillText(axis.name, textX, textY);
  });

  // Draw data polygon
  const points = axes.map(axis => {
    // Score range is 0 to 10
    const value = dimensions.normalized[axis.key] || 1;
    const radius = (value / 10) * maxRadius;
    return {
      x: centerX + radius * Math.cos(axis.angle),
      y: centerY + radius * Math.sin(axis.angle)
    };
  });

  // Fill polygon with a premium semi-transparent gradient
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  
  const fillGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, maxRadius);
  fillGrad.addColorStop(0, 'rgba(92, 124, 250, 0.05)');
  fillGrad.addColorStop(1, 'rgba(201, 127, 99, 0.25)'); // gradient from Google Blue to Anthropic Terracotta
  ctx.fillStyle = fillGrad;
  ctx.fill();

  // Polygon outline with sharp premium stroke
  ctx.strokeStyle = '#5c7cfa';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(92, 124, 250, 0.4)';
  ctx.shadowBlur = 8;
  ctx.stroke();
  
  // Reset shadow
  ctx.shadowBlur = 0;

  // Draw dots at vertices
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#f1f5f9';
    ctx.fill();
    ctx.strokeStyle = '#5c7cfa';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

// Compute semantic sentiment tone orientation (Optimistic vs. Cautious)
function computeSentimentTone(weekData) {
  const positive = ['advance', 'enhance', 'optimize', 'accelerate', 'restore', 'success', 'breakthrough', 'improve', 'efficiency', 'optimized', 'accuracy', 'preservation', 'contributions'];
  const cautious = ['limit', 'danger', 'risk', 'threat', 'failure', 'hallucination', 'deception', 'hazard', 'vulnerability', 'dangerous', 'deceptive', 'risks', 'failures', 'containment'];

  let posCount = 0;
  let cauCount = 0;

  weekData.papers.forEach(paper => {
    const textBlob = `${paper.title} ${paper.tldr} ${paper.summary} ${paper.impact}`.toLowerCase();
    
    positive.forEach(w => {
      const matches = textBlob.match(new RegExp(`\\b${w}\\b`, 'g'));
      if (matches) posCount += matches.length;
    });

    cautious.forEach(w => {
      const matches = textBlob.match(new RegExp(`\\b${w}\\b`, 'g'));
      if (matches) cauCount += matches.length;
    });
  });

  const total = posCount + cauCount || 1;
  const optimismPct = Math.round((posCount / total) * 100);
  const cautionPct = 100 - optimismPct;

  return { positive: posCount, cautious: cauCount, optimismPct, cautionPct };
}
