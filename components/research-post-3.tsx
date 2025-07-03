import Image from "next/image" // Import Image component

export default function ProgressivePromptDetailingPost() {
  return (
    <div className="prose max-w-none text-foreground">
      <h1 className="text-4xl font-bold text-foreground mb-6">
        Progressive Prompt Detailing for Improved Alignment in Text-to-Image Generative Models
      </h1>
      {/* Image under title */}
      <div className="mb-8 w-full flex justify-center">
        <Image
          src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/progressive-prompt-detailing-new.jpeg" // Updated image path
          alt="Progressive Prompt Detailing concept"
          width={1000}
          height={600}
          className="rounded-lg object-contain w-full h-auto"
        />
      </div>
      <p className="text-muted-foreground mb-6">
        <em>Based on the work of Aarsh Ashdhir</em>
      </p>

      <h2 className="text-3xl font-bold text-foreground mb-4">Abstract</h2>
      <p className="mb-4">
        Text-to-image generative models, such as Stable Diffusion and DALL·E, have achieved remarkable results in
        synthesizing images from textual descriptions. However, these models often falter when presented with long,
        complex prompts that describe scenes with multiple objects, intricate relationships, or fine-grained attributes.
        This report analyzes the challenges of prompt alignment in such models and presents the SCo-PE (Stochastic
        Controllable Prompt Embeddings) method—a training-free, progressive prompt refinement approach that
        significantly improves text-to-image alignment, especially for complex, multi-object scenes.
      </p>

      <h2 className="text-3xl font-bold text-foreground mb-4">1. Introduction</h2>
      <h3 className="text-2xl font-bold text-foreground mb-3">The Alignment Challenge</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Long, detailed prompts:</strong> Modern generative models struggle to
          faithfully render all elements described in lengthy, complex prompts.
        </li>
        <li>
          <strong className="text-foreground">Multi-object scenes:</strong> When prompts specify several objects with
          distinct attributes or spatial relationships, models often omit, merge, or misrepresent details.
        </li>
        <li>
          <strong className="text-foreground">Prompt truncation:</strong> Transformer-based text encoders may truncate or
          underweight later parts of a prompt, leading to loss of information.
        </li>
      </ul>

      <h3 className="text-2xl font-bold text-foreground mb-3">Motivation</h3>
      <p className="mb-4">
        Improving prompt-to-image alignment is critical for applications in design, advertising, scientific
        illustration, and any domain requiring precise visual synthesis from text.
      </p>

      <h2 className="text-3xl font-bold text-foreground mb-4">2. SCo-PE: Stochastic Controllable Prompt Embeddings</h2>
      <h3 className="text-2xl font-bold text-foreground mb-3">Core Idea</h3>
      <p className="mb-4">
        SCo-PE is a <strong className="text-foreground">training-free, inference-time method</strong> that progressively
        refines the input prompt in a coarse-to-fine manner. Instead of feeding the entire complex prompt at once,
        SCo-PE decomposes the prompt into segments and guides the image generation process through a sequence of
        increasingly detailed prompt embeddings.
      </p>

      <h3 className="text-2xl font-bold text-foreground mb-3">Method Overview</h3>
      <h4 className="text-xl font-bold text-foreground mb-2">1. Prompt Decomposition:</h4>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          The input prompt is split into a sequence of sub-prompts, ordered from general (coarse) to specific
          (fine-grained).
        </li>
        <li>
          Example:
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Coarse: "A city street at night"</li>
            <li>
              Fine: "A city street at night, with neon signs, a red car parked by the sidewalk, and people holding
              umbrellas"
            </li>
          </ul>
        </li>
      </ul>

      <h4 className="text-xl font-bold text-foreground mb-2">2. Progressive Embedding Injection:</h4>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>During the diffusion process, the model is first conditioned on the coarse prompt embedding.</li>
        <li>
          At scheduled timesteps, finer-grained prompt embeddings are stochastically injected, gradually increasing the
          level of detail the model attends to.
        </li>
      </ul>

      <h4 className="text-xl font-bold text-foreground mb-2">3. Stochasticity and Control:</h4>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          The injection schedule and the degree of blending between embeddings are controlled stochastically, allowing
          for diversity and controllability in the generated images.
        </li>
      </ul>

      <h4 className="text-xl font-bold text-foreground mb-2">4. No Model Retraining:</h4>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          SCo-PE operates entirely at inference time and does not require any changes to the underlying model weights or
          additional training.
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mb-4">3. Mathematical Formulation</h2>
      <p className="mb-4">
        Let <code className="text-foreground">{`$$ P = [p_1, p_2, ..., p_n] $$`}</code> be the sequence of prompt segments
        from coarse to fine.
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          At each diffusion timestep <code className="text-foreground">{`$$ t $$`}</code>, the conditioning embedding{" "}
          <code className="text-foreground">{`$$ e_t $$`}</code> is a stochastic blend:
          <div className="overflow-x-auto mb-4">
            <p className="text-center text-lg font-mono">{`$$ e_t = \\sum_{i=1}^n w_{i,t} \\cdot E(p_i) $$`}</p>
          </div>
          where <code className="text-foreground">{`$$ E(p_i) $$`}</code> is the embedding of segment{" "}
          <code className="text-foreground">{`$$ p_i $$`}</code>, and{" "}
          <code className="text-foreground">{`$$ w_{i,t} $$`}</code> are time-dependent weights that increase for finer
          segments as <code className="text-foreground">{`$$ t $$`}</code> progresses.
        </li>
        <li>
          The schedule for <code className="text-foreground">{`$$ w_{i,t} $$`}</code> can be linear, exponential, or
          learned, but is typically designed so that:
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Early timesteps: <code className="text-foreground">{`$$ w_{1,t} $$`}</code> (coarse) is high, others are
              low.
            </li>
            <li>
              Later timesteps: <code className="text-foreground">{`$$ w_{n,t} $$`}</code> (fine) increases, allowing
              detailed information to dominate.
            </li>
          </ul>
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mb-4">4. Experimental Results</h2>
      <h3 className="text-2xl font-bold text-foreground mb-3">Datasets and Models</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Datasets:</strong> MS-COCO, DrawBench, and custom prompts with complex,
          multi-object scenes.
        </li>
        <li>
          <strong className="text-foreground">Models:</strong> Stable Diffusion v1.5, DALL·E 2, and other transformer-based
          text-to-image models.
        </li>
      </ul>

      <h3 className="text-2xl font-bold text-foreground mb-3">Quantitative Metrics</h3>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-background text-foreground rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-background">
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                CLIP Score ↑
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Object Recall ↑
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">FID ↓</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Human Alignment ↑
              </th>
            </tr>
          </thead>
          <tbody className="bg-background">
            <tr className="">
              <td className="px-6 py-4 whitespace-nowrap">Baseline (full prompt)</td>
              <td className="px-6 py-4 whitespace-nowrap">0.27</td>
              <td className="px-6 py-4 whitespace-nowrap">0.61</td>
              <td className="px-6 py-4 whitespace-nowrap">18.2</td>
              <td className="px-6 py-4 whitespace-nowrap">42%</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">SCo-PE (ours)</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <strong className="text-foreground">0.32</strong>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <strong className="text-foreground">0.74</strong>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <strong className="text-foreground">15.7</strong>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <strong className="text-foreground">68%</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">CLIP Score:</strong> Measures semantic similarity between prompt and generated
          image.
        </li>
        <li>
          <strong className="text-foreground">Object Recall:</strong> Fraction of prompt-specified objects correctly
          rendered.
        </li>
        <li>
          <strong className="text-foreground">FID:</strong> Fréchet Inception Distance (lower is better).
        </li>
        <li>
          <strong className="text-foreground">Human Alignment:</strong> % of images rated as "faithful" to prompt by human
          evaluators.
        </li>
      </ul>

      <h3 className="text-2xl font-bold text-foreground mb-3">Qualitative Examples</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Baseline:</strong> Misses secondary objects, merges attributes, or omits
          spatial relationships.
        </li>
        <li>
          <strong className="text-foreground">SCo-PE:</strong> Accurately renders all specified objects, preserves
          fine-grained details, and maintains scene coherence.
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mb-4">5. Ablation Studies</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">No progressive detailing:</strong> Alignment drops by 20–30% for complex
          prompts.
        </li>
        <li>
          <strong className="text-foreground">No stochasticity:</strong> Images become repetitive, less diverse.
        </li>
        <li>
          <strong className="text-foreground">Randomized injection schedule:</strong> Slightly lower alignment, but higher
          diversity.
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mb-4">6. Discussion</h2>
      <h3 className="text-2xl font-bold text-foreground mb-3">Advantages</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Training-free:</strong> Can be applied to any existing text-to-image model.
        </li>
        <li>
          <strong className="text-foreground">Improved alignment:</strong> Especially effective for long, complex prompts
          with multiple objects.
        </li>
        <li>
          <strong className="text-foreground">Controllable diversity:</strong> Stochastic blending allows for both faithful
          and creative outputs.
        </li>
      </ul>

      <h3 className="text-2xl font-bold text-foreground mb-3">Limitations</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-foreground">Prompt decomposition:</strong> Requires either manual or automated segmentation
          of prompts, which may not always be straightforward.
        </li>
        <li>
          <strong className="text-foreground">Inference overhead:</strong> Slightly increased inference time due to multiple
          embedding computations.
        </li>
        <li>
          <strong className="text-foreground">Not a panacea:</strong> Some failure cases remain for extremely ambiguous or
          contradictory prompts.
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mb-4">7. Conclusion</h2>
      <p className="mb-4">
        SCo-PE demonstrates that <strong className="text-foreground">progressive, stochastic prompt detailing</strong> is a
        powerful, training-free method for improving text-to-image alignment in generative models. By guiding the model
        from coarse scene structure to fine-grained details, SCo-PE enables more faithful, controllable, and diverse
        image synthesis—especially for complex, multi-object prompts. This approach opens new avenues for prompt
        engineering, controllable generation, and practical deployment of text-to-image models in real-world creative
        and professional workflows.
      </p>
    </div>
  )
}
