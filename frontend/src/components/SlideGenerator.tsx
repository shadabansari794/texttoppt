
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";

interface SlideGeneratorProps {
  isGenerating: boolean;
  onGenerate: () => void;
}

const SlideGenerator = ({ isGenerating }: SlideGeneratorProps) => {
  if (!isGenerating) return null;

  const steps = [
    { text: "Analyzing your text...", delay: 0 },
    { text: "Identifying key topics...", delay: 500 },
    { text: "Creating slide structure...", delay: 1000 },
    { text: "Formatting content...", delay: 1200 }
  ];

  return (
    <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Creating Your Presentation
            </h3>
            <p className="text-gray-600">
              Please wait while we transform your text into professional slides...
            </p>
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 text-sm text-gray-700 animate-pulse"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{step.text}</span>
              </div>
            ))}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full animate-pulse transition-all duration-1000 w-3/4"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlideGenerator;
