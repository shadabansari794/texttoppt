# Text to PowerPoint Converter

This application converts text input into structured PowerPoint presentations using AI. It consists of a FastAPI backend that uses LangChain and OpenAI's GPT models to generate presentation content, and a React frontend that displays and lets you edit the generated slides.

## Project Structure

```
texttoppt/
├── backend/                        # FastAPI backend
│   ├── app/                       # Application package
│   │   ├── api/                  # API module
│   │   │   ├── routes/         # API endpoints
│   │   │   │   └── presentation.py # Presentation endpoints
│   │   ├── core/                # Core configurations
│   │   │   └── config.py       # Environment settings
│   │   ├── llm/                 # LLM integration
│   │   │   └── chains.py       # LangChain configurations
│   │   ├── prompts/             # Prompt templates
│   │   │   └── templates.py    # LLM prompt templates
│   │   ├── schemas/            # Data models
│   │   │   └── presentation.py # Presentation schema
│   │   └── services/           # Business logic
│   │       └── ppt_service.py  # PowerPoint generation service
│   ├── main.py                  # Application entry point
│   └── requirements.txt         # Python dependencies
└── frontend/                     # React/TypeScript frontend
    ├── src/
    │   ├── components/          # UI components
    │   │   └── PresentationViewer.tsx # Slide viewer
    │   ├── lib/                 # Utility functions
    │   │   └── api.ts           # API service
    │   └── pages/               # Application pages
    │       └── Index.tsx        # Main page
    └── package.json             # Frontend dependencies
```

## Setup and Running

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key
   MODEL_NAME=gpt-3.5-turbo-16k  # Or another OpenAI model
   ```

4. Start the backend server:
   ```
   uvicorn main:app --reload
   ```

The backend will be available at http://localhost:8000

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
3. Fix TypeScript errors (if needed):
   ```
   npm install --save-dev @types/react @types/lucide-react
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at http://localhost:5173 (or another port if 5173 is in use)

## API Usage

### Generate Presentation

**Endpoint**: `POST /api/v1/presentation/generate`

**Request Format**:
```json
{
  "text": "Explain Artificial Intelligence and its applications in daily life"
}
```

**Response Format**:
```json
{
  "title": "Artificial Intelligence in Daily Life",
  "slides": [
    {
      "title": "What is Artificial Intelligence?",
      "bullets": [
        {"text": "AI is the simulation of human intelligence in machines"},
        {"text": "Focuses on creating systems that can think and learn"},
        {"text": "Uses algorithms and data to make decisions"}
      ],
      "slide_id": "slide1"
    },
    // More slides...
  ]
}
```

### Modify Slide Content

**Endpoint**: `POST /api/v1/presentation/modify-slide`

**Request Format**:
```json
{
  "slide_id": "slide1",
  "instruction": "Make the content more detailed and add a point about neural networks",
  "presentation": { /* Full presentation object */ }
}
```

### Download Presentation

**Endpoint**: `POST /api/v1/presentation/download`

Downloads a properly formatted PowerPoint (.pptx) file with consistent styling.

## Frontend Features

- Input text area for pasting content
- Presentation generation with a single click
- Slide preview and navigation with proper styling
- Direct PowerPoint (.pptx) download with consistent formatting
- Ability to modify individual slides with natural language instructions
- Real-time presentation preview
- Toast notifications for user feedback
- Responsive design for various screen sizes

## Troubleshooting

### Common TypeScript Errors

If you encounter TypeScript errors like:

- Cannot find module 'react' or its corresponding type declarations
- Cannot find module 'lucide-react' or its corresponding type declarations
- This JSX tag requires the module path 'react/jsx-runtime' to exist

Run the following command in the frontend directory:

```
npm install --save-dev @types/react @types/node typescript
```

### Backend Connection Issues

If the frontend cannot connect to the backend:

1. Ensure the backend is running on http://localhost:8000
2. Check for CORS issues in the browser console
3. Verify that the API URL in `frontend/src/lib/api.ts` is correct

### Screenshots
![txt2ppt1](https://github.com/user-attachments/assets/f3e3a836-21ee-416c-b894-f7542bbb9cea)
![text2ppt2](https://github.com/user-attachments/assets/d806523d-be06-4895-b87a-345d478d55f1)
![text2ppt3](https://github.com/user-attachments/assets/a8ae8884-f1ca-4d99-9e1c-e3ecfebed4cb)
![image](https://github.com/user-attachments/assets/49878158-4f40-4670-b859-cbc7cdac2261)

