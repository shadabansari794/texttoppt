
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles } from "lucide-react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: (text: string) => void;
  isGenerating: boolean;
}

const TextInput = ({ value, onChange, onGenerate, isGenerating }: TextInputProps) => {
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (text: string) => {
    onChange(text);
    setCharCount(text.length);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    handleTextChange(value + pastedText);
  };

  const sampleTexts = [
    {
      title: "Photosynthesis",
      content: "Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in chloroplasts and involves two main stages: light reactions and the Calvin cycle."
    },
    {
      title: "Machine Learning",
      content: "Machine learning is a subset of artificial intelligence that enables computers to learn without explicit programming. It uses algorithms to identify patterns in data and make predictions."
    },
    {
      title: "Water Cycle",
      content: "The water cycle is Earth's continuous movement of water through evaporation, condensation, and precipitation. Solar energy drives evaporation from oceans, lakes, and rivers."
    }
  ];

  return (
    <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Input Your Text</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => handleTextChange(e.target.value)}
            onPaste={handlePaste}
            placeholder="Paste your text here from PDFs, textbooks, articles, or any document. The longer the text, the more slides will be generated..."
            className="min-h-[200px] resize-none border-2 border-gray-200 focus:border-blue-500 transition-colors"
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            {charCount} characters
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-gray-600">
            💡 Tip: Paste content from textbooks, research papers, or study materials for best results
          </div>
          <Button 
            onClick={() => onGenerate(value)}
            disabled={!value.trim() || isGenerating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? "Generating..." : "Generate Slides"}</span>
          </Button>
        </div>

        {/* Sample Text Buttons */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">Or try these sample texts:</p>
          <div className="space-y-3">
            {sampleTexts.map((sample, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-800 mb-2">{sample.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{sample.content}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTextChange(sample.content + ". During light reactions, chlorophyll absorbs sunlight and converts it to ATP and NADPH. The Calvin cycle uses these energy molecules to convert carbon dioxide into glucose. Applications include image recognition, natural language processing, and recommendation systems. Water vapor rises and cools to form clouds through condensation. Precipitation returns water to Earth's surface, completing the cycle and sustaining all life on our planet.")}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Use This Sample
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextInput;
