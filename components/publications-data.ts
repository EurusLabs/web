export const publicationsData = [
  {
    id: "1",
    type: "Research Paper",
    date: "March 31, 2025",
    title: "StochasticSplats: Stochastic Rasterization for Sorting-Free 3D Gaussian Splatting",
    authors: "EurusLabs team",
    description:
      "3D Gaussian splatting (3DGS) is a popular radiance field method, with many application-specific extensions. Most variants rely on the same core method of Gaussian splatting, they rasterize in primitive order. This ensures correct alpha compositing, but can cause rendering artifacts due to built-in approximations. Moreover, for a fixed representation, sorted rasterization is not necessarily faster. In this work, we address the above limitations by combining 3D Gaussian splatting with stochastic rasterization.",
    category: "research", // Changed to research
    readPaperLink: "#",
    image: "/images/stochastic-splats-new.jpeg", // Updated image path
  },
  {
    id: "2",
    type: "Research Paper",
    date: "Mar 15, 2025",
    title: "Latent Loop Optimization: Reducing Hallucination in Long-Context Language Models",
    authors: "EurusLabs team",
    description:
      "Long-context language models (LLMs) are increasingly deployed for tasks requiring the processing and generation of extended sequences, such as document summarization, multi-step reasoning, and open-ended story generation. However, as context length grows, these models are prone to hallucinating facts, introducing inconsistencies, and losing global narrative coherence. We introduce Latent Loop Optimization (LLO), a training-free, inference-time method that leverages a reinforcement-driven decoding loop to sample, score, and re-inject latent summaries at strategic points during generation. LLO significantly reduces hallucination rates and improves coherence across a range of long-context benchmarks, without requiring model retraining or architectural changes.",
    category: "research", // Changed to research
    readPaperLink: "#",
    image: "/images/latent-loop-optimization-new.jpeg", // Updated image path
  },
  {
    id: "3",
    type: "Research Paper",
    date: "Jun 18, 2025",
    title: "Progressive Prompt Detailing for Improved Alignment in Text-to-Image Generative Models",
    authors: "Aarsh Ashdhir",
    description:
      "Text-to-image generative models often struggle with long prompts detailing complex scenes, diverse objects with distinct visual characteristics. In this work, we propose SCo-PE (Stochastic Controllable Prompt Embeddings), a training-free method to improve text-to-image alignment by progressively refining the input prompt in a coarse-to-fine-grained manner.",
    category: "research", // Changed to research
    readPaperLink: "#",
    image: "/images/progressive-prompt-detailing-new.jpeg", // Updated image path
  },
  {
    id: "4",
    type: "Research Paper",
    date: "May 23, 2025",
    title: "Sparse Causality Guidance: Improving Multi-Agent Reasoning in Generative AI",
    authors: "EurusLabs team",
    description:
      "Multi-agent generative AI systems often falter when required to reason over sparse, multi-step causal chains. This report introduces Sparse Causality Guidance (SCG)—a training-free, inference-time method that progressively injects causal structure into the generation process.",
    category: "research", // Changed to research
    readPaperLink: "#",
    image: "/images/sparse-causality-guidance-new.jpeg", // Updated image path
  },
]
