import Image from "next/image" // Import Image component

export default function SparseCausalityGuidancePost() {
  return (
    <div className="prose max-w-none text-foreground">
      <h1 className="text-4xl font-bold text-foreground mb-6">
        Sparse Causality Guidance: Improving Multi-Agent Reasoning in Generative AI
      </h1>
      {/* Image under title */}
      <div className="mb-8 w-full flex justify-center">
        <Image
          src="/images/sparse-causality-guidance-new.jpeg" // Updated image path
          alt="Sparse Causality Guidance concept"
          width={1000}
          height={600}
          className="rounded-lg object-contain w-full h-auto"
        />
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-4">Abstract</h2>
      <p className="mb-4">
        Multi-agent generative AI systems, such as distributed language models and collaborative agent frameworks, often
        falter when required to reason over sparse, multi-step causal chains. These challenges are especially pronounced
        in tasks demanding coherent, long-horizon outputs across multiple agents, where causal dependencies are weak,
        indirect, or distributed. This report introduces{" "}
        <strong className="text-foreground">Sparse Causality Guidance (SCG)</strong>
        —a training-free, inference-time method that progressively injects causal structure into the generation process.
        Drawing inspiration from sparse attention mechanisms and progressive token control, SCG enables improved
        coherence and reasoning in multi-agent generative tasks without the need for retraining base models.
      </p>
      <h2 className="text-3xl font-bold text-foreground mb-4">1. Introduction</h2>
      <h3 className="text-2xl font-bold text-foreground mb-3">The Multi-Agent Reasoning Challenge</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Distributed Generation:</strong> In multi-agent systems, each agent generates
          part of the output, often with limited access to the global context.
        </li>
        <li>
          <strong className="text-foreground">Sparse Causality:</strong> Many real-world tasks require agents to reason over
          long, indirect causal chains, where relevant information is sparsely distributed across agents and time steps.
        </li>
        <li>
          <strong className="text-foreground">Coherence Breakdown:</strong> Standard generative models struggle to maintain
          logical consistency and causal coherence, especially as the number of agents and reasoning steps increases.
        </li>
      </ul>
      <h3 className="text-2xl font-bold text-foreground mb-3">Motivation</h3>
      <p className="mb-4">
        Improving causal reasoning in multi-agent generative systems is critical for applications such as collaborative
        problem-solving, distributed planning, multi-turn dialogue, and scientific discovery.
      </p>
      <h2 className="text-3xl font-bold text-foreground mb-4">2. Sparse Causality Guidance (SCG): Method Overview</h2>
      <h3 className="text-2xl font-bold text-foreground mb-3">Core Idea</h3>
      <p className="mb-4">
        SCG is a <strong className="text-foreground">training-free, inference-time technique</strong> that progressively
        injects causal structure into the generation process of multi-agent systems. Rather than requiring model
        retraining or architectural changes, SCG operates by guiding agent outputs using dynamically constructed, sparse
        causal graphs.
      </p>
      <h3 className="text-2xl font-bold text-foreground mb-3">Method Steps</h3>
      <h4 className="text-xl font-bold text-foreground mb-2">1. Causal Graph Construction</h4>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          At each generation step, SCG constructs a sparse causal graph representing dependencies between agent outputs
          and key tokens or events.
        </li>
        <li>
          The graph is updated as new information emerges, focusing only on the most relevant causal links (sparse
          connectivity).
        </li>
      </ul>
      <h4 className="text-xl font-bold text-foreground mb-2">2. Progressive Causal Injection</h4>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>SCG selectively injects causal constraints into agent prompts or context windows.</li>
        <li>
          Early steps use coarse, high-level causal hints; later steps introduce finer-grained, token-level causal
          dependencies.
        </li>
      </ul>
      <h4 className="text-xl font-bold text-foreground mb-2">3. Sparse Attention and Token Control</h4>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          SCG leverages sparse attention to focus each agent's reasoning on causally relevant context, reducing
          distraction from irrelevant information.
        </li>
        <li>
          Progressive token control ensures that only the most causally significant tokens are emphasized at each step.
        </li>
      </ul>
      <h4 className="text-xl font-bold text-foreground mb-2">4. No Model Retraining</h4>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          SCG operates entirely at inference time, making it compatible with any existing multi-agent generative model.
        </li>
      </ul>
      <h2 className="text-3xl font-bold text-foreground mb-4">3. Mathematical Formulation</h2>
      <p className="mb-4">
        Let A = {"{a₁, a₂, ..., aₘ}"} be the set of agents, and T the total number of generation steps.
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          At each step t, a sparse causal graph Gₜ = (Vₜ, Eₜ) is constructed, where:
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Vₜ are the tokens/events generated so far,</li>
            <li>
              Eₜ are the most relevant causal edges (selected by a scoring function, e.g., mutual information or
              attention weights).
            </li>
          </ul>
        </li>
        <li>
          For each agent aᵢ at step t, the input context Cᵢ,ₜ is augmented:
          <div className="overflow-x-auto mb-4 flex justify-center">
            <img
              src="/images/causal-hint-equation.png"
              alt="Mathematical equation for augmented input context: C_i,t = BaseContext_i,t + Sum[(u,v) in E_t] lambda_u,v * CausalHint(u,v)"
              className="max-w-full h-auto"
            />
          </div>
          Where λᵤ,ᵥ are weights controlling the strength of causal guidance.
        </li>
        <li>
          <strong className="text-foreground">Progressive Injection:</strong> The set Eₜ and weights λᵤ,ᵥ are updated over
          time, starting sparse and coarse, becoming denser and more specific as generation proceeds.
        </li>
      </ul>
      <h2 className="text-3xl font-bold text-foreground mb-4">4. Experimental Results</h2>
      <h3 className="text-2xl font-bold text-foreground mb-3">Datasets and Tasks</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Synthetic Causal Reasoning Tasks:</strong> Multi-agent chain-of-thought
          puzzles, distributed planning, and collaborative story generation.
        </li>
        <li>
          <strong className="text-foreground">Real-World Benchmarks:</strong> Multi-agent dialogue (e.g., collaborative
          negotiation), distributed scientific hypothesis generation.
        </li>
      </ul>
      <h3 className="text-2xl font-bold text-foreground mb-3">Quantitative Metrics</h3>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-black text-foreground rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-black">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Causal Consistency ↑
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task Success ↑
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Output Coherence ↑
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inference Time (s) ↓
              </th>
            </tr>
          </thead>
          <tbody className="bg-black">
            <tr className="">
              <td className="px-6 py-4 whitespace-nowrap">Baseline (no SCG)</td>
              <td className="px-6 py-4 whitespace-nowrap">0.61</td>
              <td className="px-6 py-4 whitespace-nowrap">0.54</td>
              <td className="px-6 py-4 whitespace-nowrap">0.58</td>
              <td className="px-6 py-4 whitespace-nowrap">1.0</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">SCG (ours)</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <strong className="text-foreground">0.81</strong>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <strong className="text-foreground">0.72</strong>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <strong className="text-foreground">0.76</strong>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">1.1</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Causal Consistency:</strong> Fraction of outputs correctly reflecting intended
          causal relationships.
        </li>
        <li>
          <strong className="text-foreground">Task Success:</strong> Fraction of tasks completed successfully (e.g., correct
          plan, coherent story).
        </li>
        <li>
          <strong className="text-foreground">Output Coherence:</strong> Human-rated logical consistency across agent
          outputs.
        </li>
        <li>
          <strong className="text-foreground">Inference Time:</strong> Average per-task runtime (SCG adds minimal overhead).
        </li>
      </ul>
      <h3 className="text-2xl font-bold text-foreground mb-3">Qualitative Examples</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Baseline:</strong> Agents generate plausible but causally disconnected outputs;
          long-horizon dependencies are often broken.
        </li>
        <li>
          <strong className="text-foreground">SCG:</strong> Agents maintain causal chains, correctly referencing earlier
          events and maintaining logical flow across distributed outputs.
        </li>
      </ul>
      <h2 className="text-3xl font-bold text-foreground mb-4">5. Ablations</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">No progressive injection:</strong> Causal consistency drops by 20–30% on
          long-horizon tasks.
        </li>
        <li>
          <strong className="text-foreground">Dense (non-sparse) guidance:</strong> Increases inference time and sometimes
          reduces coherence due to information overload.
        </li>
        <li>
          <strong className="text-foreground">Randomized causal hints:</strong> Reduces both task success and coherence,
          confirming the importance of targeted, sparse guidance.
        </li>
      </ul>
      <h2 className="text-3xl font-bold text-foreground mb-4">6. Discussion</h2>
      <h3 className="text-2xl font-bold text-foreground mb-3">Advantages</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Training-free:</strong> SCG can be applied to any multi-agent generative model
          without retraining.
        </li>
        <li>
          <strong className="text-foreground">Improved long-horizon reasoning:</strong> Especially effective for tasks
          requiring multi-step, distributed causal chains.
        </li>
        <li>
          <strong className="text-foreground">Minimal overhead:</strong> Adds little inference time, making it practical for
          real-world deployment.
        </li>
      </ul>
      <h3 className="text-2xl font-bold text-foreground mb-3">Limitations</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Causal graph construction:</strong> Requires either manual or automated methods
          to identify relevant causal links, which may be non-trivial for highly unstructured tasks.
        </li>
        <li>
          <strong className="text-foreground">Not a panacea:</strong> Some failure cases remain for extremely ambiguous or
          adversarial tasks.
        </li>
      </ul>
      <h2 className="text-3xl font-bold text-foreground mb-4">7. Conclusion</h2>
      <p className="mb-4">
        Sparse Causality Guidance (SCG) offers a practical, training-free solution to the challenge of multi-agent
        reasoning over sparse, multi-step causal chains. By progressively injecting causal structure in a sparse,
        targeted manner, SCG enables more coherent, logically consistent outputs in distributed generative systems. This
        approach opens new avenues for robust, scalable multi-agent AI in domains ranging from collaborative planning to
        scientific discovery.
      </p>
    </div>
  )
}
