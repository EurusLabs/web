export const publicationsData = [
  {
    id: "1",
    type: "Research Paper",
    date: "March 31, 2025",
    title: "StochasticSplats: Stochastic Rasterization for Sorting-Free 3D Gaussian Splatting",
    authors: "EurusLabs team",
    description:
      "3D Gaussian splatting (3DGS) is a popular radiance field method, with many application-specific extensions. Most variants rely on the same core method of Gaussian splatting, they rasterize in primitive order. This ensures correct alpha compositing, but can cause rendering artifacts due to built-in approximations. Moreover, for a fixed representation, sorted rasterization is not necessarily faster. In this work, we address the above limitations by combining 3D Gaussian splatting with stochastic rasterization.",
    category: "research",
    readPaperLink: "#",
    image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/1.jpg",
  },
  {
    id: "2",
    type: "Research Paper",
    date: "Mar 15, 2025",
    title: "Latent Loop Optimization: Reducing Hallucination in Long-Context Language Models",
    authors: "EurusLabs team",
    description:
      "Long-context language models (LLMs) are increasingly deployed for tasks requiring the processing and generation of extended sequences, such as document summarization, multi-step reasoning, and open-ended story generation. However, as context length grows, these models are prone to hallucinating facts, introducing inconsistencies, and losing global narrative coherence. We introduce Latent Loop Optimization (LLO), a training-free, inference-time method that leverages a reinforcement-driven decoding loop to sample, score, and re-inject latent summaries at strategic points during generation. LLO significantly reduces hallucination rates and improves coherence across a range of long-context benchmarks, without requiring model retraining or architectural changes.",
    category: "research",
    readPaperLink: "#",
    image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/2.jpg",
  },
  {
    id: "3",
    type: "Research Paper",
    date: "Jun 18, 2025",
    title: "Progressive Prompt Detailing for Improved Alignment in Text-to-Image Generative Models",
    authors: "Aarsh Ashdhir",
    description:
      "Text-to-image generative models often struggle with long prompts detailing complex scenes, diverse objects with distinct visual characteristics. In this work, we propose SCo-PE (Stochastic Controllable Prompt Embeddings), a training-free method to improve text-to-image alignment by progressively refining the input prompt in a coarse-to-fine-grained manner.",
    category: "research",
    readPaperLink: "#",
    image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/3.jpg",
  },
  {
    id: "4",
    type: "Research Paper",
    date: "May 23, 2025",
    title: "Sparse Causality Guidance: Improving Multi-Agent Reasoning in Generative AI",
    authors: "EurusLabs team",
    description:
      "Multi-agent generative AI systems often falter when required to reason over sparse, multi-step causal chains. This report introduces Sparse Causality Guidance (SCG)—a training-free, inference-time method that progressively injects causal structure into the generation process.",
    category: "research",
    readPaperLink: "#",
    image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/4.jpg",
  },
  {
    id: "5",
    type: "Blog Post",
    date: "April 10, 2025",
    title: "The Future of AI: Trends and Predictions for 2025",
    authors: "EurusLabs team",
    description:
      "As we move through 2025, the AI landscape continues to evolve at an unprecedented pace. From breakthroughs in generative models to new applications in healthcare and finance, the possibilities seem endless. In this blog post, we explore the key trends shaping the future of artificial intelligence.",
    category: "blog",
    readPaperLink: "#",
    image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/stochastic-splats-new.jpeg",
  },
  {
    id: "6",
    type: "Announcement",
    date: "April 5, 2025",
    title: "Eurus Labs Launches New Research Initiative",
    authors: "EurusLabs team",
    description:
      "We're excited to announce the launch of our new research initiative focused on advancing the frontiers of artificial intelligence. This initiative will bring together leading researchers and practitioners to tackle some of the most challenging problems in AI today.",
    category: "announcements",
    readPaperLink: "#",
    image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/latent-loop-optimization-new.jpeg",
  },
]
