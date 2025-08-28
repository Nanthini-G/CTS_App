# backend/chatbot.py

import os
from dotenv import load_dotenv

# Load Groq API key from .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
groq_api = os.getenv('GROQ_API_KEY')

from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from groq import Groq

# Initialize Groq client
client = Groq(api_key=groq_api)

# Initialize embeddings
model_name = "sentence-transformers/all-mpnet-base-v2"
embeddings = HuggingFaceEmbeddings(model_name=model_name)

# Chroma path (ensure this folder exists)
CHROMA_PATH = os.path.join(os.path.dirname(__file__), 'chroma', 'policies')


def query_assist(user_query, policy_name, conversation_history=None, profile_summary=""):
    """
    Query the insurance policy documents via Chroma embeddings 
    and generate a response using Groq LLM.
    """
    if conversation_history is None:
        conversation_history = []

    # Load Chroma collection
    query_db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings,
        collection_name=policy_name
    )

    # Search for top 4 similar documents
    results = query_db.similarity_search_with_score(user_query, k=4)
    context = "\n\n---\n\n".join([doc.page_content for doc, _score in results])

    # Prepare conversation history
    history = ""
    for entry in conversation_history:
        history += f"User: {entry.get('user','')}\nBot: {entry.get('model','')}\n\n"

    # Call Groq API with a valid model
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful health insurance patient helpdesk bot. "
                    "Provide an answer only to the asked query of the user based on the provided content of the insurance policy. "
                    "Don't hallucinate and don't include content like 'based on previous conversation or based on the document'. "
                    "Keep it straightforward."
                )
            },
            {"role": "system", "content": context},
            {"role": "system", "content": f"User summary: {profile_summary}"},
            {"role": "user", "content": history + f"User: {user_query}"},
        ],
        model="llama-3.3-70b-versatile",  # Active model from your Groq account
    )

    output = chat_completion.choices[0].message.content
    return output
