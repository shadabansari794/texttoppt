from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PresentationRequest(BaseModel):
    """Schema for presentation generation request"""
    text: str = Field(..., description="Input text to generate presentation from")

class Bullet(BaseModel):
    """Schema for a bullet point"""
    text: str = Field(..., description="Bullet point text")

class Slide(BaseModel):
    """Schema for a presentation slide"""
    title: str = Field(..., description="Slide title")
    bullets: List[Bullet] = Field(default_factory=list, description="List of bullet points")
    slide_id: Optional[str] = Field(None, description="Unique identifier for the slide")

class Presentation(BaseModel):
    """Schema for a complete presentation"""
    title: str = Field(..., description="Presentation title")
    slides: List[Slide] = Field(default_factory=list, description="List of slides")
    
class SlideModificationRequest(BaseModel):
    """Schema for slide modification request"""
    slide_id: str = Field(..., description="ID of the slide to modify")
    user_prompt: str = Field(..., description="User's instruction on how to modify the slide")
    current_content: Slide = Field(..., description="Current content of the slide")
    
class SlideModificationResponse(BaseModel):
    """Schema for slide modification response"""
    slide_id: str = Field(..., description="ID of the modified slide")
    modified_slide: Slide = Field(..., description="Modified slide content")
    
class ErrorResponse(BaseModel):
    """Schema for error responses"""
    detail: str = Field(..., description="Error detail message")
