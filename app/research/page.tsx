"use client"

import { useState, useEffect } from "react"
import Navigation from "../components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2 } from "lucide-react"
import Footer from "@/components/footer"

interface ResearchPaper {
  id: string
  date: string
  title: string
  authors: string
  summary: string
  link: string
}

export default function ResearchPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const stored = localStorage.getItem("research_papers")
    if (stored) {
      setPapers(JSON.parse(stored))
    } else {
      setPapers([
        {
          id: "1",
          date: "March 31, 2025",
          title: "StochasticSplats: Stochastic Rasterization for Sorting-Free 3D Gaussian Splatting",
          authors: "by Shakiba Kheradmand, Delin Vicini, George Kopanas, Dmitry Lagun, Kwang Moo Yi, Mark Matthews, Andrea Tagliasacchi",
          summary: "3D Gaussian splatting (3DGS) is a popular radiance field method, with many application-specific extensions. Most variants rely on the same core method of Gaussian splattering, they rasterize in primitive order. This ensures correct alpha compositing, but can cause rendering artifacts due to built-in approximations. Moreover, for a fixed representation, sorted rasterization is not necessarily faster. In this work, we address the above limitations by combining 3D Gaussian splatting with stochastic rasterization.",
          link: "https://example.com/paper1"
        },
        {
          id: "2", 
          date: "March 22, 2025",
          title: "Progressive Prompt Detailing for Improved Alignment in Text-to-Image Generative Models",
          authors: "by Ketan Suhaas Saichandran, Xavier Thomas, Prakhir Kaushik, Deepti Ghadiyaram",
          summary: "Text-to-image generative models often struggle with long prompts detailing complex scenes, diverse objects with distinct visual characteristics. In this work, we propose SCo-PE (Stochastic Controllable Prompt Embeddings), a training-free method to improve text-to-image alignment by progressively refining the input prompt in a coarse-to-fine-grained manner.",
          link: "https://example.com/paper2"
        }
      ])
    }
  }, [hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem("research_papers", JSON.stringify(papers))
  }, [papers, hydrated])

  // Function to parse date and sort papers by publication date (newest first)
  const parseDate = (dateString: string) => {
    return new Date(dateString)
  }

  const sortedPapers = [...papers].sort((a, b) => {
    const dateA = parseDate(a.date)
    const dateB = parseDate(b.date)
    return dateB.getTime() - dateA.getTime() // Newest first
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPaper, setEditingPaper] = useState<ResearchPaper | null>(null)
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    authors: "",
    summary: "",
    link: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPaper) {
      // Update existing paper
      setPapers(papers.map(paper => 
        paper.id === editingPaper.id 
          ? { ...formData, id: editingPaper.id }
          : paper
      ))
    } else {
      // Add new paper
      const newPaper: ResearchPaper = {
        ...formData,
        id: Date.now().toString()
      }
      setPapers([newPaper, ...papers])
    }
    
    // Reset form
    setFormData({ date: "", title: "", authors: "", summary: "", link: "" })
    setEditingPaper(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (paper: ResearchPaper) => {
    setEditingPaper(paper)
    setFormData({
      date: paper.date,
      title: paper.title,
      authors: paper.authors,
      summary: paper.summary,
      link: paper.link
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setPapers(papers.filter(paper => paper.id !== id))
  }

  const resetForm = () => {
    setFormData({ date: "", title: "", authors: "", summary: "", link: "" })
    setEditingPaper(null)
  }

  if (!hydrated) return null // Prevent SSR mismatch

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Main Content */}
      <div className="pt-24 pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
                Publications
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-light whitespace-nowrap">
                Explore our latest research, papers, and publications in AI and creative technology.
              </p>
            </div>
            
            {/* CMS Add Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={resetForm}
                  className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-3 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Research Paper
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {editingPaper ? "Edit Research Paper" : "Add New Research Paper"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium text-gray-700">Publication Date</Label>
                    <Input
                      id="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="March 31, 2025"
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">Paper Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter paper title"
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authors" className="text-sm font-medium text-gray-700">Authors</Label>
                    <Input
                      id="authors"
                      value={formData.authors}
                      onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                      placeholder="by Author Name, Another Author"
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary" className="text-sm font-medium text-gray-700">Summary</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Enter paper summary..."
                      rows={5}
                      className="resize-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link" className="text-sm font-medium text-gray-700">Paper Link</Label>
                    <Input
                      id="link"
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://example.com/paper"
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="px-6 py-2"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-black text-white hover:bg-gray-800 px-6 py-2"
                    >
                      {editingPaper ? "Update Paper" : "Add Paper"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Research Papers List */}
        <div className="space-y-10">
          {sortedPapers.map((paper, index) => (
            <div key={paper.id} className="bg-[#18181b] rounded-2xl shadow-lg border border-[#232323] p-8 flex flex-col md:flex-row md:items-center gap-8 transition-all duration-300">
              {/* Date */}
              <div className="md:w-40 flex-shrink-0 flex items-center justify-center">
                <p className="text-base font-semibold text-gray-400 uppercase tracking-wider text-center md:text-left">
                  {paper.date}
                </p>
              </div>
              
              {/* Paper Content */}
              <div className="flex-1 space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {paper.title}
                </h2>
                <p className="text-base text-gray-300 font-medium">{paper.authors}</p>
                <p className="text-lg text-gray-400 leading-relaxed font-light">
                  {paper.summary}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-3 md:ml-6">
                <Button
                  onClick={() => window.open(paper.link, '_blank')}
                  className="bg-white text-black hover:bg-gray-200 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Read Paper
                </Button>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(paper)}
                    variant="outline"
                    size="sm"
                    className="p-2.5 border-gray-600 text-white bg-transparent"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(paper.id)}
                    variant="outline"
                    size="sm"
                    className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 border-gray-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {papers.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">No research papers yet</h3>
              <p className="text-gray-400 mb-8">Start by adding your first research paper to showcase your work.</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={resetForm}
                    className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-3"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Paper
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
} 