// @ts-ignore - Temporarily ignore TypeScript errors for React imports
import React, { useState } from "react";
import TextInput from "@/components/TextInput";
import SlideGenerator from "@/components/SlideGenerator";
import PresentationViewer from "@/components/PresentationViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// @ts-ignore - Temporarily ignore TypeScript errors for Lucide React
import { FileText, Presentation, Download, Zap, Users, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePresentation, ApiPresentationResponse, SlideModificationResponse, downloadPresentation } from "@/lib/api";

export interface Slide {
  id: number;
  title: string;
  content: string[];
  type: 'title' | 'content';
  originalId?: string; // Backend slide_id for API operations
}

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateSlides = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to convert to slides.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Use our API service to call the backend
      const data = await generatePresentation(text);
      const generatedSlides = convertApiResponseToSlides(data);
      
      setSlides(generatedSlides);
      setCurrentSlide(0);

      toast({
        title: "Slides generated successfully!",
        description: `Created ${generatedSlides.length} slides from your text.`,
      });
    } catch (error) {
      toast({
        title: "Error generating slides",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to convert the API response to our frontend slide format
  const convertApiResponseToSlides = (apiResponse: any): Slide[] => {
    const slides: Slide[] = [];
    
    // Create title slide from presentation title
    if (apiResponse.title) {
      slides.push({
        id: 1,
        title: apiResponse.title,
        content: ["Presentation Overview"],
        type: 'title'
      });
    }

    // Convert each slide from the API response
    if (apiResponse.slides && Array.isArray(apiResponse.slides)) {
      apiResponse.slides.forEach((slide: any, index: number) => {
        // Extract bullet text from bullet objects
        const bulletTexts = slide.bullets?.map((bullet: any) => 
          typeof bullet === 'string' ? bullet : bullet.text || '') || [];
          
        slides.push({
          id: slides.length + 1,
          title: slide.title,
          content: bulletTexts,
          type: 'content',
          // Store original slide_id if available for later use with the chat/modify API
          originalId: slide.slide_id || undefined
        });
      });
    }

    return slides;
  };

  // Legacy function for backup/fallback processing
  const processTextToSlides = (text: string): Slide[] => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const slides: Slide[] = [];
    
    // Create title slide
    const firstSentence = sentences[0]?.trim();
    if (firstSentence) {
      slides.push({
        id: 1,
        title: firstSentence.length > 60 ? firstSentence.substring(0, 60) + "..." : firstSentence,
        content: ["Presentation Overview"],
        type: 'title'
      });
    }

    // Group sentences into slides (3-4 bullets per slide)
    for (let i = 1; i < sentences.length; i += 4) {
      const slideContent = sentences.slice(i, i + 4).map(s => s.trim()).filter(s => s.length > 0);
      if (slideContent.length > 0) {
        slides.push({
          id: slides.length + 1,
          title: `Key Point ${Math.ceil(i / 4)}`,
          content: slideContent,
          type: 'content'
        });
      }
    }

    return slides;
  };

  const exportToPPT = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating PowerPoint presentation...",
        description: "Please wait while we create your PPTX file."
      });

      // Convert slides to the format expected by the backend
      let presentationText = "";
      
      // Use the input text if we have it (more complete content for the LLM)
      if (inputText.trim()) {
        presentationText = inputText;
      } else {
        // Otherwise, reconstruct from slides (less ideal but works as fallback)
        presentationText = slides[0]?.title + "\n\n";
        slides.slice(1).forEach(slide => {
          presentationText += `${slide.title}\n`;
          slide.content.forEach(bullet => {
            presentationText += `- ${bullet}\n`;
          });
          presentationText += "\n";
        });
      }

      // Use the API to download the actual PowerPoint file
      const pptxBlob = await downloadPresentation(presentationText);
      
      // Create a download link for the PPTX file
      const url = URL.createObjectURL(pptxBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presentation.pptx';
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "PowerPoint Downloaded Successfully!",
        description: "Your presentation has been downloaded as a PPTX file."
      });
    } catch (error) {
      toast({
        title: "Error downloading PowerPoint",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating PowerPoint presentation...",
        description: "Please wait while we create your PPTX file."
      });

      // Convert slides to the format expected by the backend
      let presentationText = "";
      
      // Use the input text if we have it (more complete content for the LLM)
      if (inputText.trim()) {
        presentationText = inputText;
      } else {
        // Otherwise, reconstruct from slides (less ideal but works as fallback)
        presentationText = slides[0]?.title + "\n\n";
        slides.slice(1).forEach(slide => {
          presentationText += `${slide.title}\n`;
          slide.content.forEach(bullet => {
            presentationText += `- ${bullet}\n`;
          });
          presentationText += "\n";
        });
      }

      // Use the API to download the PowerPoint file (same as exportToPPT)
      const pptxBlob = await downloadPresentation(presentationText);
      
      // Create a download link for the PPTX file
      const url = URL.createObjectURL(pptxBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presentation.pptx';
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "PowerPoint Downloaded Successfully!",
        description: "Your presentation has been downloaded as a PPTX file."
      });
    } catch (error) {
      toast({
        title: "Error downloading PowerPoint",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSlidesUpdate = (updatedSlides: Slide[]) => {
    setSlides(updatedSlides);
    toast({
      title: "Slide updated!",
      description: "Your changes have been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Presentation className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Text to PPT Converter
              </h1>
            </div>
            {slides.length > 0 && (
              <div className="flex items-center justify-center gap-2">
                <Button onClick={exportToPPT} variant="outline" disabled={slides.length === 0 || isGenerating}>
                  <FileText className="w-4 h-4 mr-2" /> Export to PowerPoint
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {slides.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Transform Your Text into Professional Presentations
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Perfect for students and professionals. Paste any text from PDFs, textbooks, or documents 
                and get a well-structured presentation instantly.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="pb-4">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-blue-900">Smart Text Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-800 text-sm">
                      Our AI analyzes your text and automatically identifies key points, topics, and structures for optimal slide organization.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="pb-4">
                    <div className="mx-auto w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-purple-900">Instant Generation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-800 text-sm">
                      Generate professional slides in seconds. No manual formatting needed - just paste your text and we'll do the rest.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="pb-4">
                    <div className="mx-auto w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-green-900">Edit & Customize</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-800 text-sm">
                      Edit content, choose from multiple color themes, and customize your presentation to match your style and needs.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Works with PDFs & Textbooks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Presentation className="h-5 w-5" />
                  <span>Professional Templates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export & Share Easily</span>
                </div>
              </div>
            </div>

            {/* Input Section */}
            <TextInput 
              value={inputText}
              onChange={setInputText}
              onGenerate={handleGenerateSlides}
              isGenerating={isGenerating}
            />

            {/* Slide Generator */}
            <SlideGenerator 
              isGenerating={isGenerating}
              onGenerate={() => handleGenerateSlides(inputText)}
            />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <PresentationViewer 
              slides={slides}
              currentSlide={currentSlide}
              onSlideChange={setCurrentSlide}
              onReset={() => {
                setSlides([]);
                setInputText("");
                setCurrentSlide(0);
              }}
              onSlidesUpdate={handleSlidesUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
