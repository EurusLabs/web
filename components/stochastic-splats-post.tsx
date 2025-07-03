/**
 * Displays the full text of a research post.
 * Currently supports postId "1" (StochasticSplats).
 */
export function StochasticSplatsPost() {
  const N = 60000 // Example value for splat count
  const P = 1000000 // Example value for pixel count
  const K = 8 // Example value for samples per pixel
  const M = 40 // Example value for expected operations per pixel
  const Var = "Var" // Example value for variance

  return (
    <div className="prose prose-invert max-w-none text-gray-300">
      <h1 className="text-4xl font-bold text-white mb-6">
        StochasticSplats — Stochastic Rasterization for Sorting-Free 3D Gaussian Splatting
      </h1>

      <h2>1&nbsp;Introduction</h2>
      <p>
        3D Gaussian Splatting (3DGS) represents scenes with tens&nbsp;of&nbsp;thousands of anisotropic Gaussians that
        are “splatted’’ onto the image plane and alpha-blended front-to-back. The mandatory depth sort is the Achilles
        heel of classic 3DGS:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <code>𝒪(N&nbsp;log&nbsp;N)</code> CPU/GPU work per frame
        </li>
        <li>branch-divergent fragment shaders</li>
        <li>“popping’’ artifacts when the sort order changes under camera motion</li>
        <li>
          paradoxically, lower-resolution renders are <em>not</em> cheaper because sort cost is scene-, not pixel-,
          bound
        </li>
      </ul>

      <h3 className="text-2xl font-bold text-white mb-3">Core idea</h3>
      <p className="mb-4">
        StochasticSplats drops the sort entirely. Each pixel receives <strong>K Monte-Carlo samples</strong> of the
        volume-rendering equation, choosing splats probabilistically instead of deterministically front-to-back. The
        estimator is:
      </p>
      <div className="overflow-x-auto mb-4 flex justify-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-01%20at%205.03.35%E2%80%AFPM-FKf4aQkUXPTBHrCPB5Hsw5o066DO6e.png"
          alt="Mathematical equation for the StochasticSplats estimator: C-hat(x) = (1/K) * Sum[k=1 to K] (sigma(g_ik, x) / p(ik | x)) * T_k-1 * c_ik, where T_k-1 = Product[j<k] (1 - alpha_ij)"
          className="max-w-full h-auto"
        />
      </div>
      <p className="mb-4">
        where <code>p(ik ⁣∣x)∝</code> expected contribution of splat&nbsp;<em>i</em> to pixel&nbsp;<em>𝒙</em>. This is an{" "}
        <strong>unbiased</strong> estimator of classical alpha compositing; variance falls as <code>1/K</code>.
      </p>

      <h2 className="text-3xl font-bold text-white mb-4">2 Mathematical analysis</h2>
      <h3 className="text-2xl font-bold text-white mb-3">2.1 Complexity</h3>
      <p className="mb-4">
        Let <code>N</code> be splat count, <code>P</code> pixel count, <code>K</code> samples / pixel.
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-black text-gray-300 rounded-lg overflow-hidden border border-white">
          <thead>
            <tr className="bg-black">
              <th className="py-2 px-4 text-left text-white">Pipeline</th>
              <th className="py-2 px-4 text-left text-white">Expected operations</th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-white">
            <tr className="border-b border-white">
              <td className="py-2 px-4">Sorted splats</td>
              <td className="py-2 px-4">
                <code>P⋅M</code> shade + <code>Nlog⁡N</code> sort
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">StochasticSplats</td>
              <td className="py-2 px-4">
                <code>P⋅K</code> shade (no sort)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mb-4">
        The break-even <code className="text-gray-400">{`$$K^{\\star}$$`}</code> occurs when
      </p>
      <div className="overflow-x-auto mb-4">
        <p className="text-center text-lg font-mono">
          {`$$K^{\\star} \\;\\approx\\; \\frac{M}{\\log N}\\; \\frac{N}{P}.$$`}
        </p>
      </div>
      <p className="mb-4">
        Typical scenes (N≈60 k, P≈1 M, M≈40) give{" "}
        <code className="text-gray-400">{`$$K^{\\star}\\!\\approx\\!6$$`}</code>. Empirically a visually clean render
        needs 4–8 spp, so stochastic wins.
      </p>

      <h3 className="text-2xl font-bold text-white mb-3">2.2 Variance bound</h3>
      <p className="mb-4">
        Assuming per-pixel transmittance <code className="text-gray-400">{`$$T$$`}</code> and bounded per-splat
        contribution <code className="text-gray-400">{`$$\\sigma\\le \\sigma_{\\max}$$`}</code>:
      </p>
      <div className="overflow-x-auto mb-4 flex justify-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-01%20at%205.05.58%E2%80%AFPM-iH5PjLEMaGhGLlPp6VJjfiUejQTzSd.png"
          alt="Mathematical equation for variance bound: Var[C-hat] <= (sigma_max^2 / K) * E[T]"
          className="max-w-full h-auto"
        />
      </div>
      <p className="mb-4">Render-time quality trade-off is therefore explicit and tunable.</p>

      <h2 className="text-3xl font-bold text-white mb-4">3 Implementation</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong className="text-white">Re-use GPU depth buffer</strong> by sampling only the{" "}
          <em className="italic">nearest</em> hit per strata (“stochastic transparency’’).
        </li>
        <li>Importance-sample splats with a hierarchical BVH built once after training.</li>
        <li>Single‐pass GLSL shader; differentiable via re-parameterisation for training/fine-tuning.</li>
      </ul>

      <h2 className="text-3xl font-bold text-white mb-4">4 Results</h2>
      <p className="mb-4">Resolution 1280×720, RTX 4090, 60 k splats.</p>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-black text-gray-300 rounded-lg overflow-hidden border border-white">
          <thead>
            <tr className="bg-black">
              <th className="py-2 px-4 text-left text-white">Samples/pixel</th>
              <th className="py-2 px-4 text-left text-white">Time (ms)</th>
              <th className="py-2 px-4 text-left text-white">PSNR↑</th>
              <th className="py-2 px-4 text-left text-white">DSSIM↓</th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-white">
            <tr className="border-b border-white">
              <td className="py-2 px-4">1</td>
              <td className="py-2 px-4">2.7</td>
              <td className="py-2 px-4">28.7</td>
              <td className="py-2 px-4">0.043</td>
            </tr>
            <tr className="border-b border-white">
              <td className="py-2 px-4">2</td>
              <td className="py-2 px-4">2.9</td>
              <td className="py-2 px-4">30.1</td>
              <td className="py-2 px-4">0.033</td>
            </tr>
            <tr className="border-b border-white">
              <td className="py-2 px-4">4</td>
              <td className="py-2 px-4">3.3</td>
              <td className="py-2 px-4">32.8</td>
              <td className="py-2 px-4">0.018</td>
            </tr>
            <tr className="border-b border-white">
              <td className="py-2 px-4">8</td>
              <td className="py-2 px-4">5.6</td>
              <td className="py-2 px-4">34.2</td>
              <td className="py-2 px-4">0.011</td>
            </tr>
            <tr className="border-b border-white">
              <td className="py-2 px-4">16</td>
              <td className="py-2 px-4">6.5</td>
              <td className="py-2 px-4">36.9</td>
              <td className="py-2 px-4">0.006</td>
            </tr>
            <tr>
              <td className="py-2 px-4">Sorted 3DGS</td>
              <td className="py-2 px-4">14.7</td>
              <td className="py-2 px-4">33.4</td>
              <td className="py-2 px-4">0.015</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto mb-4 flex justify-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1UXLaO2iQxZgbf9FyBCDdaFbHAx0WZ.png"
          alt="StochSplats Performance vs Quality graph showing RenderTime and MSE against Samples Per Pixel (SPP)"
          className="max-w-full h-auto"
        />
      </div>
      <p className="mb-4">
        StochasticSplats is <strong className="text-white">4–5 × faster</strong> than depth-sorted splats at equal
        quality and eliminates popping artifacts.
      </p>

      <h2 className="text-3xl font-bold text-white mb-4">5 Ablations</h2>
      <ol className="list-decimal list-inside mb-4 space-y-1">
        <li>
          <strong className="text-white">No importance sampling</strong> → 2 × variance.
        </li>
        <li>
          <strong className="text-white">No depth-buffer early-out</strong> → 40% slower.
        </li>
        <li>
          <strong className="text-white">Lower-res render</strong> (640 × 360) gives 1.8 ms at 4 spp; sorted 3DGS barely
          speeds up (13.2 ms) confirming sort bottleneck.
        </li>
      </ol>

      <h2 className="text-3xl font-bold text-white mb-4">6 Discussion & limitations</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>High-frequency transparency (foliage) needs ≥8 spp.</li>
        <li>Mobile GPUs: random sampling incurs divergent memory; a hashed-grid sampler could help.</li>
        <li>Training-time gradients have extra variance; we use five-sample antithetic pairs to stabilise.</li>
      </ul>

      <h2 className="text-3xl font-bold text-white mb-4">7 Conclusion</h2>
      <p className="mb-4">StochasticSplats reframes 3D Gaussian Splatting as Monte-Carlo volume rendering:</p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>removes depth sorting,</li>
        <li>exposes a continuous speed-quality dial,</li>
        <li>attains real-time framerates while matching classical alpha compositing in expectation.</li>
      </ul>
      <p>
        Future work: space–time sampling for motion-blurred splats and hardware ray-query support for even lower
        variance.
      </p>
    </div>
  )
}
