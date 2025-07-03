"use client"

import Navigation from "../components/navigation"
import Link from "next/link"
import React from "react"

export default function EurusStudioPage() {
  return (
    <div className="min-h-screen bg-[#f7f7fa] text-foreground flex flex-col font-sf-pro">
      <Navigation />
      <main className="flex-1 w-full pt-0 pb-0 px-0">
        {/* Hero Section: Artistic Intelligence */}
        <section className="w-screen min-h-screen flex flex-col items-center justify-start pt-12 px-6 md:px-24 relative overflow-hidden" style={{ minHeight: '100vh' }}>
          {/* Infinite canvas background using <canvas> */}
          <InfiniteCanvasBackground />
          {/* Draggable nodes layer */}
          <DraggableNodesLayer />
          {/* Top-centered heading and subtitle */}
          <div className="relative z-10 flex flex-col items-center justify-start w-full pt-8">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 text-center text-black dark:text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
              Create Without Limits
            </h1>
            <p className="text-base md:text-lg font-light max-w-6xl mb-8 text-center text-black dark:text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
              All your favorite AI models. One seamless workspace.<br />
              Design, edit, and build with cinematic precision. Eurus brings together the best AI tools into a single node-based system—fluid, fast, and built for creators who demand more.
            </p>
          </div>
        </section>

        {/* Section: Every Model. Perfectly In Sync. */}
        <section className="w-screen h-screen relative overflow-hidden flex items-stretch" id="explore">
          <ProductsScrollSectionStudio />
        </section>

        {/* Section: With all the professional tools you rely on */}
        <section className="w-screen min-h-[50vh] py-20 flex flex-col items-center justify-center bg-[#f7f7fa]">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            All the Tools You Trust. Now in One Flow.
          </h2>
          <p className="text-lg md:text-xl font-light mb-8 text-center text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            From cropping to relighting, every pro feature you need—streamlined in a single creative pipeline.
          </p>
          <div className="w-full flex flex-col items-center justify-center">
            <span className="text-base md:text-lg font-medium text-center text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>
              Includes: Invert · Outpaint · Crop · Inpaint · Mask Extractor · Upscale · Z-Depth · Image Describer · Channels · Painter · Relight
            </span>
          </div>
        </section>

        {/* Section: Control the Outcome */}
        <section className="w-screen min-h-[60vh] py-20 flex flex-col items-center justify-center bg-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            Precision, Composed.
          </h2>
          <p className="text-lg md:text-xl font-light mb-8 text-center max-w-2xl text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            Master layers, text, and blending with absolute control.<br />
            Your ideas, rendered exactly as imagined.
          </p>
          <div className="relative w-full max-w-3xl h-80 flex items-center justify-center mb-6">
            {/* Placeholder for layered composition visual */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Stack of semi-transparent cards */}
              <div className="absolute left-8 top-8 w-56 h-32 bg-gray-200 rounded-xl shadow-lg opacity-70" />
              <div className="absolute left-16 top-16 w-56 h-32 bg-gray-300 rounded-xl shadow-lg opacity-80" />
              <div className="absolute left-24 top-24 w-56 h-32 bg-gray-400 rounded-xl shadow-lg opacity-90" />
              <div className="relative w-56 h-32 bg-white rounded-xl shadow-xl border-2 border-primary flex items-center justify-center text-lg font-bold text-gray-500" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                {/* TODO: Replace with animated stack or Lottie */}
                Layered Visual Placeholder
              </div>
            </div>
          </div>
          <p className="text-base font-light text-center text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            Maximize your team ability, by automatically generating a simplified UI
          </p>
        </section>

        {/* Section: Trusted By */}
        <section className="w-screen min-h-[30vh] py-12 flex flex-col items-center justify-center bg-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            Trusted By
          </h2>
          <div className="flex flex-row flex-wrap justify-center items-center gap-8 w-full max-w-4xl">
            {[1,2,3,4,5,6].map((n) => (
              <div key={n} className="w-32 h-16 bg-gray-200 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all shadow">
                {/* TODO: Replace with real client/partner logo */}
                <span className="text-lg font-bold text-gray-400 text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>Logo</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Explore Our Workflows */}
        <section className="w-screen min-h-[60vh] py-20 flex flex-col items-center justify-center bg-[#f7f7fa]">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            Explore Our Workflows
          </h2>
          <p className="text-lg md:text-xl font-light mb-10 text-center max-w-2xl text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            From multi-layer compositing to matte manipulation, Eurus Studio keeps up with your creativity with all the editing tools you recognize and rely on.
          </p>
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
            {[1,2,3,4,5,6].map((n) => (
              <div key={n} className="relative bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer">
                {/* Placeholder for workflow thumbnail */}
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-400 text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                  Workflow Image
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>Workflow Title {n}</h3>
                  <p className="text-base font-light mb-4 text-black" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                    Short description of the workflow goes here. This is a placeholder for the workflow summary.
                  </p>
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/80 transition-colors" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                      View Workflow
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function ProductsScrollSectionStudio() {
  const products = [
    { name: 'GPT', imgSrc: '/wave-glass.jpg', description: 'GPT is the world-leading generative AI for text, code, and more.' },
    { name: 'Runway Gen-4', imgSrc: '/glass-blobs.jpg', description: 'Runway Gen-4 brings next-gen video and image generation to creators.' },
    { name: 'Veo 3', imgSrc: '/color-flower-1.jpg', description: 'Veo 3 is a powerful AI for video understanding and creative editing.' },
    { name: 'Kling', imgSrc: '/color-flower-2.jpg', description: 'Kling enables advanced audio and speech synthesis for your projects.' },
    { name: 'Luma ray 2', imgSrc: '/blur-blue.jpg', description: 'Luma ray 2 delivers photorealistic 3D and lighting effects with AI.' },
  ];
  const [current, setCurrent] = React.useState(0);
  const sectionRefs = React.useRef<HTMLDivElement[]>([]);
  const nameRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const [highlightStyle, setHighlightStyle] = React.useState<{top: number, height: number}>({top: 0, height: 0});

  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLDivElement;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;
      let minDistance = Infinity;
      let found = 0;
      sectionRefs.current.forEach((ref, idx) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const distance = Math.abs(sectionCenter - containerCenter);
          if (distance < minDistance) {
            minDistance = distance;
            found = idx;
          }
        }
      });
      setCurrent(found);
    };
    const container = document.getElementById('products-scroll-viewport');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Call once to set initial state
      handleScroll({ target: container } as unknown as Event);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  React.useEffect(() => {
    function updateHighlight() {
      const el = nameRefs.current[current];
      if (el) {
        const parent = el.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          setHighlightStyle({
            top: elRect.top - parentRect.top,
            height: elRect.height,
          });
        }
      }
    }
    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    return () => window.removeEventListener('resize', updateHighlight);
  }, [current]);

  // For moving window effect
  const VISIBLE_COUNT = products.length; // Show all, or set to e.g. 3 for partial
  const NAME_HEIGHT = 72; // px, adjust to match text size and gap
  const containerHeight = NAME_HEIGHT * VISIBLE_COUNT;
  const translateY = -(current * NAME_HEIGHT - (containerHeight / 2 - NAME_HEIGHT / 2));

  return (
    <div id="products-scroll-viewport" className="w-full h-full relative overflow-hidden">
      {/* Background image changes as you scroll */}
      {products.map((product, idx) => (
        <img
          key={product.name}
          src={product.imgSrc}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 z-0 ${current === idx ? 'opacity-100' : 'opacity-0'}`}
          style={{ pointerEvents: 'none' }}
        />
      ))}
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
      {/* Overlayed static heading on top of image */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20" style={{ pointerEvents: 'none' }}>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          Every Model.<br />One Platform.
        </h2>
      </div>
      {/* Overlayed product name list, always visible */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2 z-20" style={{ pointerEvents: 'none' }}>
        {products.map((p, i) => (
          <span
            key={p.name}
            className={`text-5xl md:text-7xl font-bold transition-all duration-300 text-right ${current === i ? 'text-yellow-200' : 'text-white/80'}`}
            style={{ fontFamily: 'var(--font-sf-pro)', opacity: current === i ? 1 : 0.7 }}
          >
            {p.name}
          </span>
        ))}
      </div>
      {/* Invisible scroll area to trigger image/name change */}
      <div className="absolute inset-0 w-full h-full z-30" style={{ pointerEvents: 'auto' }}>
        <div className="h-full w-full flex flex-col justify-center items-center">
          <div className="w-full h-full overflow-y-auto scroll-snap-y-mandatory" style={{ scrollSnapType: 'y mandatory', height: '100%' }}
            onScroll={e => {
              const container = e.currentTarget;
              const vh = container.offsetHeight;
              const scrollY = container.scrollTop;
              const idx = Math.round(scrollY / vh);
              if (idx !== current && idx >= 0 && idx < products.length) setCurrent(idx);
            }}
          >
            {products.map((_, idx) => (
              <div key={idx} className="w-full h-full scroll-snap-align-start" style={{ scrollSnapAlign: 'start', height: '100%' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfiniteCanvasBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const isDark = document.documentElement.classList.contains('dark');
    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = isDark ? '#222' : '#eee';
    const bg = isDark ? '#000' : '#fff';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = isDark ? '#444' : '#bbb';
    const spacing = 32;
    const radius = 1.5;
    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }} />;
}

function DraggableNodesLayer() {
  // Node definitions
  const initialNodes = [
    { id: 1, x: 120, y: 220, w: 110, h: 110, type: 'image', label: '3D' }, // small square
    { id: 2, x: 120, y: 370, w: 260, h: 90, type: 'color', label: 'Color Reference' }, // wide rectangle
    { id: 3, x: 420, y: 220, w: 220, h: 300, type: 'image', label: 'Image' }, // large portrait
    { id: 4, x: 700, y: 220, w: 220, h: 300, type: 'video', label: 'Video' }, // large portrait
    { id: 5, x: 340, y: 320, w: 200, h: 60, type: 'text', label: 'Text' }, // moved further down
  ];
  const [nodes, setNodes] = React.useState(initialNodes);
  const [draggingId, setDraggingId] = React.useState<number | null>(null);
  const dragging = React.useRef<{ id: number | null; offsetX: number; offsetY: number }>({ id: null, offsetX: 0, offsetY: 0 });

  // Connections: array of [fromId, toId]
  const connections = [
    [1, 4], // image -> lut
    [4, 2], // lut -> video
    [2, 5], // video -> output
    [3, 2], // text -> video
  ];

  // Y position constraint: nodes cannot be moved above this Y (below the heading)
  const minY = 180; // px, adjust as needed for your heading height

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>, id: number) {
    const node = nodes.find(n => n.id === id);
    if (!node) return;
    dragging.current = {
      id,
      offsetX: e.clientX - node.x,
      offsetY: e.clientY - node.y,
    };
    setDraggingId(id);
    window.addEventListener('mousemove', onMouseMove as any);
    window.addEventListener('mouseup', onMouseUp as any);
  }
  function onMouseMove(e: MouseEvent) {
    const { id, offsetX, offsetY } = dragging.current;
    setNodes(nodes => nodes.map(n => {
      if (n.id !== id) return n;
      let newY = e.clientY - offsetY;
      if (newY < minY) newY = minY;
      return { ...n, x: e.clientX - offsetX, y: newY };
    }));
  }
  function onMouseUp() {
    dragging.current = { id: null, offsetX: 0, offsetY: 0 };
    setDraggingId(null);
    window.removeEventListener('mousemove', onMouseMove as any);
    window.removeEventListener('mouseup', onMouseUp as any);
  }

  // Helper to get node center
  function getNodeCenter(node: any) {
    return { x: node.x + node.w / 2, y: node.y + node.h / 2 };
  }

  // SVG curved lines between nodes with dots at ends
  const svgCurves = connections.map(([fromId, toId], i) => {
    const from = nodes.find(n => n.id === fromId);
    const to = nodes.find(n => n.id === toId);
    if (!from || !to) return null;
    const fromCenter = getNodeCenter(from);
    const toCenter = getNodeCenter(to);
    // More fluid/flowy curve
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    const curve = 0.5; // more curve
    const verticalOffset = 0.2 * dy; // add vertical offset for flow
    const c1 = { x: fromCenter.x + dx * curve, y: fromCenter.y + verticalOffset };
    const c2 = { x: toCenter.x - dx * curve, y: toCenter.y - verticalOffset };
    return (
      <g key={i}>
        <path
          d={`M${fromCenter.x},${fromCenter.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${toCenter.x},${toCenter.y}`}
          stroke="#fff"
          strokeWidth={1}
          fill="none"
          style={{ pointerEvents: 'none' }}
        />
        {/* Dots at both ends */}
        <circle cx={fromCenter.x} cy={fromCenter.y} r={6} fill="#fff" stroke="#bbb" strokeWidth={1} />
        <circle cx={toCenter.x} cy={toCenter.y} r={6} fill="#fff" stroke="#bbb" strokeWidth={1} />
      </g>
    );
  });

  return (
    <div className="absolute inset-0 w-full h-full z-10" style={{ pointerEvents: 'none' }}>
      {/* SVG lines */}
      <svg className="absolute inset-0 w-full h-full" width="100%" height="100%" style={{ pointerEvents: 'none' }}>
        {svgCurves}
      </svg>
      {/* Nodes */}
      {nodes.map(node => (
        <div
          key={node.id}
          className={`absolute flex flex-col items-center ${draggingId === node.id ? 'z-50' : 'z-20'}`}
          style={{ left: node.x, top: node.y, width: node.w, height: node.h, pointerEvents: 'auto', userSelect: 'none' }}
          onMouseDown={e => onMouseDown(e, node.id)}
        >
          {/* Label above node */}
          <span className="mb-1 text-xs font-semibold text-white dark:text-white bg-black/60 dark:bg-black/80 px-2 py-0.5 rounded select-none" style={{ marginBottom: 2 }}>{node.label}</span>
          {/* Node content */}
          <div
            className={`w-full h-full bg-white/80 dark:bg-black/80 border border-gray-300 dark:border-gray-700 shadow-md flex items-center justify-center select-none cursor-move relative ${node.type === 'video' ? 'rounded-lg' : 'rounded-xl'} ${draggingId === node.id ? 'shadow-2xl' : ''}`}
            style={{ pointerEvents: 'auto', transition: 'none' }}
          >
            {node.type === 'image' && (
              <img src="/placeholder.jpg" alt="img" className="w-full h-full object-cover rounded-xl" />
            )}
            {node.type === 'color' && (
              <img src="/public/images/color-flower-1.jpg" alt="color" className="w-full h-full object-cover rounded-xl" />
            )}
            {node.type === 'video' && (
              <video src="/public/videos/1.mp4" className="w-full h-full object-cover rounded-lg" autoPlay loop muted playsInline />
            )}
            {node.type === 'text' && (
              <span className="text-gray-700 dark:text-gray-200 text-sm px-2">Hello, world!</span>
            )}
          </div>
          {/* Subtitle/description below node */}
          <span className="mt-1 text-[11px] text-gray-300 dark:text-gray-400 select-none">
            {node.type === 'image' && 'Image node'}
            {node.type === 'color' && 'Color reference node'}
            {node.type === 'video' && 'Video node'}
            {node.type === 'text' && 'Text node'}
          </span>
        </div>
      ))}
    </div>
  );
} 