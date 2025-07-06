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
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sf-pro">
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
        <section className="w-screen h-screen relative overflow-hidden flex items-stretch scroll-snap-section" id="explore">
          <ProductsScrollSectionStudio />
        </section>

        {/* Section: With all the professional tools you rely on */}
        <section className="w-screen min-h-[50vh] py-20 flex flex-col items-center justify-center bg-black">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            All the Tools You Trust. Now in One Flow.
          </h2>
          <p className="text-lg md:text-xl font-light mb-8 text-center text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            From cropping to relighting, every pro feature you need—streamlined in a single creative pipeline.
          </p>
          <div className="w-full flex flex-col items-center justify-center">
            <span className="text-base md:text-lg font-medium text-center text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
              Includes: Invert · Outpaint · Crop · Inpaint · Mask Extractor · Upscale · Z-Depth · Image Describer · Channels · Painter · Relight
            </span>
          </div>
        </section>

        {/* Section: Control the Outcome */}
        <section className="w-screen min-h-[60vh] pt-20 pb-0 flex flex-col items-center justify-center bg-black" style={{ marginBottom: 0, paddingBottom: 0 }}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            Precision, Composed.
          </h2>
          <p className="text-lg md:text-xl font-light mb-8 text-center max-w-2xl text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            Master layers, text, and blending with absolute control.<br />
            Your ideas, rendered exactly as imagined.
          </p>
          <div className="relative w-full max-w-3xl h-80 flex items-center justify-center mb-6">
            {/* Placeholder for layered composition visual */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Stack of semi-transparent cards */}
              <div className="absolute left-8 top-8 w-56 h-32 bg-gray-800 rounded-xl shadow-lg opacity-70" />
              <div className="absolute left-16 top-16 w-56 h-32 bg-gray-700 rounded-xl shadow-lg opacity-80" />
              <div className="absolute left-24 top-24 w-56 h-32 bg-gray-600 rounded-xl shadow-lg opacity-90" />
              <div className="relative w-56 h-32 bg-gray-900 rounded-xl shadow-xl border-2 border-white flex items-center justify-center text-lg font-bold text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                {/* TODO: Replace with animated stack or Lottie */}
                Layered Visual Placeholder
              </div>
            </div>
          </div>
          <p className="text-base font-light text-center text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            Maximize your team ability, by automatically generating a simplified UI
          </p>
        </section>
        <IdeasScrollNodesSection />
      </main>
    </div>
  )
}

function ProductsScrollSectionStudio() {
  const products = [
    { name: 'GPT', videoSrc: 'https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/person1.mp4', description: 'GPT is the world-leading generative AI for text, code, and more.' },
    { name: 'Runway Gen-4', videoSrc: 'https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/person3.mp4', description: 'Runway Gen-4 brings next-gen video and image generation to creators.' },
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
    
    // If scrolling up and we're at the first item (GPT), allow page scroll  
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

function DraggableNodesLayer() {
  // Node definitions
  const initialNodes = [
    { id: 1, x: 120, y: 220, w: 110, h: 110, type: 'image', label: '3D' }, // small square
    { id: 2, x: 120, y: 370, w: 260, h: 90, type: 'lut', label: 'LUT' }, // wide rectangle, now LUT
    { id: 3, x: 420, y: 220, w: 220, h: 300, type: 'image', label: 'Image' }, // large portrait
    { id: 4, x: 700, y: 220, w: 300, h: 180, type: 'video', label: 'Video' }, // large landscape
    { id: 5, x: 340, y: 320, w: 200, h: 60, type: 'text', label: 'Text' }, // moved further down
  ];
  const [nodes, setNodes] = React.useState(initialNodes);
  const [draggingId, setDraggingId] = React.useState<number | null>(null);
  const dragging = React.useRef<{ id: number | null; offsetX: number; offsetY: number }>({ id: null, offsetX: 0, offsetY: 0 });
  const liveNodes = React.useRef(nodes);
  React.useEffect(() => { liveNodes.current = nodes; }, [nodes]);

  // Connections: array of [fromId, toId]
  const connections = [
    [2, 5], // video -> output
    [3, 2], // text -> video
    [3, 4], // image -> video (new)
    [2, 1], // lut -> 3D (new)
  ];

  // Y position constraint: nodes cannot be moved above this Y (below the heading)
  const minY = 180; // px, adjust as needed for your heading height

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
        >
          {/* Label above node */}
          <span className="mb-1 text-xs font-semibold text-white dark:text-white bg-black/60 dark:bg-black/80 px-2 py-0.5 rounded select-none" style={{ marginBottom: 2 }}>{node.label}</span>
          {/* Node content */}
          <div
            className={`w-full h-full bg-white/80 dark:bg-black/80 border border-gray-300 dark:border-gray-700 shadow-md flex items-center justify-center select-none cursor-move relative ${node.type === 'video' ? 'rounded-lg' : 'rounded-xl'}${draggingId === node.id ? ' shadow-2xl scale-105' : ''}`}
            style={{ pointerEvents: 'auto', transition: draggingId === node.id ? 'none' : 'transform 0.2s ease-out, box-shadow 0.2s ease-out' }}
          >
            {node.type === 'image' && (
              <img src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/Gemini_Generated_Image_gyykvsgyykvsgyyk.png" alt="img" className="w-full h-full object-cover rounded-xl" />
            )}
            {node.type === 'lut' && (
              <img src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/Whisk_storyboardf6f725941f3d455ebcef84c1.png" alt="lut" className="w-full h-full object-cover rounded-xl" />
            )}
            {node.type === 'video' && (
              <video 
                src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/colour.mp4" 
                className="w-full h-full object-cover rounded-lg" 
                autoPlay 
                loop 
                muted 
                playsInline
              >
                Your browser does not support the video tag or /images/colour.mp4 is missing.
              </video>
            )}
            {node.type === 'text' && (
              <span className="text-gray-700 dark:text-gray-200 text-sm px-2">Greyscale</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 