// AI Research Paper Digest Data with Dual-Language (EN/ZH) Support
// Simplified version containing only Title, Date, Publisher, Category, URL, TL;DR, and Summary.
const PAPER_DATA = {
  weeks: [
    {
      id: "week-28",
      title: "Week 28 (July 6 - July 10, 2026)",
      summary: "This week in AI: Anthropic pushed the boundaries of mechanistic interpretability with the Jacobian Lens, while Google DeepMind presented over 130 papers at ICML 2026 in Seoul, focusing on model optimization, hardware self-design, and superintelligence transition frameworks.",
      summary_zh: "本周AI前沿：Anthropic利用雅可比透镜（Jacobian Lens）推进了模型可解释性研究；而Google DeepMind在汉城举办的ICML 2026会议上提交了超过130篇论文，核心聚焦于模型优化、硬件自我设计以及超人工智能（ASI）过渡框架。",
      papers: [
        {
          title: "Verbalizable Representations Form a Global Workspace in Language Models",
          title_zh: "可言说表征在语言模型中构成了全局工作区",
          publisher: "Anthropic",
          date: "July 06, 2026",
          category: "Interpretability",
          url: "https://arxiv.org/abs/2607.06841",
          tldr: "Introduces the Jacobian Lens (J-lens) to locate the internal J-space within Claude, identifying a privileged activation workspace used for deliberate reasoning.",
          tldr_zh: "引入雅可比透镜（J-lens）来定位Claude内部的J-space激活空间，该空间是一个专门用于进行审慎推理的特权工作区。",
          summary: "Anthropic researchers explore how LLMs process concepts by mapping internal activations. They show that while most processing is local and automatic, there exists a central workspace (J-space) where representations are verbalizable and manipulated for sequential reasoning steps, mimicking human global workspace theory.",
          summary_zh: "Anthropic的研究人员通过映射内部激活状态探索大语言模型如何处理概念。他们指出，尽管大多数计算是局部的和自动的，但模型内部存在一个中心工作区（称为 J-space）。在该空间中，概念表征是可被言说的，并能够被提取出来进行序列化的推理，类似于人类的全局工作区理论（Global Workspace Theory）。"
        },
        {
          title: "Gradient Routed Auxiliary Modules (GRAM) for Modular Pretraining",
          title_zh: "基于梯度路由辅助模块（GRAM）的模块化预训练",
          publisher: "Anthropic",
          date: "July 08, 2026",
          category: "Safety & Alignment",
          url: "https://arxiv.org/abs/2607.08112",
          tldr: "Proposes GRAM, a training method that isolates specialized dangerous capabilities (like cyber-attack vectors or virology info) into modular components that can be hot-disabled.",
          tldr_zh: "提出GRAM预训练机制，将特定的高风险危险能力（如网络攻击或病毒学配方）隔离到辅助模块中，支持动态“热禁用”。",
          summary: "Modular pretraining addresses dual-use risks in frontier LLMs. By routing gradients of specific training corpora to dedicated auxiliary modules, these capabilities can be cleanly uninstalled or gated for authorized users without affecting general capabilities.",
          summary_zh: "模块化预训练解决了前沿LLM的“双重用途”安全风险。通过将特定训练语料库的梯度路由到专门的辅助模块中，这些专业敏感知识可以被干净地卸载，或者对非授权用户进行访问限制，且完全不影响模型的通用能力（如通用对话、代码及数学推理）。"
        },
        {
          title: "AlphaEvolve: Advancing Hardware Optimization and Quantum Circuit Design",
          title_zh: "AlphaEvolve：推进硬件自我优化与量子电路设计",
          publisher: "Google DeepMind",
          date: "July 09, 2026",
          category: "Systems & Optimization",
          url: "https://deepmind.google/discover/blog/alphaevolve-quantum-silicon/",
          tldr: "Google DeepMind scales AlphaEvolve, an AI system that automates TPU chip floorplanning, Spanner data compaction, and discovers low-error quantum circuits.",
          tldr_zh: "Google DeepMind扩展了AlphaEvolve系统，实现TPU芯片版图规划、Spanner数据压缩自动化，并探索出低错误率量子电路。",
          summary: "DeepMind details the practical deployment of AlphaEvolve, showing how reinforcement learning and evolutionary algorithms can optimize low-level engineering systems. It reduced TPU floorplanning time from weeks to hours and discovered quantum circuit layouts with a 15% reduction in error rates.",
          summary_zh: "DeepMind详细介绍了AlphaEvolve系统的实际落地部署，展示了强化学习与进化算法结合优化底层工程系统的成果。它将TPU芯片布局时间从数周缩短至几小时，并设计出量子比特布局方案，使NISQ时代量子计算电路的运行错误率降低了15%。"
        },
        {
          title: "Predicting the Past: Ancient Text Restoration with Gemini and Ithaca",
          title_zh: "预测过去：基于Gemini与Ithaca的古文字恢复系统",
          publisher: "Google DeepMind",
          date: "July 09, 2026",
          category: "Applications",
          url: "https://deepmind.google/research/publications/predicting-the-past-ithaca-gemini/",
          tldr: "Integrates Gemini with Ithaca and Aeneas specialized models, allowing historians to restore and date ancient Greek and Latin inscriptions via conversation.",
          tldr_zh: "将Gemini与Ithaca和Aeneas专用模型集成，支持历史学家通过对话方式完成古希腊和拉丁碑文的修复与断代定位。",
          summary: "A collaborative tool for digital humanities. By wrapping Gemini's conversational capabilities around Ithaca (epigraphy restoration) and Aeneas (dating model), historians can interactively test hypotheses about damaged historical texts.",
          summary_zh: "一项针对数字人文领域的跨学科合作成果。通过将Gemini大模型的自然语言对话能力与古文字修复专用模型Ithaca、断代测年模型Aeneas相衔接，历史学家可以通过聊天对话框，交互式地测试关于受损古文献内容和出处的各种学术假说。"
        },
        {
          title: "From AGI to ASI: A Formal Safety and Transition Framework",
          title_zh: "从AGI到ASI：形式化安全与过渡框架",
          publisher: "Google DeepMind",
          date: "July 07, 2026",
          category: "Safety & Alignment",
          url: "https://arxiv.org/abs/2607.03922",
          tldr: "Establishes a rigorous safety framework defining transition triggers from Artificial General Intelligence (AGI) to Artificial Superintelligence (ASI).",
          tldr_zh: "建立严谨的模型安全评估框架，量化定义了从通用人工智能（AGI）迈向超人工智能（ASI）的安全过渡触发指标。",
          summary: "DeepMind researchers present a formalization of capability thresholds. They define transition metrics based on recursive self-improvement speeds, multi-agent coordination capabilities, and scientific discovery autonomy, presenting safety protocols for each milestone.",
          summary_zh: "DeepMind的安全研究团队提出了一套能力阈值的形式化定义。他们根据递归自我改进速度、多智能体协同攻防能力和前沿科学探索的自治度，定义了ASI过渡的关键度量指标，并为每个技术节点设计了相应的约束与隔离协议。"
        },
        {
          title: "Model Selection at Scale: DeepMind's Contributions at ICML 2026",
          title_zh: "大规模模型路由选择：DeepMind在ICML 2026的核心成果",
          publisher: "Google DeepMind",
          date: "July 06, 2026",
          category: "Model Architecture",
          url: "https://research.google/blog/icml-2026-google-research-deepmind/",
          tldr: "Presents DeepMind's key papers at ICML 2026, focusing on automated model routing and routing algorithms that scale model inference dynamically.",
          tldr_zh: "梳理DeepMind在ICML 2026的重点研究，聚焦于自动化模型路由分配与动态分流推理算法。",
          summary: "Highlights from the 130+ papers presented at ICML 2026. This paper details algorithms that dynamically route user queries to the smallest capable model in a mixture-of-experts or model cascade, reducing energy use and latency by 40%.",
          summary_zh: "这是DeepMind在首尔举办的ICML 2026会议上130多篇参会论文中的核心亮点。该项工作提出了一种动态路由分流算法，能在级联多模型架构下，实时根据用户提示词的复杂度，将其路由分派给最小但能胜任的子模型或专家模块，实现40%的计算资源和响应耗时缩减。"
        }
      ]
    },
    {
      id: "week-27",
      title: "Week 27 (June 29 - July 3, 2026)",
      summary: "Last week in AI: Focus was dominated by the release of open weights foundation models, RLHF critic optimization methods, and novel mechanistic interpretability audits of production models.",
      summary_zh: "上周AI前沿：重点在于开源大模型权重的发布、RLHF人工反馈对齐中的智能审计模型（Critic）优化，以及对商用级大模型进行的大规模可解释性神经通路审计。",
      papers: [
        {
          title: "Critics in RLHF: Enhancing Reward Model Alignment",
          title_zh: "RLHF中的审核员：利用Critic模型提升对齐精度",
          publisher: "OpenAI",
          date: "June 30, 2026",
          category: "Safety & Alignment",
          url: "https://arxiv.org/abs/2606.12001",
          tldr: "Introduces 'Critic Models' trained to critique model code and reasoning, improving alignment beyond standard reward models.",
          tldr_zh: "引入专门训练的“Critic审核模型”，对大模型输出的代码与推理链进行主动审计，提升对齐水平。",
          summary: "OpenAI details the use of helper AI models called Critics to find bugs and flaws in LLM outputs. Using Critics during Reinforcement Learning from Human Feedback (RLHF) increases code correctness and reduces subtle reasoning hallucinations.",
          summary_zh: "OpenAI详细介绍了如何利用专门的辅助AI模型（称为 Critics）来定位和查找基座模型输出中的Bug与潜在漏洞。在基于人类反馈的强化学习（RLHF）阶段引入Critics进行监督，可以极大提升代码生成的健壮性，同时有效降低了细微的数学逻辑幻觉。"
        },
        {
          title: "RecurrentGemma 2: High-Throughput Linear RNNs",
          title_zh: "RecurrentGemma 2：高吞吐线性循环神经网络",
          publisher: "Google DeepMind",
          date: "July 02, 2026",
          category: "Model Architecture",
          url: "https://arxiv.org/abs/2607.01188",
          tldr: "Launches RecurrentGemma 2, using a hybrid Griffin architecture combining linear RNNs with local attention to drastically reduce memory usage.",
          tldr_zh: "发布RecurrentGemma 2，基于Griffin混合架构，结合线性RNN和局部注意力，剧烈降低KV Cache显存占用。",
          summary: "Google DeepMind presents RecurrentGemma 2, a model built on linear recurrences (RG-LRU) and local attention blocks. It achieves comparable perplexity to standard Transformers while maintaining a fixed-size KV cache, enabling massive throughput scaling.",
          summary_zh: "Google DeepMind推出了RecurrentGemma 2模型，基于线性循环单元（RG-LRU）和局部注意力混合架构。它在保证与标准Transformer模型相当的表现力的同时，实现了大小恒定的KV缓存（KV Cache），解除了长文本吞吐量的性能瓶颈。"
        },
        {
          title: "Golden Gate Claude: Interpretability of Dictionary Learning at Scale",
          title_zh: "金门大桥Claude：大规模字典学习的可解释性实证",
          publisher: "Anthropic",
          date: "June 29, 2026",
          category: "Interpretability",
          url: "https://transformer-circuits.pub/2024/scaling-monosemanticity/",
          tldr: "Details the scaling of Sparse Autoencoders (SAE) to audit millions of active internal features inside Claude, including the 'Golden Gate Bridge' concept.",
          tldr_zh: "详细阐述了稀疏自编码器（SAE）的扩展，审计Claude内数百万个活跃概念特征（如“金门大桥”概念节点）。",
          summary: "Anthropic details their dictionary learning scaling success, mapping millions of concepts to distinct neural pathways inside production LLMs. They show how activating specific nodes (like the Golden Gate feature) forces Claude to obsess over the bridge, proving steerability.",
          summary_zh: "Anthropic详细公开了其在大规模稀疏自编码字典学习上的突破，将数百万个抽象概念精确映射到大模型内部特定的神经元组合通路中。实验显示，通过强行激活特定的节点（如金门大桥特征），Claude在对话中会极度偏执地将所有话题都引向这座桥梁，证实了模型内部机制的可控性与可操纵性。"
        }
      ]
    }
  ]
};
