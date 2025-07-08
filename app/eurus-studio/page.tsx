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
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, Environment, useGLTF } from '@react-three/drei';

// Ideas Scroll Section Component - inline to integrate with main page
function IdeasScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [focusedSection, setFocusedSection] = useState(0); // 0 = Inspire, 1 = Refine, 2 = Craft
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [hasCompletedSequence, setHasCompletedSequence] = useState(false);
  const [wheelAccumulator, setWheelAccumulator] = useState(0);
  const isTransitioning = useRef(false);
  const touchStartY = useRef(0);
  const touchAccumulator = useRef(0);

  useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      
      // Check if section is in viewport
      const isInViewport = sectionTop < windowHeight && sectionBottom > 0;
      
      // Only lock when section is centered and user hasn't completed sequence
      const isCentered = sectionTop <= 100 && sectionBottom >= windowHeight - 100;
      
      if (isCentered && !hasCompletedSequence) {
        setIsScrollLocked(true);
      } else {
        setIsScrollLocked(false);
        
        // Reset sequence if we've scrolled away from the section
        if (!isInViewport && hasCompletedSequence) {
          setHasCompletedSequence(false);
          setFocusedSection(0);
        }
      }
    }

    function handleTransition(direction: number) {
      if (direction > 0) {
        // Scrolling down
        if (focusedSection < 2) {
          isTransitioning.current = true;
          setFocusedSection(prev => prev + 1);
          
          setTimeout(() => {
            isTransitioning.current = false;
          }, 700);
        } else if (focusedSection === 2) {
          // At Craft - complete sequence and allow normal scrolling
          setHasCompletedSequence(true);
          setIsScrollLocked(false);
        }
      } else {
        // Scrolling up
        if (focusedSection > 0) {
          isTransitioning.current = true;
          setFocusedSection(prev => prev - 1);
          
          setTimeout(() => {
            isTransitioning.current = false;
          }, 700);
        }
      }
    }

    function onWheel(e: WheelEvent) {
      if (!sectionRef.current || !isScrollLocked) return;
      
      // Only hijack scroll when section is properly centered
      const rect = sectionRef.current.getBoundingClientRect();
      const isCentered = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
      
      if (!isCentered) return;
      
      // Prevent default scrolling when section is locked and centered
      e.preventDefault();
      e.stopPropagation();
      
      // Don't process wheel events during transitions
      if (isTransitioning.current) return;
      
      // Accumulate wheel delta for more precise control
      const newAccumulator = wheelAccumulator + e.deltaY;
      setWheelAccumulator(newAccumulator);
      
      // Threshold for triggering transitions
      const threshold = 80;
      
      if (Math.abs(newAccumulator) > threshold) {
        const direction = newAccumulator > 0 ? 1 : -1;
        setWheelAccumulator(0);
        handleTransition(direction);
      }
    }

    function onTouchStart(e: TouchEvent) {
      if (!sectionRef.current || !isScrollLocked) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isCentered = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
      
      if (!isCentered) return;
      
      touchStartY.current = e.touches[0].clientY;
      touchAccumulator.current = 0;
    }

    function onTouchMove(e: TouchEvent) {
      if (!sectionRef.current || !isScrollLocked) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isCentered = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
      
      if (!isCentered) return;
      
      // Prevent default scrolling when section is locked and centered
      e.preventDefault();
      e.stopPropagation();
      
      // Don't process touch events during transitions
      if (isTransitioning.current) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;
      touchAccumulator.current += deltaY;
      touchStartY.current = currentY;
      
      // Threshold for triggering transitions on touch
      const threshold = 40;
      
      if (Math.abs(touchAccumulator.current) > threshold) {
        const direction = touchAccumulator.current > 0 ? 1 : -1;
        touchAccumulator.current = 0;
        handleTransition(direction);
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (!sectionRef.current || !isScrollLocked) return;
      touchAccumulator.current = 0;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!sectionRef.current || !isScrollLocked) return;
      
      // Don't process key events during transitions
      if (isTransitioning.current) return;
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleTransition(1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleTransition(-1);
      }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    onScroll();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isScrollLocked, hasCompletedSequence, wheelAccumulator, focusedSection]);

  const sections = [
    {
      id: 0,
      title: "Inspire",
      image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman1.png",
      alt: "Old Man 1",
      isVideo: false
    },
    {
      id: 1,
      title: "Refine",
      image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman2.jpg",
      alt: "Old Man 2",
      isVideo: false
    },
    {
      id: 2,
      title: "Craft",
      image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman3.mp4",
      alt: "Old Man 3",
      isVideo: true
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="w-screen bg-black flex flex-col items-center justify-center p-0 m-0 relative"
      style={{ minHeight: '100vh', padding: '2rem 0', margin: 0 }}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 sm:mb-8 md:mb-10 leading-tight text-center" style={{ fontFamily: 'var(--font-sf-pro)' }}>
        Ideas don't wait. Neither should you.
      </h2>
      <div className="relative w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 h-auto sm:h-[60vh] px-4 sm:px-6 md:px-8">
        {sections.map((section, idx) => (
          <div 
            key={section.id}
            className="transition-all duration-700 ease-in-out flex flex-col items-center mb-6 sm:mb-0" 
            style={{ 
              opacity: focusedSection === idx ? 1 : 0.4,
              transform: focusedSection === idx ? 'scale(1.05)' : 'scale(0.95)',
              filter: focusedSection === idx ? 'brightness(1.1)' : 'brightness(0.7)'
            }}
          >
            <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center">
              {section.isVideo ? (
                <video
                  src={section.image}
                  className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
                  style={{
                    borderColor: focusedSection === idx ? '#fbbf24' : '#ffffff',
                    borderWidth: focusedSection === idx ? '4px' : '2px',
                    boxShadow: focusedSection === idx 
                      ? '0 25px 50px -12px rgba(251, 191, 36, 0.5)' 
                      : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={section.image}
                  alt={section.alt}
                  className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
                  style={{
                    borderColor: focusedSection === idx ? '#fbbf24' : '#ffffff',
                    borderWidth: focusedSection === idx ? '4px' : '2px',
                    boxShadow: focusedSection === idx 
                      ? '0 25px 50px -12px rgba(251, 191, 36, 0.5)' 
                      : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                />
              )}
            </div>
            <span 
              className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-semibold transition-all duration-500"
              style={{
                color: focusedSection === idx ? '#fbbf24' : '#ffffff90',
                fontSize: focusedSection === idx ? 'clamp(1.1rem, 2.5vw, 1.25rem)' : 'clamp(1rem, 2vw, 1.125rem)',
                fontWeight: focusedSection === idx ? '700' : '600'
              }}
            >
              {section.title}
            </span>
          </div>
        ))}
      </div>
        </section>
  );
}

export default function EurusStudioPage() {
  const toolImages = [
    { label: 'Video', image: '/videos/topvideofinal.mp4', isVideo: true },
    { label: 'Image', image: '/images/topcrop.png' },
    { label: 'Extend', image: '/images/topbg.jpeg' },
    { label: 'Invert', image: '/images/topinvert.png' },
    { label: 'Image Describer', image: '/images/topbg.jpeg', hasTextOverlay: true },
    { label: 'Paint', image: '/images/topblue.png' },
    { label: 'Depth Extractor', image: '/images/topz.png' },
    { label: '3D', image: '/images/top3D.glb', is3D: true },
    { label: 'LUT', image: '/images/toplut.jpeg' },
  ];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [activeImage, setActiveImage] = useState('/videos/topvideofinal.mp4');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [scrollAccumulator, setScrollAccumulator] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
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
        {/* Hero Section: Artistic Intelligence - Mobile Optimized */}
        <section className="w-screen min-h-screen flex flex-col items-center justify-start pt-6 sm:pt-8 md:pt-12 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden" style={{ minHeight: '100vh' }}>
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
          {/* Top-centered heading and subtitle - Mobile Responsive */}
          <div className="relative z-10 flex flex-col items-center justify-start w-full pt-4 sm:pt-6 md:pt-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-3 sm:mb-4 md:mb-6 text-center text-black dark:text-white px-2" style={{ fontFamily: 'var(--font-sf-pro)' }}>
              Irreplacably Creative
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mb-6 sm:mb-8 text-center text-black dark:text-white px-4" style={{ fontFamily: 'var(--font-sf-pro)' }}>
              All your favorite AI models. All your favorite tools. One seamless canvas.<br className="hidden sm:block" />
              <span className="block sm:inline">Design, edit, and build with cinematic precision</span>
            </p>
          </div>
        </section>

        {/* Section: Every Model. Perfectly In Sync. */}
        <section className="w-screen h-screen relative overflow-hidden flex items-stretch scroll-snap-section" id="explore">
          <ProductsScrollSectionStudioLanding />
        </section>

        {/* Section: With all the professional tools you rely on - Grid View */}
        <section className="w-screen h-screen bg-black font-sf-pro relative" style={{ fontFamily: 'Inter, SF Pro, sans-serif' }}>
          <div className="w-full h-full flex flex-col justify-center p-2">
            {/* Title text overlay - TOP CENTER */}
            <div className="text-center mb-3 z-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-1 leading-tight text-white" style={{ letterSpacing: '-0.01em', fontFamily: 'var(--font-sf-pro)' }}>
                All the tools you trust.<br />Now in one flow.
              </h2>
              <p className="text-sm sm:text-base md:text-lg font-light text-white/90" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                From cropping to relighting—designed for flow.
              </p>
            </div>

            {/* Grid Layout */}
            <div className="w-full h-[65vh] grid grid-cols-4 grid-rows-3 gap-1 relative">
              {/* Center large video area - spans 2x2 */}
              <div className="col-start-2 col-span-2 row-start-1 row-span-2 relative">
                <div 
                  className="w-full h-full bg-gray-900 rounded-lg overflow-hidden border-2 border-white/20 cursor-pointer transition-all duration-300 hover:border-white/40 hover:shadow-2xl hover:shadow-white/20"
                  onClick={() => {
                    setModalContent(toolImages[currentImageIdx]);
                    setShowModal(true);
                  }}
                >
                  {toolImages[currentImageIdx].is3D ? (
                    <div className="w-full h-full">
                      <Canvas 
                        camera={{ 
                          position: [0, 0, 2.8],
                          fov: 50
                        }} 
                        className="w-full h-full" 
                        style={{ background: '#111' }}
                      >
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[2, 4, 2]} intensity={1.5} castShadow />
                        <Environment preset="city" />
                        <Model3D url={activeImage} />
                        <OrbitControls 
                          enableZoom={false}
                          enablePan={false}
                          enableRotate={true}
                          autoRotate={false}
                          rotateSpeed={1}
                          target={[0, 0, 0]}
                        />
                      </Canvas>
                    </div>
                  ) : toolImages[currentImageIdx].isVideo ? (
                    <div className="w-full h-full relative bg-gray-900 flex items-center justify-center">
                      <video
                        key={activeImage}
                        src={activeImage}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        onLoadedData={() => {
                          console.log('Video loaded successfully:', activeImage);
                          setImageLoaded(true);
                        }}
                        onError={(e) => {
                          console.error('Video failed to load:', activeImage, e);
                          setImageLoaded(true);
                        }}
                        onLoadStart={() => {
                          console.log('Video loading started:', activeImage);
                        }}
                        onCanPlay={() => {
                          console.log('Video can start playing:', activeImage);
                        }}
                      />

                    </div>
                  ) : (
                    <img
                      key={activeImage}
                      src={activeImage}
                      alt={toolImages[currentImageIdx].label}
                      className="w-full h-full object-cover"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                    />
                  )}
                </div>
                {/* Tool name overlay for center */}
                <div className="absolute bottom-4 left-4 z-10">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                    {toolImages[currentImageIdx].label}
                  </h3>
                </div>
              </div>

              {/* Grid items around the center */}
              {toolImages.map((tool, idx) => {
                // Skip the currently selected tool as it's shown in center
                if (idx === currentImageIdx) return null;
                
                // Calculate grid position
                let gridClass = '';
                if (idx === 0) gridClass = 'col-start-1 row-start-1';
                else if (idx === 1) gridClass = 'col-start-4 row-start-1';
                else if (idx === 2) gridClass = 'col-start-1 row-start-2';
                else if (idx === 3) gridClass = 'col-start-4 row-start-2';
                else if (idx === 4) gridClass = 'col-start-1 row-start-3';
                else if (idx === 5) gridClass = 'col-start-2 row-start-3';
                else if (idx === 6) gridClass = 'col-start-3 row-start-3';
                else if (idx === 7) gridClass = 'col-start-4 row-start-3';

                return (
                  <div
                    key={idx}
                    className={`${gridClass} cursor-pointer transition-all duration-300 hover:z-10`}
                    onClick={() => {
                      setCurrentImageIdx(idx);
                      setActiveImage(tool.image);
                      setImageLoaded(true);
                    }}
                  >
                    <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden border border-white/10 hover:border-white/50 hover:shadow-2xl hover:shadow-white/20 relative transition-all duration-300">
                      {tool.is3D ? (
                        <div className="w-full h-full bg-gray-700 relative">
                          <Canvas 
                            camera={{ 
                              position: [0, 0, 2.8],
                              fov: 50
                            }} 
                            className="w-full h-full" 
                            style={{ background: '#374151' }}
                          >
                            <ambientLight intensity={0.8} />
                            <directionalLight position={[2, 4, 2]} intensity={1} />
                            <Model3D url={tool.image} />
                          </Canvas>
                        </div>
                      ) : tool.isVideo ? (
                        <video
                          src={tool.image}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={tool.image}
                          alt={tool.label}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Tool name overlay */}
                      <div className="absolute bottom-2 left-2">
                        <span className="text-xs font-medium text-white drop-shadow-lg" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                          {tool.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Modal Overlay */}
          {showModal && modalContent && (
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <div 
                className="bg-black rounded-lg overflow-hidden relative border border-white/20"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: modalContent.isVideo || !modalContent.is3D ? 'auto' : '800px',
                  maxWidth: '90vw',
                  maxHeight: '90vh'
                }}
              >
                {/* Close button */}
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl z-10 bg-black/50 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
                
                {/* Modal content */}
                <div className="relative">
                  {modalContent.is3D ? (
                    <div style={{ width: '800px', height: '600px' }}>
                      <Canvas 
                        camera={{ 
                          position: [0, 0, 2.8],
                          fov: 50
                        }} 
                        className="w-full h-full" 
                        style={{ background: '#000' }}
                      >
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[2, 4, 2]} intensity={1.5} castShadow />
                        <Environment preset="city" />
                        <Model3D url={modalContent.image} />
                        <OrbitControls 
                          enableZoom={true}
                          enablePan={true}
                          enableRotate={true}
                          autoRotate={false}
                          rotateSpeed={1}
                          target={[0, 0, 0]}
                        />
                      </Canvas>
                    </div>
                  ) : modalContent.isVideo ? (
                    <video
                      src={modalContent.image}
                      className="block"
                      style={{ maxWidth: '90vw', maxHeight: '90vh', width: 'auto', height: 'auto' }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                    />
                  ) : (
                    <img
                      src={modalContent.image}
                      alt={modalContent.label}
                      className="block"
                      style={{ maxWidth: '90vw', maxHeight: '90vh', width: 'auto', height: 'auto' }}
                    />
                  )}
                </div>
                
                {/* Tool info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                    {modalContent.label}
                  </h3>
                  {modalContent.hasTextOverlay && (
                    <p className="text-sm text-white/80 leading-relaxed" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                      The image shows a beautifully crafted wooden spinning top placed upright on a flat, textured surface.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Section: Ideas don't wait. Neither should you. - Scroll-hijacking section */}
        <IdeasScrollSection />
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
      {/* Overlayed static heading on top of image - Mobile Responsive */}
      <div 
        className="absolute left-4 sm:left-6 md:left-8 lg:left-10 top-1/2 -translate-y-1/2 z-20 max-w-[60%] sm:max-w-none" 
        style={{ 
          pointerEvents: 'none',
          transform: `translateY(-50%) translateX(${isLoaded ? '0' : '-100px'})`,
          opacity: isLoaded ? 1 : 0,
          transition: 'all 1200ms cubic-bezier(0.23, 1, 0.32, 1)',
          willChange: 'transform, opacity'
        }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg leading-tight" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          Every Model.<br />One Platform.
        </h2>
      </div>
      {/* Overlayed product name list, always visible - Mobile Responsive */}
      <div 
        className="absolute right-4 sm:right-6 md:right-8 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1 sm:gap-2 md:gap-3 z-20 pointer-events-none max-w-[35%] sm:max-w-none"
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
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-right ${current === i ? 'text-yellow-200' : 'text-white/70'}`}
            style={{ 
              fontFamily: 'var(--font-sf-pro)', 
              opacity: current === i ? 1 : 0.6,
              transform: current === i ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 800ms cubic-bezier(0.23, 1, 0.32, 1)',
              willChange: 'transform, opacity, color',
              textShadow: current === i ? '0 4px 20px rgba(255, 235, 59, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.5)',
              fontSize: 'clamp(1.2rem, 4vw, 4rem)'
            }}
          >
            {p.name}
          </span>
        ))}
      </div>
      {/* Center bottom text - Mobile Responsive */}
      <div className="absolute left-1/2 bottom-6 sm:bottom-8 md:bottom-10 -translate-x-1/2 z-30 pointer-events-none">
        <span className="text-base sm:text-lg md:text-xl font-medium text-white drop-shadow-lg px-4 text-center" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          30+ models in one canvas
        </span>
      </div>
    </div>
  );
}

// New scroll section similar to the one from the main Eurus Labs page
function ProductsScrollSectionStudioLanding() {
  const products = [
    {
      name: "Eleven Labs",
      videoSrc: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/person1.mp4",
      description: "Eleven Labs is the world-leading generative AI for voice synthesis and audio.",
      link: "https://elevenlabs.io/",
    },
    {
      name: "Rodin",
      videoSrc: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/person3.mp4",
      description: "Rodin brings next-gen 3D generation and modeling to creators.",
      link: "https://rodin.ai/",
    },
    {
      name: "Veo 3",
      videoSrc: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/peron2.mp4",
      description: "Veo 3 is a powerful AI for video understanding and creative editing.",
      link: "https://deepmind.google/technologies/veo/",
    },
    {
      name: "Kling",
      videoSrc: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/person4.mp4",
      description: "Kling enables advanced audio and speech synthesis for your projects.",
      link: "https://kling.kuaishou.com/",
    },
    {
      name: "Luma ray 2",
      videoSrc: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/peron5.mp4",
      description: "Luma ray 2 delivers photorealistic 3D and lighting effects with AI.",
      link: "https://lumalabs.ai/",
    },
  ]

  const [current, setCurrent] = React.useState(0)
  const [isFullyVisible, setIsFullyVisible] = React.useState(false)
  const [hasStartedScrolling, setHasStartedScrolling] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isScrollingRef = React.useRef(false)
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const isReleasingScrollRef = React.useRef(false)

  // Scroll direction tracking for intelligent snapping
  const [scrollDirection, setScrollDirection] = React.useState<"up" | "down">("down")
  const lastScrollY = React.useRef(0)

  // Track scroll direction
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down")
      } else {
        setScrollDirection("up")
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Effect to lock and unlock body scroll
  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow
    if (isFullyVisible && !isReleasingScrollRef.current) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = originalOverflow
    }
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isFullyVisible])

  // Simplified and smooth wheel handler
  const handleGlobalWheel = React.useCallback(
    (e: WheelEvent) => {
      // If we're releasing scroll, don't interfere
      if (isReleasingScrollRef.current) {
        return
      }

      // Prevent any scrolling if we're currently transitioning
      if (isScrollingRef.current) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      // Always prevent default page scrolling when in this section
      e.preventDefault()
      e.stopPropagation()

      const direction = e.deltaY > 0 ? 1 : -1
      const newIndex = current + direction

      // Handle boundary conditions
      if (newIndex < 0) {
        // Scroll up from first product: allow page scroll to previous section
        isReleasingScrollRef.current = true
        setIsFullyVisible(false)
        document.body.style.overflow = ""
        
        setTimeout(() => {
          isReleasingScrollRef.current = false
        }, 1000)
        return
      }

      if (newIndex >= products.length) {
        // Scroll down from last product: allow page scroll to next section
        isReleasingScrollRef.current = true
        setIsFullyVisible(false)
        document.body.style.overflow = ""
        
        setTimeout(() => {
          isReleasingScrollRef.current = false
        }, 1000)
        return
      }

      // Valid internal navigation
      if (newIndex >= 0 && newIndex < products.length && newIndex !== current) {
        isScrollingRef.current = true
        setCurrent(newIndex)

        if (current === 0 && direction > 0) {
          setHasStartedScrolling(true)
        }

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }

        // Reset scrolling flag after animation - longer timeout for smoother experience
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false
        }, 800) // Longer timeout to prevent rapid scrolling
      }
    },
    [current, products.length],
  )

  // Intersection Observer to detect when the component is in view and auto-snap
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersectionRatio = entry.intersectionRatio
        const isIntersecting = entry.isIntersecting

        // Reset to first product when section first becomes visible
        if (isIntersecting && intersectionRatio > 0.1 && !isFullyVisible) {
          setCurrent(0)
          setHasStartedScrolling(false)
        }

        // Auto-snap to full view when 50% visible
        if (
          isIntersecting &&
          intersectionRatio >= 0.5 &&
          intersectionRatio < 0.95 &&
          !isFullyVisible &&
          !isReleasingScrollRef.current
        ) {
          // Smooth scroll to make the section fully visible
          containerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })

          // Always start with first product when coming from above (tools section)
          setCurrent(0)
          setHasStartedScrolling(false)
          return
        }

        // Set fully visible when 95% or more is visible
        if (
          intersectionRatio >= 0.95 &&
          !isFullyVisible &&
          !isReleasingScrollRef.current
        ) {
          setIsFullyVisible(true)
          // ALWAYS ensure we start with first product when becoming fully visible from any direction
          setCurrent(0)
          setHasStartedScrolling(false)
        } else if (intersectionRatio < 0.3 && isFullyVisible) {
          // Only reset if we're actually leaving the section (less than 30% visible)
          setTimeout(() => {
            if (
              !containerRef.current ||
              containerRef.current.getBoundingClientRect().top > window.innerHeight ||
              containerRef.current.getBoundingClientRect().bottom < 0
            ) {
              setIsFullyVisible(false)
              setCurrent(0)
              setHasStartedScrolling(false)
              isReleasingScrollRef.current = false
            }
          }, 100)
        }
      },
      {
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95], // Multiple thresholds for precise detection
      },
    )

    const currentRef = containerRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [isFullyVisible, scrollDirection, current])

  // Add/remove the wheel event listener based on visibility
  React.useEffect(() => {
    if (isFullyVisible && !isReleasingScrollRef.current) {
      window.addEventListener("wheel", handleGlobalWheel, { passive: false })
    }
    return () => {
      window.removeEventListener("wheel", handleGlobalWheel)
    }
  }, [isFullyVisible, handleGlobalWheel])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      // Reset all scroll-related refs
      isReleasingScrollRef.current = false
    }
  }, [])

  return (
    <div ref={containerRef} id="products-scroll-viewport-studio-landing" className="w-full h-screen relative overflow-hidden scroll-snap-section">
      {/* Video backgrounds for each product */}
      {products.map((product, idx) => (
        <video
          key={product.name}
          src={product.videoSrc}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out z-0 ${
            current === idx ? "opacity-100" : "opacity-0"
          }`}
          style={{ pointerEvents: "none" }}
          autoPlay
          loop
          muted
          playsInline
        />
      ))}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
      
      {/* Left side text overlay */}
      <div className="absolute left-4 sm:left-6 md:left-8 lg:left-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none max-w-[60%] sm:max-w-none">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg leading-tight mb-4" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          Every Model.<br />One Platform.
        </h2>
        <p className="text-sm sm:text-base md:text-lg font-medium text-white/80 drop-shadow-md" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          30+ models in one canvas
        </p>
      </div>

      {/* Right side product names */}
      <div className="absolute right-4 sm:right-6 md:right-8 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1 sm:gap-2 md:gap-3 z-20 pointer-events-none max-w-[35%] sm:max-w-none">
        {products.map((p, i) => (
          <span
            key={p.name}
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-right transition-all duration-300 ${
              current === i ? "text-yellow-200" : "text-white/80"
            }`}
            style={{ 
              fontFamily: "var(--font-sf-pro)", 
              opacity: current === i ? 1 : 0.7,
              transform: current === i ? 'scale(1.05)' : 'scale(1)',
              textShadow: current === i ? '0 4px 20px rgba(255, 235, 59, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            {p.name}
          </span>
        ))}
      </div>
      

    </div>
  )
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
  const smallOrbitControlsRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Hydration-safe mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Mobile-responsive node definitions
  const getResponsiveLayout = () => {
    if (!isMounted) return { nodes: [], canvasWidth: 1200, canvasHeight: 500 };
    
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    const isDesktop = window.innerWidth >= 1024;
    
    if (isMobile) {
      // Mobile: Smaller nodes, vertical layout - increased by 20% again
      const startX = 20;
      const startY = 200;
      const nodeWidth = 191; // 159 * 1.20 (20% increase)
      const nodeHeight = 95; // 79 * 1.20 (20% increase)
      
      return {
        canvasWidth: window.innerWidth - 40,
        canvasHeight: 600,
        nodes: [
          { id: 5, x: startX, y: startY, w: nodeWidth + 31, h: nodeHeight, type: 'text', label: 'Text' }, // 26 * 1.20 = 31
          { id: 2, x: startX + nodeWidth + 64, y: startY, w: nodeWidth, h: nodeHeight, type: 'lut', label: 'LUT' }, // 53 * 1.20 = 64
          { id: 3, x: startX + 48, y: startY + 100, w: nodeWidth, h: nodeHeight + 31, type: 'image', label: 'Image' }, // 40 * 1.20 = 48, 26 * 1.20 = 31
          { id: 6, x: startX + nodeWidth + 80, y: startY + 100, w: nodeWidth, h: nodeHeight + 31, type: 'image2', label: 'Image 2' }, // 67 * 1.20 = 80
          { id: 1, x: startX + 31, y: startY + 220, w: nodeWidth + 31, h: nodeHeight + 64, type: '3dimage', label: '3D' }, // 26 * 1.20 = 31, 53 * 1.20 = 64
          { id: 4, x: startX + nodeWidth + 95, y: startY + 220, w: nodeWidth + 31, h: nodeHeight + 64, type: 'video', label: 'Video' }, // 79 * 1.20 = 95
        ]
      };
    } else if (isTablet) {
      // Tablet: Medium-sized nodes - increased by 20% again
      const startX = 60;
      const startY = 220;
      const nodeWidth = 222; // 185 * 1.20 (20% increase)
      const nodeHeight = 112; // 93 * 1.20 (20% increase)
      
      return {
        canvasWidth: window.innerWidth - 120,
        canvasHeight: 500,
        nodes: [
          { id: 5, x: startX, y: startY, w: nodeWidth + 31, h: nodeHeight, type: 'text', label: 'Text' }, // 26 * 1.20 = 31
          { id: 2, x: startX + 286, y: startY, w: nodeWidth, h: nodeHeight, type: 'lut', label: 'LUT' }, // 238 * 1.20 = 286
          { id: 3, x: startX + 540, y: startY, w: nodeWidth, h: nodeHeight + 31, type: 'image', label: 'Image' }, // 450 * 1.20 = 540, 26 * 1.20 = 31
          { id: 6, x: startX + 793, y: startY, w: nodeWidth, h: nodeHeight + 31, type: 'image2', label: 'Image 2' }, // 661 * 1.20 = 793
          { id: 1, x: startX + 191, y: startY + 239, w: nodeWidth + 64, h: nodeHeight + 80, type: '3dimage', label: '3D' }, // 159 * 1.20 = 191, 199 * 1.20 = 239, 53 * 1.20 = 64, 67 * 1.20 = 80
          { id: 4, x: startX + 508, y: startY + 239, w: nodeWidth + 64, h: nodeHeight + 80, type: 'video', label: 'Video' }, // 423 * 1.20 = 508
        ]
      };
    } else {
      // Desktop: Original large nodes - increased by 20% again
      const startX = 100;
      const startY = 280;
      
      return {
        canvasWidth: 1200,
        canvasHeight: 500,
        nodes: [
          { id: 5, x: startX, y: startY, w: 286, h: 127, type: 'text', label: 'Text' }, // 238 * 1.20 = 286, 106 * 1.20 = 127
          { id: 2, x: startX + 349, y: startY, w: 254, h: 127, type: 'lut', label: 'LUT' }, // 291 * 1.20 = 349, 212 * 1.20 = 254
          { id: 3, x: startX + 666, y: startY, w: 286, h: 191, type: 'image', label: 'Image' }, // 555 * 1.20 = 666, 238 * 1.20 = 286, 159 * 1.20 = 191
          { id: 6, x: startX + 1016, y: startY, w: 286, h: 191, type: 'image2', label: 'Image 2' }, // 847 * 1.20 = 1016
          { id: 1, x: startX + 254, y: startY + 286, w: 380, h: 222, type: '3dimage', label: '3D' }, // 212 * 1.20 = 254, 238 * 1.20 = 286, 317 * 1.20 = 380, 185 * 1.20 = 222
          { id: 4, x: startX + 698, y: startY + 286, w: 380, h: 222, type: 'video', label: 'Video' }, // 582 * 1.20 = 698
        ]
      };
    }
  };
  
  const { nodes: initialNodes, canvasWidth, canvasHeight } = getResponsiveLayout();
  const [nodes, setNodes] = React.useState(initialNodes);
  const [draggingId, setDraggingId] = React.useState<number | null>(null);
  const dragging = React.useRef<{ id: number | null; offsetX: number; offsetY: number }>({ id: null, offsetX: 0, offsetY: 0 });
  const liveNodes = React.useRef(nodes);
  React.useEffect(() => { liveNodes.current = nodes; }, [nodes]);

  // Update nodes when component mounts
  React.useEffect(() => {
    if (isMounted) {
      const { nodes: newNodes } = getResponsiveLayout();
      setNodes(newNodes);
    }
  }, [isMounted]);

  // Update layout on window resize
  React.useEffect(() => {
    const handleResize = () => {
      if (!isDragging.current) {
        const { nodes: newNodes } = getResponsiveLayout();
        setNodes(newNodes);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Touch event handlers
  function onTouchStart(e: React.TouchEvent<HTMLDivElement>, id: number) {
    e.preventDefault();
    const touch = e.touches[0];
    const node = liveNodes.current.find(n => n.id === id);
    if (!node) return;
    
    dragNodeRef.current = id;
    dragOffsetRef.current = { x: touch.clientX - node.x, y: touch.clientY - node.y };
    isDragging.current = true;
    setDraggingId(id);
    
    // Add touch event listeners
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
    
    // Prevent text selection and other interactions
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none';
    e.currentTarget.style.pointerEvents = 'auto';
  }

  function onTouchMove(e: TouchEvent) {
    if (!isDragging.current || dragNodeRef.current == null) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const id = dragNodeRef.current;
    const offset = dragOffsetRef.current;
    let newY = touch.clientY - offset.y;
    if (newY < 180) newY = 180; // Adjusted minY for mobile
    
    const newX = touch.clientX - offset.x;
    
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

  function onTouchEnd(e: TouchEvent) {
    if (!isDragging.current) return;

    e.preventDefault();
    dragNodeRef.current = null;
    isDragging.current = false;
    setDraggingId(null);
    
    // Clean up event listeners
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    
    // Restore body styles
    document.body.style.userSelect = '';
    document.body.style.pointerEvents = '';
    
    // Cancel any pending animation frame
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  }

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

  // Programmatically disable zoom on small OrbitControls
  React.useEffect(() => {
    if (smallOrbitControlsRef.current) {
      const controls = smallOrbitControlsRef.current;
      
      // Force disable all zoom functionality
      controls.enableZoom = false;
      controls.zoomSpeed = 0;
      controls.minDistance = 2.5;
      controls.maxDistance = 2.5;
      
      // Remove zoom event listeners
      const domElement = controls.domElement;
      if (domElement) {
        const preventZoom = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        };
        
        domElement.addEventListener('wheel', preventZoom, { passive: false });
        domElement.addEventListener('touchstart', preventZoom, { passive: false });
        domElement.addEventListener('touchmove', preventZoom, { passive: false });
        domElement.addEventListener('gesturestart', preventZoom, { passive: false });
        domElement.addEventListener('gesturechange', preventZoom, { passive: false });
        domElement.addEventListener('gestureend', preventZoom, { passive: false });
        
        return () => {
          domElement.removeEventListener('wheel', preventZoom);
          domElement.removeEventListener('touchstart', preventZoom);
          domElement.removeEventListener('touchmove', preventZoom);
          domElement.removeEventListener('gesturestart', preventZoom);
          domElement.removeEventListener('gesturechange', preventZoom);
          domElement.removeEventListener('gestureend', preventZoom);
        };
      }
    }
  }, []);

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
          onTouchStart={e => onTouchStart(e, node.id)}
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
          {/* Label above node - Mobile Responsive (hidden for LUT) */}
          {node.type !== 'lut' && (
            <span className="mb-1 text-xs sm:text-sm font-semibold text-white dark:text-white bg-black/60 dark:bg-black/80 px-2 py-0.5 rounded select-none" style={{ marginBottom: 2 }}>{node.label}</span>
          )}
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
                                      <OrbitControls 
                    ref={smallOrbitControlsRef}
                    enablePan={false} 
                    enableZoom={false} 
                    enableDamping={false}
                    enableRotate={true}
                    zoomSpeed={0}
                    panSpeed={0}
                    rotateSpeed={1}
                    screenSpacePanning={false}
                    minDistance={isMounted && window.innerWidth < 640 ? 3.2 : isMounted && window.innerWidth < 768 ? 3.0 : 2.8}
                    maxDistance={isMounted && window.innerWidth < 640 ? 3.2 : isMounted && window.innerWidth < 768 ? 3.0 : 2.8}
                  />
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
              <span className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm px-2 text-center leading-tight" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                {isMounted && window.innerWidth < 640 
                  ? "A black and white photo of a girl."
                  : "A black and white photo of a girl looking straight with her hair tied back."
                }
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Custom rotation-only controls (no zoom functionality)
function RotationOnlyControls() {
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      
      // Store current position before rotation
      const currentX = camera.position.x;
      const currentZ = camera.position.z;
      
      // Rotate around Y axis (horizontal mouse movement) - only horizontal rotation
      const angle = deltaX * 0.01;
      camera.position.x = currentX * Math.cos(angle) - currentZ * Math.sin(angle);
      camera.position.z = currentX * Math.sin(angle) + currentZ * Math.cos(angle);
      
      // NO vertical movement or Y-axis changes - this was causing the "pitch to zoom" effect
      // Keep the camera at the same distance and height
      
      camera.lookAt(0, 0, 0);
      setLastMouse({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    // Prevent all zoom events
    const preventZoom = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', preventZoom, { passive: false });
    canvas.addEventListener('touchstart', preventZoom, { passive: false });
    canvas.addEventListener('touchmove', preventZoom, { passive: false });
    canvas.addEventListener('gesturestart', preventZoom, { passive: false });
    canvas.addEventListener('gesturechange', preventZoom, { passive: false });
    canvas.addEventListener('gestureend', preventZoom, { passive: false });
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', preventZoom);
      canvas.removeEventListener('touchstart', preventZoom);
      canvas.removeEventListener('touchmove', preventZoom);
      canvas.removeEventListener('gesturestart', preventZoom);
      canvas.removeEventListener('gesturechange', preventZoom);
      canvas.removeEventListener('gestureend', preventZoom);
    };
  }, [camera, gl, isDragging, lastMouse]);
  
  return null;
}

// 3D Model loader component
function Model3D({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const ref = useRef<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1.2);

  // Update scale based on screen size
  React.useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth < 640) {
        setScale(0.8); // Mobile: smaller scale
      } else if (window.innerWidth < 768) {
        setScale(1.0); // Tablet: medium scale
      } else {
        setScale(1.2); // Desktop: original scale
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Update rotation based on mouse position
  React.useEffect(() => {
    const handleMouseMove = () => {
      const canvas = document.querySelector('canvas');
      if (canvas && (canvas as any).mouseX !== undefined) {
        setMousePos({
          x: (canvas as any).mouseX || 0,
          y: 0  // IGNORE vertical mouse movement to prevent pitch to zoom
        });
      }
    };

    const interval = setInterval(handleMouseMove, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  // Apply rotation to the model - ONLY horizontal rotation
  React.useEffect(() => {
    if (ref.current) {
      ref.current.rotation.y = mousePos.x * 0.5; // Horizontal rotation only
      // NO vertical rotation to prevent pitch to zoom effect
    }
  }, [mousePos]);

  return <primitive object={gltf.scene} ref={ref} scale={scale} position={[0, 0, 0]} />;
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