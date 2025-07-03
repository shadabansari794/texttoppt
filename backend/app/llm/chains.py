import json
from typing import Dict, Any, Optional
import uuid

from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnablePassthrough

from app.core.config import settings
from app.prompts.templates import get_presentation_prompt_template, get_slide_modification_prompt_template
from app.schemas.presentation import Slide, Presentation, Bullet

def parse_json_response(text: str) -> Dict[str, Any]:
    """
    Parse the LLM output text to extract JSON content
    """
    try:
        # First attempt: try to parse the entire text as JSON
        return json.loads(text)
    except json.JSONDecodeError:
        # Second attempt: try to extract JSON from markdown code blocks
        import re
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass
                
        # Third attempt: try to find anything that looks like JSON
        import re
        json_match = re.search(r'{[\s\S]*}', text)
        if json_match:
            try:
                return json.loads(json_match.group(0))
            except json.JSONDecodeError:
                pass
                
        # If all attempts fail, return an error
        return {"error": "Failed to parse JSON response from LLM output"}

def get_presentation_chain():
    """
    Create and return a chain for generating presentations
    """
    # Initialize the language model
    llm = ChatOpenAI(
        api_key=settings.OPENAI_API_KEY,
        model=settings.DEFAULT_MODEL,
        temperature=settings.TEMPERATURE,
        max_tokens=settings.MAX_TOKENS,
    )
    
    # Get the prompt template
    prompt_template = get_presentation_prompt_template()
    
    # Create the chain
    chain = (
        {"text": RunnablePassthrough()}
        | prompt_template
        | llm
        | StrOutputParser()
        | parse_json_response
    )
    
    def process_result(result):
        # Handle error case
        if "error" in result:
            return result
            
        # Process and validate the result
        try:
            # Add slide IDs if they don't exist
            if "slides" in result:
                for slide in result["slides"]:
                    if "slide_id" not in slide:
                        slide["slide_id"] = str(uuid.uuid4())
                    
                    # Convert bullets to proper format if needed
                    if "bullets" in slide and slide["bullets"]:
                        if isinstance(slide["bullets"][0], str):
                            slide["bullets"] = [{"text": bullet} for bullet in slide["bullets"]]
            
            # Convert to our schema objects
            presentation = Presentation(
                title=result["title"],
                slides=[
                    Slide(
                        title=slide["title"],
                        bullets=[Bullet(text=bullet["text"]) for bullet in slide["bullets"]],
                        slide_id=slide["slide_id"]
                    ) for slide in result["slides"]
                ]
            )
            
            return presentation.model_dump()
        except Exception as e:
            return {"error": f"Error processing presentation data: {str(e)}"}
    
    # Add post-processing to the chain
    return chain | process_result

def get_slide_modification_chain():
    """
    Create and return a chain for modifying slides
    """
    # Initialize the language model
    llm = ChatOpenAI(
        api_key=settings.OPENAI_API_KEY,
        model=settings.DEFAULT_MODEL,
        temperature=settings.TEMPERATURE,
        max_tokens=settings.MAX_TOKENS,
    )
    
    # Get the prompt template
    prompt_template = get_slide_modification_prompt_template()
    
    # Create the chain
    chain = (
        prompt_template
        | llm
        | StrOutputParser()
        | parse_json_response
    )
    
    def process_result(result):
        # Handle error case
        if "error" in result:
            return result
            
        # Process and validate the result
        try:
            # Ensure the slide_id is preserved
            if "slide_id" not in result and "slide_id" in result.get("input", {}):
                result["slide_id"] = result["input"]["slide_id"]
                
            # Convert bullets to proper format if needed
            if "bullets" in result and result["bullets"]:
                if isinstance(result["bullets"][0], str):
                    result["bullets"] = [{"text": bullet} for bullet in result["bullets"]]
            
            # Convert to our schema object
            modified_slide = Slide(
                title=result["title"],
                bullets=[Bullet(text=bullet["text"]) for bullet in result["bullets"]],
                slide_id=result["slide_id"]
            )
            
            return modified_slide.model_dump()
        except Exception as e:
            return {"error": f"Error processing slide modification: {str(e)}"}
    
    # Add post-processing to the chain
    return chain | process_result
