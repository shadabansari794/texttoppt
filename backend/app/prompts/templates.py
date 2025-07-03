from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

# Template for generating structured presentation from input text
PRESENTATION_SYSTEM_TEMPLATE = """
You are an expert presentation creator. Your task is to convert provided text into a well-structured presentation.
The output MUST be valid JSON with the following structure:
{{
    "title": "Presentation Title",
    "slides": [
        {{
            "title": "Slide Title",
            "bullets": [
                {{"text": "First bullet point"}},
                {{"text": "Second bullet point"}},
                {{"text": "Third bullet point"}}
            ]
        }}
    ]
}}

Guidelines:
1. Create a concise, engaging title for the presentation.
2. Break down the content into logical sections, each becoming a slide.
3. Each slide should have a clear title and 3-5 bullet points.
4. Bullet points should be concise and focused.
5. Ensure the slides flow logically to tell a coherent story.
6. Do not include any explanations outside the JSON structure.
7. Make sure the JSON is valid and properly formatted.
"""

PRESENTATION_HUMAN_TEMPLATE = """
Please convert the following text into a well-structured presentation:

{text}
"""

# Template for modifying a slide based on user feedback
SLIDE_MODIFICATION_SYSTEM_TEMPLATE = """
You are an expert presentation editor. Your task is to modify an existing presentation slide based on the user's instructions.
You'll receive the current slide content and the user's modification request. 
The output MUST be valid JSON for a modified slide with the same structure:
{{
    "title": "Modified Slide Title",
    "bullets": [
        {{"text": "First modified bullet point"}},
        {{"text": "Second modified bullet point"}},
        {{"text": "Third modified bullet point"}}
    ],
    "slide_id": "same-id-as-input"
}}

Guidelines:
1. Preserve the slide's original intent while implementing the requested changes.
2. Maintain a concise, engaging style for the title and bullets.
3. Keep bullet points focused and actionable.
4. Do not include any explanations outside the JSON structure.
5. Ensure the JSON is valid and properly formatted.
6. Retain the same slide_id that was provided in the input.
"""

SLIDE_MODIFICATION_HUMAN_TEMPLATE = """
Current slide content:
Title: {title}
Bullets:
{bullets}

Slide ID: {slide_id}

User's modification request: {user_prompt}

Please provide the modified slide content.
"""

def get_presentation_prompt_template():
    """Create and return a prompt template for generating presentations"""
    system_message_prompt = SystemMessagePromptTemplate.from_template(PRESENTATION_SYSTEM_TEMPLATE)
    human_message_prompt = HumanMessagePromptTemplate.from_template(PRESENTATION_HUMAN_TEMPLATE)
    
    return ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

def get_slide_modification_prompt_template():
    """Create and return a prompt template for modifying slides"""
    system_message_prompt = SystemMessagePromptTemplate.from_template(SLIDE_MODIFICATION_SYSTEM_TEMPLATE)
    human_message_prompt = HumanMessagePromptTemplate.from_template(SLIDE_MODIFICATION_HUMAN_TEMPLATE)
    
    return ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])
