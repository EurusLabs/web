"use client"

import Navigation from "../components/navigation"
import Link from "next/link"
import React from "react"
import { ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toast, ToastAction, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Environment, useGLTF } from '@react-three/drei';

// Dynamically import the scroll section component to avoid SSR issues
const IdeasScrollNodesSection = dynamic(() => import('./IdeasScrollNodesSection'), {
  ssr: false,
  loading: () => (
    <section className="w-screen h-[300vh] bg-black relative flex flex-col items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </section>
  )
});

export default function EurusStudioPage() {
  const toolImages = [
    { label: 'Video', image: '/images/topvideo.mp4', isVideo: true },
    { label: 'Original', image: '/images/topcrop.png' },
    { label: 'Extend', image: '/images/topbg.jpeg' },
    { label: 'Invert', image: '/images/topinvert.png' },
    { label: 'Image Describer', image: '/images/top.jpg', hasTextOverlay: true },
    { label: 'Paint', image: '/images/toppaint.png' },
    { label: 'Depth Extractor', image: '/images/topz.png' },
    { label: '3D', image: '/images/top3D.glb', is3D: true },
    { label: 'LUT', image: '/images/toplut.jpeg' },
    { label: 'Prompt a change', image: '/images/top.jpg' },
  ];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [activeImage, setActiveImage] = useState('/images/topvideo.mp4');
  const [imageLoaded, setImageLoaded] = useState(true);
  const [is3D, setIs3D] = useState(false);
  function handleNextImage() {
    const nextIdx = (currentImageIdx + 1) % toolImages.length;
    setCurrentImageIdx(nextIdx);
    setActiveImage(toolImages[nextIdx].image);
    setImageLoaded(false);
  }



  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sf-pro" style={{ borderBottomLeftRadius: '2.5rem', borderBottomRightRadius: '2.5rem', overflow: 'hidden' }}>
      <Navigation />
      <main className="flex-1 w-full pt-0 pb-0 px-0">
        {/* Hero Section: Artistic Intelligence */}
        <section className="w-screen min-h-screen flex flex-col items-center justify-start pt-12 px-6 md:px-24 relative overflow-hidden" style={{ minHeight: '100vh' }}>
          {/* Infinite canvas background using <canvas> */}
          <InfiniteCanvasBackground />
          {/* Draggable nodes layer */}
          <DraggableNodesLayer onNodeAction={(action) => {
            if (action === 'remove-background') setActiveImage('/images/main.nobackground.png');
            else if (action === 'invert') setActiveImage('/images/main.invert.png');
            else if (action === '3d') setIs3D(true);
            else if (action === 'level-rgb') setActiveImage('/images/main.level.png');
            else setActiveImage('/images/main.png');
          }} />
          {/* Top-centered heading and subtitle */}
          <div className="relative z-10 flex flex-col items-center justify-start w-full pt-8">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 text-center text-black dark:text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
              Irreplacably Creative
            </h1>
            <p className="text-base md:text-lg font-light max-w-6xl mb-8 text-center text-black dark:text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
              All your favorite AI models. All your favorite tools. One seamless canvas.<br />
              Design, edit, and build with cinematic precision
            </p>
          </div>
        </section>

        {/* Section: Every Model. Perfectly In Sync. */}
        <section className="w-screen h-screen relative overflow-hidden flex items-stretch scroll-snap-section" id="explore">
          <ProductsScrollSectionStudio />
        </section>

        {/* Section: With all the professional tools you rely on */}
        <section className="w-screen h-screen flex items-center justify-center bg-black font-sf-pro relative" style={{ fontFamily: 'Inter, SF Pro, sans-serif' }}>
          {/* Full screen media with overlay text and side options */}
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black group"
          >
              <div className="w-full h-full relative overflow-hidden z-10">
                {toolImages[currentImageIdx].is3D ? (
                  <div 
                    key={`3d-${currentImageIdx}-${activeImage}`}
                    className="absolute inset-0 h-full flex items-center justify-center"
                    style={{ 
                      animation: 'pullInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                      marginLeft: '200px',
                      width: 'calc(100% - 200px)'
                    }}
                  >
                    <div
                      className="w-full h-full"
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                        // Store mouse position for 3D model rotation
                        const canvas = e.currentTarget.querySelector('canvas');
                        if (canvas) {
                          (canvas as any).mouseX = x;
                          (canvas as any).mouseY = y;
                        }
                      }}
                    >
                      <Canvas camera={{ position: [0, 0, 2.5] }} className="w-full h-full" style={{ background: '#111' }}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[2, 4, 2]} intensity={1.5} castShadow />
                        <Environment preset="city" />
                        <Model3D url={activeImage} />
                        <OrbitControls enablePan={false} />
                      </Canvas>
                    </div>
                  </div>
                ) : toolImages[currentImageIdx].isVideo ? (
                  <div 
                    key={`video-${currentImageIdx}-${activeImage}`}
                    className="h-full flex items-center justify-center relative"
                    style={{ 
                      animation: 'pullInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                      marginLeft: '200px',
                      width: 'calc(100% - 200px)'
                    }}
                  >
                    <video
                      key={activeImage}
                      src={activeImage}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      onLoadedData={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                    />
                  </div>
                ) : (
                  <div 
                    key={`image-${currentImageIdx}-${activeImage}`}
                    className={`h-full flex items-center justify-center relative ${
                      toolImages[currentImageIdx].label === 'Original' ? 'bg-black' : ''
                    }`}
                    style={{ 
                      animation: 'pullInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                      marginLeft: '200px',
                      width: 'calc(100% - 200px)'
                    }}
                  >
                    <img
                      key={activeImage}
                      src={activeImage}
                      alt={toolImages[currentImageIdx].label}
                      className={`${
                        toolImages[currentImageIdx].label === 'Original' 
                          ? 'max-w-full max-h-full object-contain' 
                          : 'w-full h-full object-cover'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                    />

                  </div>
                )}
              </div>
              
                                          {/* Title text overlay - CENTER TOP */}
              <div className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none z-50">
                <div className="text-center" style={{ marginLeft: '100px' }}>
                  <h2 className={`text-3xl md:text-4xl font-extrabold mb-2 leading-tight ${
                    ['Original', '3D', 'Depth Extractor'].includes(toolImages[currentImageIdx].label) ? 'text-white' : 'text-black'
                  }`} style={{ letterSpacing: '-0.01em', fontFamily: 'var(--font-sf-pro)' }}>
                    All the tools you trust.<br />Now in one flow.
                  </h2>
                  <p className={`text-base md:text-lg font-light ${
                    ['Original', '3D', 'Depth Extractor'].includes(toolImages[currentImageIdx].label) ? 'text-white/90' : 'text-black/80'
                  }`} style={{ fontFamily: 'var(--font-sf-pro)' }}>
                    From cropping to relighting—designed for flow.
                  </p>

                </div>
              </div>

              {/* Image description for Image Describer */}
              {toolImages[currentImageIdx].hasTextOverlay && (
                <div className="absolute right-0 top-0 h-full flex items-center pointer-events-none z-30">
                  <div className="text-right max-w-md pr-8">
                    <p className={`text-lg md:text-xl font-medium leading-relaxed ${
                      ['Original', '3D', 'Depth Extractor'].includes(toolImages[currentImageIdx].label) ? 'text-white' : 'text-black'
                    }`} style={{ fontFamily: 'var(--font-sf-pro)' }}>
                      The image shows a beautifully crafted wooden spinning top placed upright on a flat, textured surface. The top is made of polished wood with rich, natural grain patterns and a warm, amber-brown hue.
                    </p>
                  </div>
                </div>
              )}

              {/* Left side options list covering the image - always visible */}
              <div className="absolute left-0 top-0 h-full flex items-center z-40 bg-white">
                <div className="h-full flex items-center px-8">
                  <div className="flex flex-col gap-2">
                    {toolImages.map((tool, idx) => (
                      <button
                        key={tool.label}
                        onClick={() => {
                          setCurrentImageIdx(idx);
                          setActiveImage(tool.image);
                          setImageLoaded(true);
                        }}
                        className={`px-4 py-3 font-bold text-lg transition-all duration-200 focus:outline-none text-left ${
                          currentImageIdx === idx 
                            ? 'text-black'
                            : 'text-black/30 hover:text-black/60'
                        }`}
                        style={{ fontFamily: 'var(--font-sf-pro)', minWidth: '200px' }}
                      >
                        {tool.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-white/60 bg-black/60">
                  Loading…
                </div>
              )}
            </div>
        </section>

        {/* Section: Control the Outcome */}
        {/* Layered Visual Placeholder: Placeholder for multiple layered images */}
        <IdeasScrollNodesSection />
      </main>
    </div>
  )
}

function ProductsScrollSectionStudio() {
  const products = [
    { name: 'Eleven Labs', videoSrc: 'https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/person1.mp4', description: 'Eleven Labs is the world-leading generative AI for voice synthesis and audio.' },
    { name: 'Rodin', videoSrc: 'https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/person3.mp4', description: 'Rodin brings next-gen 3D generation and modeling to creators.' },
    { name: 'Veo 3', videoSrc: 'https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/peron2.mp4', description: 'Veo 3 is a powerful AI for video understanding and creative editing.' },
    { name: 'Kling', videoSrc: 'https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/person4.mp4', description: 'Kling enables advanced audio and speech synthesis for your projects.' },
    { name: 'Luma ray 2', videoSrc: 'https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/peron5.mp4', description: 'Luma ray 2 delivers photorealistic 3D and lighting effects with AI.' },
  ];
  
  const [current, setCurrent] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = React.useRef(false);
  const sectionRefs = React.useRef<HTMLDivElement[]>([]);
  const nameRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const [highlightStyle, setHighlightStyle] = React.useState<{top: number, height: number}>({top: 0, height: 0});

  // Trigger entrance animation
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // No scrolling - just change the current index for image transitions

  // Handle wheel events globally when section is in view
  const handleGlobalWheel = React.useCallback((e: WheelEvent) => {
    if (isScrollingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    const direction = e.deltaY > 0 ? 1 : -1;
    
    // If scrolling down and we're at the last item (Luma ray 2), allow page scroll
    if (direction > 0 && current === products.length - 1) {
      // Let the page scroll to next section
      return;
    }
    
    // If scrolling up and we're at the first item (Eleven Labs), allow page scroll  
    if (direction < 0 && current === 0) {
      // Let the page scroll to previous section
      return;
    }
    
    // PREVENT ALL PAGE SCROLLING for internal navigation
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    const newIndex = Math.max(0, Math.min(products.length - 1, current + direction));
    
    if (newIndex !== current) {
      isScrollingRef.current = true;
      setCurrent(newIndex);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Reset scrolling flag after transition completes
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 400);
    }
  }, [current, products.length]);

  // Add global wheel event listener when section is active
  React.useEffect(() => {
    const sectionElement = containerRef.current;
    if (!sectionElement) return;

    // Check if section is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Section is visible - add global wheel listener
            window.addEventListener('wheel', handleGlobalWheel, { passive: false });
          } else {
            // Section not visible - remove global wheel listener
            window.removeEventListener('wheel', handleGlobalWheel);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of section is visible
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', handleGlobalWheel);
    };
  }, [handleGlobalWheel]);

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

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id="products-scroll-viewport-studio" 
      className="w-full h-screen relative overflow-hidden"
    >
      {/* Background image changes as you scroll */}
      {products.map((product, idx) => (
        <video
          key={product.name}
          src={product.videoSrc}
          className={`absolute inset-0 w-full h-full object-cover z-0 ${current === idx ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            pointerEvents: 'none',
            transition: 'opacity 1200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            willChange: 'opacity'
          }}
          autoPlay
          loop
          muted
          playsInline
        />
      ))}
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
      {/* Overlayed static heading on top of image */}
      <div 
        className="absolute left-10 top-1/2 -translate-y-1/2 z-20" 
        style={{ 
          pointerEvents: 'none',
          transform: `translateY(-50%) translateX(${isLoaded ? '0' : '-100px'})`,
          opacity: isLoaded ? 1 : 0,
          transition: 'all 1200ms cubic-bezier(0.23, 1, 0.32, 1)',
          willChange: 'transform, opacity'
        }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          Every Model.<br />One Platform.
        </h2>
      </div>
      {/* Overlayed product name list, always visible */}
      <div 
        className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 z-20 pointer-events-none"
        style={{
          transform: `translateY(-50%) translateX(${isLoaded ? '0' : '100px'})`,
          opacity: isLoaded ? 1 : 0,
          transition: 'all 1200ms cubic-bezier(0.23, 1, 0.32, 1) 200ms',
          willChange: 'transform, opacity'
        }}
      >
        {products.map((p, i) => (
          <span
            key={p.name}
            className={`text-5xl md:text-7xl font-bold text-right ${current === i ? 'text-yellow-200' : 'text-white/70'}`}
            style={{ 
              fontFamily: 'var(--font-sf-pro)', 
              opacity: current === i ? 1 : 0.6,
              transform: current === i ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 800ms cubic-bezier(0.23, 1, 0.32, 1)',
              willChange: 'transform, opacity, color',
              textShadow: current === i ? '0 4px 20px rgba(255, 235, 59, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}
          >
            {p.name}
          </span>
        ))}
      </div>
      {/* Center bottom text */}
      <div className="absolute left-1/2 bottom-10 -translate-x-1/2 z-30 pointer-events-none">
        <span className="text-lg md:text-xl font-medium text-white drop-shadow-lg" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          30+ models in one canvas
        </span>
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
    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#333';
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

function DraggableNodesLayer({ onNodeAction }: { onNodeAction: (action: string) => void }) {
  // Node definitions
  // Clean, sophisticated layout under the title with proper spacing
  // Canvas area: starts below title (y=280) and spreads across viewport
  const canvasWidth = 1200;
  const canvasHeight = 500;
  const startX = 100;
  const startY = 280;
  
  const initialNodes = [
    // Top row - evenly spaced
    { id: 5, x: startX, y: startY, w: 180, h: 80, type: 'text', label: 'Text' }, // far left
    { id: 2, x: startX + 220, y: startY, w: 160, h: 80, type: 'lut', label: 'LUT' }, // left-center
    { id: 3, x: startX + 420, y: startY, w: 180, h: 120, type: 'image', label: 'Image' }, // center
    { id: 6, x: startX + 640, y: startY, w: 180, h: 120, type: 'image2', label: 'Image 2' }, // right-center
    
    // Bottom row - centered
    { id: 1, x: startX + 160, y: startY + 180, w: 240, h: 140, type: '3dimage', label: '3D' }, // bottom-left
    { id: 4, x: startX + 440, y: startY + 180, w: 240, h: 140, type: 'video', label: 'Video' }, // bottom-right
  ];
  const [nodes, setNodes] = React.useState(initialNodes);
  const [draggingId, setDraggingId] = React.useState<number | null>(null);
  const dragging = React.useRef<{ id: number | null; offsetX: number; offsetY: number }>({ id: null, offsetX: 0, offsetY: 0 });
  const liveNodes = React.useRef(nodes);
  React.useEffect(() => { liveNodes.current = nodes; }, [nodes]);

  // Connections: array of [fromId, toId] - clean flow from top to bottom
  const connections = [
    [5, 3], // Text -> Image (top row to top row)
    [2, 3], // LUT -> Image (top row to top row)
    [3, 6], // Image -> Image 2 (top row to top row)
    [6, 1], // Image 2 -> 3D (top row to bottom row)
    [6, 4], // Image 2 -> Video (top row to bottom row)
  ];

  // Y position constraint: nodes cannot be moved above this Y (below the heading)
  const minY = 250; // px, adjusted for clean spacing below the title

  // Store drag state in refs for smoothness
  const dragNodeRef = React.useRef<number | null>(null);
  const dragOffsetRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrame = React.useRef<number | null>(null);
  const isDragging = React.useRef(false);

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>, id: number) {
    e.preventDefault();
    const node = liveNodes.current.find(n => n.id === id);
    if (!node) return;
    
    dragNodeRef.current = id;
    dragOffsetRef.current = { x: e.clientX - node.x, y: e.clientY - node.y };
    isDragging.current = true;
    setDraggingId(id);
    
    // Add event listeners with passive: false for better performance
    window.addEventListener('mousemove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp, { passive: false });
    
    // Prevent text selection and other interactions
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none';
    e.currentTarget.style.pointerEvents = 'auto';
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging.current || dragNodeRef.current == null) return;
    
    e.preventDefault();
    const id = dragNodeRef.current;
    const offset = dragOffsetRef.current;
    let newY = e.clientY - offset.y;
    if (newY < minY) newY = minY;
    
    const newX = e.clientX - offset.x;
    
    // Update node position immediately in ref for ultra-smooth dragging
    liveNodes.current = liveNodes.current.map(n => 
      n.id === id ? { ...n, x: newX, y: newY } : n
    );
    
    // Cancel previous animation frame if it exists
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    
    // Use requestAnimationFrame for smooth 60fps updates
      animationFrame.current = requestAnimationFrame(() => {
      setNodes([...liveNodes.current]);
        animationFrame.current = null;
      });
    }

  function onMouseUp(e: MouseEvent) {
    if (!isDragging.current) return;

    e.preventDefault();
    dragNodeRef.current = null;
    isDragging.current = false;
    setDraggingId(null);
    
    // Clean up event listeners
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    
    // Restore body styles
    document.body.style.userSelect = '';
    document.body.style.pointerEvents = '';
    
    // Cancel any pending animation frame
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
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
          onClick={() => {
            // Only trigger for specific node labels
            if (node.label === '3D') onNodeAction('3d');
            else if (node.label === 'Image') onNodeAction('remove-background');
            else if (node.label === 'Image 2') onNodeAction('remove-background');
            else if (node.label === 'LUT') onNodeAction('level-rgb');
            else if (node.label === 'Video') onNodeAction('invert');
            // Add more mappings as needed
          }}
        >
          {/* Label above node */}
          <span className="mb-1 text-xs font-semibold text-white dark:text-white bg-black/60 dark:bg-black/80 px-2 py-0.5 rounded select-none" style={{ marginBottom: 2 }}>{node.label}</span>
          {/* Node content */}
          <div
            className={`w-full h-full bg-white/80 dark:bg-black/80 border border-gray-300 dark:border-gray-700 shadow-md flex items-center justify-center select-none cursor-move relative ${node.type === 'video' ? 'rounded-lg' : 'rounded-xl'}${draggingId === node.id ? ' shadow-2xl scale-105' : ''}`}
            style={{ pointerEvents: 'auto', transition: draggingId === node.id ? 'none' : 'transform 0.2s ease-out, box-shadow 0.2s ease-out' }}
          >
            {node.type === '3dimage' && (
              <div className="w-full h-full flex items-center justify-center">
                                  <Canvas camera={{ position: [0, 0, 2.5] }} className="w-full h-full rounded-xl">
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <React.Suspense fallback={
                    <mesh>
                      <boxGeometry args={[1, 1, 1]} />
                      <meshStandardMaterial color="gray" />
                    </mesh>
                  }>
                    <Model3D url="/images/girl3D.glb" />
                  </React.Suspense>
                  <OrbitControls enablePan={false} enableZoom={false} />
                </Canvas>
              </div>
            )}
            {node.type === 'image' && (
              <img src="/images/girlbnw.jpeg" alt="Girl B&W" className="w-full h-full object-cover rounded-xl" />
            )}
            {node.type === 'image2' && (
              <img src="/images/girl.png" alt="Girl" className="w-full h-full object-cover rounded-xl" />
            )}
            {node.type === 'lut' && (
              <img src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/Whisk_storyboardf6f725941f3d455ebcef84c1.png" alt="lut" className="w-full h-full object-cover rounded-xl" />
            )}
            {node.type === 'video' && (
              <video 
                src="/images/Can_you_show_202507060139.mp4" 
                className="w-full h-full object-cover rounded-lg" 
                autoPlay 
                loop 
                muted 
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            )}
            {node.type === 'text' && (
              <span className="text-gray-700 dark:text-gray-200 text-xs px-2 text-center leading-tight" style={{ fontFamily: 'var(--font-sf-pro)' }}>A black and white photo of a girl looking straight with her hair tied back.</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// 3D Model loader component
function Model3D({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const ref = useRef<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Update rotation based on mouse position
  React.useEffect(() => {
    const handleMouseMove = () => {
      const canvas = document.querySelector('canvas');
      if (canvas && (canvas as any).mouseX !== undefined) {
        setMousePos({
          x: (canvas as any).mouseX || 0,
          y: (canvas as any).mouseY || 0
        });
      }
    };

    const interval = setInterval(handleMouseMove, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  // Apply rotation to the model
  React.useEffect(() => {
    if (ref.current) {
      ref.current.rotation.y = mousePos.x * 0.5; // Horizontal rotation
      ref.current.rotation.x = mousePos.y * 0.3; // Vertical rotation
    }
  }, [mousePos]);

  return <primitive object={gltf.scene} ref={ref} scale={1.5} position={[0, 0, 0]} />;
}

// Preload the 3D model
useGLTF.preload('/images/top3D.glb');

// Overlay for loading/error - simplified since useGLTF handles loading states
function Model3DOverlay({ url }: { url: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="text-white bg-black/80 px-4 py-2 rounded-2xl">Loading 3D…</div>
    </div>
  );
}

function InteractiveTiltImage({ src, alt }: { src: string, alt: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    // Map x/y to full 360deg rotation
    setTilt({ x: x * 180, y: y * 180 });
  }
  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }
  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        height: '100%',
        perspective: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`,
          transition: 'transform 0.2s cubic-bezier(.25,.8,.25,1)',
        }}
      />
    </div>
  );
} 