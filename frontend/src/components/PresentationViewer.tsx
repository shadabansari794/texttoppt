// @ts-ignore - Temporarily ignore TypeScript errors for React imports
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
// @ts-ignore - Temporarily ignore TypeScript errors for Lucide React
import { ChevronLeft, ChevronRight, Home, Edit3, Check, X, Palette, Zap, MessageSquare, Loader2 } from "lucide-react";
import { modifySlide } from "@/lib/api";
import { Slide } from "@/pages/Index";

interface PresentationViewerProps {
  slides: Slide[];
  currentSlide: number;
  onSlideChange: (index: number) => void;
  onReset: () => void;
  onSlidesUpdate?: (slides: Slide[]) => void;
}

const colorThemes = [
  { name: "Blue Ocean", bg: "from-blue-600 via-blue-700 to-blue-800", accent: "bg-blue-500", textShadow: "text-shadow-blue" },
  { name: "Purple Galaxy", bg: "from-purple-600 via-purple-700 to-purple-800", accent: "bg-purple-500", textShadow: "text-shadow-purple" },
  { name: "Emerald Forest", bg: "from-emerald-600 via-emerald-700 to-emerald-800", accent: "bg-emerald-500", textShadow: "text-shadow-emerald" },
  { name: "Rose Sunset", bg: "from-rose-600 via-rose-700 to-rose-800", accent: "bg-rose-500", textShadow: "text-shadow-rose" },
  { name: "Orange Fire", bg: "from-orange-600 via-orange-700 to-orange-800", accent: "bg-orange-500", textShadow: "text-shadow-orange" },
  { name: "Teal Wave", bg: "from-teal-600 via-teal-700 to-teal-800", accent: "bg-teal-500", textShadow: "text-shadow-teal" },
  { name: "Indigo Night", bg: "from-indigo-600 via-indigo-700 to-indigo-800", accent: "bg-indigo-500", textShadow: "text-shadow-indigo" },
  { name: "Cyan Storm", bg: "from-cyan-600 via-cyan-700 to-cyan-800", accent: "bg-cyan-500", textShadow: "text-shadow-cyan" },
];

const slideAnimations = [
  { name: "Fade In", class: "animate-fade-in" },
  { name: "Slide Right", class: "animate-slide-in-right" },
  { name: "Scale Up", class: "animate-scale-in" },
  { name: "Bounce In", class: "animate-bounce-in" },
];

