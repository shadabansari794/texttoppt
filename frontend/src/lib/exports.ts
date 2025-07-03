import pptxgen from 'pptxgenjs';
import jsPDF from 'jspdf';
import type { Slide } from '../pages/Index';

/**
 * Generate and download a PowerPoint presentation
 * @param slides Array of slide data
 * @param title Presentation title
 */
export function exportToPPTX(slides: Slide[], title: string): void {
  // Create a new presentation
  const pres = new pptxgen();
  
  // Set presentation properties
  pres.title = title;
  pres.subject = "Generated Presentation";
  pres.author = "Text-to-PPT App";
  
  // Add title slide
  const titleSlide = pres.addSlide();
  titleSlide.addText(title, { 
    x: 1, 
    y: 1, 
    w: '80%', 
    h: 2, 
    fontSize: 44,
    color: '0066CC',
    bold: true,
    align: 'center'
  });
  titleSlide.addText("Generated Presentation", { 
    x: 1, 
    y: 3, 
    w: '80%', 
    h: 1, 
    fontSize: 24,
    color: '666666',
    align: 'center'
  });
  
  // Add content slides
  slides.forEach((slideData) => {
    if (slideData.type === 'title') return; // Skip the title slide as we already created it
    
    const slide = pres.addSlide();
    
    // Add slide title
    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.5,
      w: '95%',
      h: 1,
      fontSize: 32,
      color: '0066CC',
      bold: true
    });
    
    // Add bullet points
    const bulletPoints = slideData.content.filter(item => item.trim());
    if (bulletPoints.length > 0) {
      slide.addText(bulletPoints.map(item => item.trim()), {
        x: 0.5,
        y: 1.8,
        w: '90%',
        h: 5,
        fontSize: 20,
        bullet: { type: 'bullet' },
        color: '333333'
      });
    }
  });
  
  // Save the presentation
  pres.writeFile({ fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pptx` });
}

/**
 * Generate and download a PDF document
 * @param slides Array of slide data
 * @param title Presentation title
 */
export function exportToPDF(slides: Slide[], title: string): void {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Title page
  pdf.setFontSize(36);
  pdf.setTextColor(0, 102, 204); // Blue color for title
  
  // Center the title
  const titleWidth = pdf.getStringUnitWidth(title) * 36 / pdf.internal.scaleFactor;
  const titleX = (pageWidth - titleWidth) / 2;
  pdf.text(title, titleX, 60);
  
  // Subtitle
  pdf.setFontSize(18);
  pdf.setTextColor(102, 102, 102); // Gray for subtitle
  pdf.text("Generated Presentation", pageWidth / 2, 80, { align: 'center' });
  
  // Add content slides
  slides.forEach((slideData, index) => {
    // Skip the title slide (if it's the first one and of type 'title')
    if (index === 0 && slideData.type === 'title') return;
    
    // Add a new page for each slide
    pdf.addPage();
    
    // Slide title
    pdf.setFontSize(28);
    pdf.setTextColor(0, 102, 204); // Blue color for slide titles
    pdf.text(slideData.title, 20, 20);
    
    // Bullet points
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0); // Black color for content
    
    const bulletPoints = slideData.content.filter(item => item.trim());
    bulletPoints.forEach((point, i) => {
      // Add a bullet point character and the text
      pdf.text(`• ${point.trim()}`, 25, 40 + (i * 12));
    });
  });
  
  // Save the PDF
  pdf.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}
