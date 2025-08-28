from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
import os

# Chroma path
CHROMA_PATH = 'chroma/policies'
model_name = "sentence-transformers/all-mpnet-base-v2"
embeddings = HuggingFaceEmbeddings(model_name=model_name)

# Loop through all text files in policies folder
for file_name in os.listdir(CHROMA_PATH):
    if file_name.endswith(".txt"):
        policy_name = file_name.replace(".txt", "")
        file_path = os.path.join(CHROMA_PATH, file_name)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Create Chroma collection and add text
        db = Chroma(
            persist_directory=CHROMA_PATH,
            embedding_function=embeddings,
            collection_name=policy_name
        )
        db.add_texts([content])  # ✅ just add texts, no persist() needed

        print(f"Loaded {file_name} into Chroma as collection '{policy_name}'")