const PresentationViewer = ({ 
  slides, 
  currentSlide, 
  onSlideChange, 
  onReset,
  onSlidesUpdate 
}: PresentationViewerProps) => {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [selectedAnimation, setSelectedAnimation] = useState(0);
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState<string[]>([]);
  const [slideKey, setSlideKey] = useState(0);
  
  // Chat-based modification states
  const [chatModifyingSlide, setChatModifyingSlide] = useState<number | null>(null);
  const [chatInstruction, setChatInstruction] = useState("");
  const [isSubmittingChat, setIsSubmittingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const currentTheme = colorThemes[selectedTheme];
  const currentAnimation = slideAnimations[selectedAnimation];

  const handleSlideChange = (newSlide: number) => {
    onSlideChange(newSlide);
    setSlideKey(prev => prev + 1); // Force re-animation
  };

  const handleEditStart = (slideIndex: number) => {
    const slide = slides[slideIndex];
    setEditingSlide(slideIndex);
    setEditTitle(slide.title);
    setEditContent([...slide.content]);
    // Close chat modification if it was open
    setChatModifyingSlide(null);
    setChatInstruction("");
  };
  
  // Start chat-based modification for a slide
  const handleChatModifyStart = (slideIndex: number) => {
    // Close manual editing if it was open
    setEditingSlide(null);
    setChatModifyingSlide(slideIndex);
    setChatInstruction("");
    setChatError("");
  };
  
  // Handle submitting chat instructions to modify a slide
  const handleChatModifySubmit = async () => {
    if (chatModifyingSlide === null || !chatInstruction.trim() || !onSlidesUpdate) return;
    
    const currentSlideData = slides[chatModifyingSlide];
    // Check if we have a backend slide ID
    if (!currentSlideData.originalId) {
      setChatError("This slide doesn't have an ID for modification. Try manual editing instead.");
      return;
    }
    
    setIsSubmittingChat(true);
    setChatError("");
    
    try {
      // Format the current slide content for the API
      const slideContent = {
        title: currentSlideData.title,
        bullets: currentSlideData.content.map(text => ({ text }))
      };
      
      // Call the API to modify the slide
      const result = await modifySlide(
        currentSlideData.originalId!,
        chatInstruction,
        slideContent
      );
      
      // Update the slide with the modified content
      if (result && result.modified_slide) {
        const updatedSlides = [...slides];
        updatedSlides[chatModifyingSlide] = {
          ...updatedSlides[chatModifyingSlide],
          title: result.modified_slide.title,
          content: result.modified_slide.bullets.map(b => b.text),
          originalId: result.modified_slide.slide_id
        };
        
        onSlidesUpdate(updatedSlides);
        setChatModifyingSlide(null);
        setChatInstruction("");
        
        // Force re-animation
        setSlideKey(prev => prev + 1);
      }
    } catch (error: any) {
      setChatError(error.message || "Failed to modify slide");
    } finally {
      setIsSubmittingChat(false);
    }
  };
  
  // Cancel chat-based modification
  const handleChatModifyCancel = () => {
    setChatModifyingSlide(null);
    setChatInstruction("");
    setChatError("");
  };

  const handleEditSave = () => {
    if (editingSlide !== null && onSlidesUpdate) {
      const updatedSlides = [...slides];
      updatedSlides[editingSlide] = {
        ...updatedSlides[editingSlide],
        title: editTitle,
        content: editContent
      };
      onSlidesUpdate(updatedSlides);
    }
    setEditingSlide(null);
  };

  const handleEditCancel = () => {
    setEditingSlide(null);
    setEditTitle("");
    setEditContent([]);
  };

  const updateContentItem = (index: number, value: string) => {
    const newContent = [...editContent];
    newContent[index] = value;
    setEditContent(newContent);
  };

  const addContentItem = () => {
    setEditContent([...editContent, ""]);
  };

  const removeContentItem = (index: number) => {
    const newContent = editContent.filter((_, i) => i !== index);
    setEditContent(newContent);
  };

  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={onReset}
            variant="outline"
            className="flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200"
          >
            <Home className="h-4 w-4 mr-1" />
            <span>Home</span>
          </Button>
          {currentSlide > 0 && ( // Only show for non-title slides
            <Button
              onClick={() => handleChatModifyStart(currentSlide)}
              variant="outline"
              className="bg-purple-100 hover:bg-purple-200 border-purple-300"
              disabled={chatModifyingSlide !== null || editingSlide !== null}
            >
              <MessageSquare className="h-4 w-4 mr-1 text-purple-700" />
              <span className="text-purple-800">Chat Modify</span>
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-gray-600" />
            <select 
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(Number(e.target.value))}
              className="px-3 py-2 border rounded-md text-sm bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {colorThemes.map((theme, index) => (
                <option key={index} value={index}>{theme.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-gray-600" />
            <select 
              value={selectedAnimation}
              onChange={(e) => setSelectedAnimation(Number(e.target.value))}
              className="px-3 py-2 border rounded-md text-sm bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {slideAnimations.map((animation, index) => (
                <option key={index} value={index}>{animation.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-medium">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            {editingSlide !== currentSlide && (
              <Button
                onClick={() => handleEditStart(currentSlide)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 hover:bg-blue-50 transition-all duration-200"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main slide display */}
      <Card className="shadow-2xl border-0 overflow-hidden">
        <CardContent className={`p-0 bg-gradient-to-br ${currentTheme.bg} text-white min-h-[600px] flex flex-col justify-center relative`}>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>

          {editingSlide === currentSlide ? (
            <CardContent className="relative p-0">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title:</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Content:</label>
                  <div className="space-y-2">
                    {editContent.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Textarea
                          value={item}
                          onChange={(e) => updateContentItem(index, e.target.value)}
                          className="text-gray-900 flex-1"
                          rows={2}
                        />
                        <Button
                          onClick={() => removeContentItem(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={addContentItem}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Add Point
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleEditSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button onClick={handleEditCancel} variant="outline" size="sm">
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          ) : chatModifyingSlide !== null ? (
            <CardContent className="relative p-0">
              <div className="p-6 bg-white/90 backdrop-blur-xl text-gray-800 min-h-[500px] flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">Chat-Based Slide Modification</h3>
                  <p className="text-sm text-gray-600">Provide instructions to modify this slide</p>
                  
                  {/* Current slide preview */}
                  <div className="mt-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold mb-2">{slides[chatModifyingSlide].title}</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {slides[chatModifyingSlide].content.map((point, idx) => (
                        <li key={idx} className="text-sm">{point}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="chatInstruction" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Modification Instructions
                    </label>
                    <Textarea
                      id="chatInstruction"
                      value={chatInstruction}
                      onChange={(e) => setChatInstruction(e.target.value)}
                      placeholder="E.g., Make this slide more concise, Add a point about sustainability, Reframe in a more positive tone..."
                      className="min-h-[100px] text-gray-800"
                      disabled={isSubmittingChat}
                    />
                  </div>
                  
                  {chatError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                      {chatError}
                    </div>
                  )}
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      onClick={handleChatModifySubmit} 
                      disabled={!chatInstruction.trim() || isSubmittingChat}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isSubmittingChat ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Modify with AI
                        </>
                      )}
                    </Button>
                    <Button onClick={handleChatModifyCancel} variant="outline" disabled={isSubmittingChat}>
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          ) : (
            <div key={slideKey} className={`p-12 text-center space-y-8 relative z-10 ${currentAnimation.class}`}>
              {/* Display mode */}
              <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-2xl animate-fade-in-up">
                {slide.title}
              </h1>
              
              {slide.type === 'content' && slide.content.length > 0 && (
                <div className="space-y-6 max-w-5xl mx-auto">
                  {slide.content.map((point, index) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-4 text-left group hover:scale-105 transition-all duration-300"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className={`w-4 h-4 ${currentTheme.accent} rounded-full mt-2 flex-shrink-0 shadow-lg group-hover:scale-125 transition-transform duration-300`}></div>
                      <p className="text-xl md:text-2xl leading-relaxed drop-shadow-lg animate-slide-in-left">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation controls */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <Button
          onClick={() => handleSlideChange(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          variant="outline"
          className="flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        {/* Slide thumbnails */}
        <div className="flex space-x-2 overflow-x-auto max-w-md">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`w-10 h-6 rounded border-2 flex-shrink-0 transition-all duration-300 hover:scale-110 ${
                index === currentSlide 
                  ? `${currentTheme.accent} border-white shadow-lg` 
                  : 'border-gray-300 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={() => handleSlideChange(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
          variant="outline"
          className="flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
         </Button>
      </div>
    </div>
  );
};

export default PresentationViewer;
