import Image from "next/image" // Import Image component

export default function LatentLoopOptimizationPost() {
  return (
    <div className="prose max-w-none text-foreground">
      <h1 className="text-4xl font-bold text-foreground mb-6">
        Latent Loop Optimization: Reducing Hallucination in Long-Context Language Models
      </h1>
      {/* Image under title */}
      <div className="mb-8 w-full flex justify-center">
        <Image
          src="/images/latent-loop-optimization-new.jpeg" // Updated image path
          alt="Latent Loop Optimization concept"
          width={1000}
          height={600}
          className="rounded-lg object-contain w-full h-auto"
        />
      </div>
      <p className="text-muted-foreground mb-6">
        <em>Eurus Labs Research Team</em>
      </p>

      <h2 className="text-3xl font-bold text-foreground mb-4">Abstract</h2>
      <p className="mb-4">
        Long-context language models (LLMs) are increasingly deployed for tasks requiring the processing and generation
        of extended sequences, such as document summarization, multi-step reasoning, and open-ended story generation.
        However, as context length grows, these models are prone to hallucinating facts, introducing inconsistencies,
        and losing global narrative coherence. We introduce Latent Loop Optimization (LLO), a training-free,
        inference-time method that leverages a reinforcement-driven decoding loop to sample, score, and re-inject latent
        summaries at strategic points during generation. LLO significantly reduces hallucination rates and improves
        coherence across a range of long-context benchmarks, without requiring model retraining or architectural
        changes.
      </p>

      <h2 className="text-3xl font-bold text-foreground mb-4">1. Introduction</h2>
      <h3 className="text-2xl font-bold text-foreground mb-3">1.1 The Hallucination Problem in Long-Context LLMs</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Hallucination:</strong> The generation of plausible but ungrounded or factually
          incorrect content.
        </li>
        <li>
          <strong className="text-foreground">Loss of Coherence:</strong> As sequence length increases, models struggle to
          maintain consistency, often contradicting earlier statements or drifting from the original topic.
        </li>
        <li>
          <strong className="text-foreground">Root Causes:</strong>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Limited effective context window due to attention bottlenecks.</li>
            <li>Error accumulation and exposure bias during autoregressive decoding.</li>
            <li>Lack of explicit mechanisms for global state tracking or summary reinforcement.</li>
          </ul>
        </li>
      </ul>

      <h3 className="text-2xl font-bold text-foreground mb-3">1.2 Motivation</h3>
      <p className="mb-4">
        Reducing hallucination and improving coherence in long-context LLMs is critical for applications in legal
        analysis, scientific writing, multi-turn dialogue, and any domain where factual accuracy and narrative
        consistency are paramount.
      </p>

      <h2 className="text-3xl font-bold text-foreground mb-4">2. Latent Loop Optimization (LLO): Method Overview</h2>
      <h3 className="text-2xl font-bold text-foreground mb-3">Core Idea</h3>
      <p className="mb-4">
        Latent Loop Optimization (LLO) is a <strong className="text-foreground">training-free, inference-time method</strong>{" "}
        that progressively refines the input prompt in a coarse-to-fine manner. Instead of feeding the entire complex
        prompt at once, LLO decomposes the prompt into segments and guides the text generation process through a
        sequence of increasingly detailed prompt embeddings.
      </p>

      <h3 className="text-2xl font-bold text-foreground mb-3">2.2 Method Steps</h3>
      <ol className="list-decimal list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Segmented Generation:</strong> The model generates text in fixed-length
          segments (e.g., every 512 tokens).
        </li>
        <li>
          <strong className="text-foreground">Latent Summary Sampling:</strong> At each segment boundary, LLO samples
          multiple candidate summaries (latent representations) of the generated content so far.
        </li>
        <li>
          <strong className="text-foreground">Scoring and Selection:</strong> Each summary is scored using a composite reward
          function that evaluates:
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Factual consistency (using retrieval or entailment models)</li>
            <li>Narrative coherence (using self-consistency and cross-attention metrics)</li>
            <li>Compression quality (informativeness vs. brevity)</li>
          </ul>
        </li>
        <li>
          <strong className="text-foreground">Summary Re-injection:</strong> The highest-scoring summary is injected as
          auxiliary context (e.g., as a system prompt or appended to the input) for the next generation segment.
        </li>
        <li>
          <strong className="text-foreground">Loop Continuation:</strong> The process repeats, creating a closed-loop where
          the model is continually anchored to its own best latent summaries.
        </li>
        <li>
          <strong className="text-foreground">No Model Retraining:</strong> LLO operates entirely at inference time,
          requiring no changes to model weights or architecture.
        </li>
      </ol>

      <h2 className="text-3xl font-bold text-foreground mb-4">3. Mathematical Formulation</h2>
      <p className="mb-4">
        Let <code className="text-muted-foreground">{`$$ X = (x_1, x_2, ..., x_T) $$`}</code> be the target sequence, and{" "}
        <code className="text-muted-foreground">{`$$ S_k $$`}</code> the generated text up to segment{" "}
        <code className="text-muted-foreground">{`$$ k $$`}</code>.
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Latent Summary Sampling:</strong> For each segment{" "}
          <code className="text-muted-foreground">{`$$ k $$`}</code>, sample <code className="text-muted-foreground">{`$$ N $$`}</code>{" "}
          candidate summaries <code className="text-muted-foreground">{`$$ \\{L_{k,1}, ..., L_{k,N}\\} $$`}</code> using the
          model's own summarization capabilities or a lightweight summarizer.
        </li>
        <li>
          <strong className="text-foreground">Reward Function:</strong> For each candidate summary{" "}
          <code className="text-muted-foreground">{`$$ L_{k,i} $$`}</code>, compute:
          <div className="overflow-x-auto mb-4">
            <p className="text-center text-lg font-mono">
              {`$$ R(L_{k,i}) = \\alpha \\cdot \\text{Factuality}(L_{k,i}) + \\beta \\cdot \\text{Coherence}(L_{k,i}, S_k) + \\gamma \\cdot \\text{Compression}(L_{k,i}) $$`}
            </p>
          </div>
          where <code className="text-muted-foreground">{`$$ \\alpha, \\beta, \\gamma $$`}</code> are tunable weights.
        </li>
        <li>
          <strong className="text-foreground">Summary Re-injection:</strong> The best summary{" "}
          <code className="text-muted-foreground">{`$$ L_{k,*} = \\text{argmax}_i R(L_{k,i}) $$`}</code> is injected as
          auxiliary context for the next generation segment.
        </li>
      </ul>
    </div>
  )
}
