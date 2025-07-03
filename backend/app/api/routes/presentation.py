from fastapi import APIRouter, HTTPException
from fastapi.responses import Response, JSONResponse
from typing import Dict, Any
import logging

from app.llm.chains import get_presentation_chain, get_slide_modification_chain
from app.schemas.presentation import (
    PresentationRequest, 
    Presentation, 
    SlideModificationRequest, 
    SlideModificationResponse,
    ErrorResponse
)
from app.services.ppt_service import PPTService

router = APIRouter()

@router.post("/generate", response_model=Presentation)
async def generate_presentation(request: PresentationRequest):
    """
    Generate a structured presentation from input text
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty")
    
    try:
        # Get the LLM chain and process the input
        chain = get_presentation_chain()
        result = chain.invoke(request.text)
        
        # Check for errors
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/modify-slide", response_model=SlideModificationResponse)
async def modify_slide(request: SlideModificationRequest):
    """
    Modify a specific slide based on user instructions
    """
    if not request.user_prompt.strip():
        raise HTTPException(status_code=400, detail="Modification instructions cannot be empty")
    
    try:
        # Format the input for the modification chain
        input_data = {
            "title": request.current_content.title,
            "bullets": "\n".join([f"- {bullet.text}" for bullet in request.current_content.bullets]),
            "slide_id": request.slide_id,
            "user_prompt": request.user_prompt
        }
        
        # Get the slide modification chain and process the input
        chain = get_slide_modification_chain()
        result = chain.invoke(input_data)
        
        # Check for errors
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        # Return the modified slide
        return {
            "slide_id": result["slide_id"],
            "modified_slide": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/download")
async def download_presentation(request: PresentationRequest):
    """
    Generate and download a PowerPoint presentation from input text
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty")
    
    try:
        # Generate the presentation content
        chain = get_presentation_chain()
        presentation_data = chain.invoke(request.text)
        
        # Check for errors
        if isinstance(presentation_data, dict) and "error" in presentation_data:
            raise HTTPException(status_code=500, detail=presentation_data["error"])
            
        # Generate PPTX file
        pptx_bytes = PPTService.create_presentation(presentation_data)
        
        # Return as downloadable file
        filename = f"{presentation_data['title'].replace(' ', '_')}.pptx"
        return Response(
            content=pptx_bytes.getvalue(),
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PDF endpoint removed as requested

@router.post("/presentation-base64")
async def get_presentation_base64(request: PresentationRequest):
    """
    Generate presentation data with a base64-encoded PowerPoint file
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty")
    
    try:
        # Generate the presentation content
        chain = get_presentation_chain()
        presentation_data = chain.invoke(request.text)
        
        # Check for errors
        if isinstance(presentation_data, dict) and "error" in presentation_data:
            raise HTTPException(status_code=500, detail=presentation_data["error"])
            
        # Generate base64 encoded PPTX
        base64_pptx = PPTService.get_presentation_base64(presentation_data)
        
        # Add base64 data to the response
        response_data = {
            **presentation_data,
            "pptx_base64": base64_pptx
        }
        
        return JSONResponse(content=response_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
