from llama_index import (
    ServiceContext,
    VectorStoreIndex,
    StorageContext,
    load_indices_from_storage,
    SimpleDirectoryReader
)
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
# from llama_index.service_context import ServiceContext
from llama_index import ServiceContext
from llama_index import set_global_service_context
from llama_index.tools import QueryEngineTool, ToolMetadata
from llama_index.agent.react.base import ReActAgent

# llm = Ollama(model='bdx0/vietcuna')
embed_model = HuggingFaceEmbedding(model_name="keepitreal/vietnamese-sbert")

print(embed_model.get_text_embedding("Xin chào!"))
# service_context = ServiceContext.from_defaults(llm=llm, embed_model=embed_model)
# set_global_service_context(service_context=service_context)

# # Settings.
# documents = SimpleDirectoryReader("./data").load_data()
# vector_index = VectorStoreIndex.from_documents(documents=documents)
# query_engine = vector_index.as_query_engine()
# tools = [
#     QueryEngineTool(
#         query_engine=query_engine,
#         metadata=ToolMetadata(
#             name="sổ_tay_sinh_viên",
#             description="Sổ tay sinh viên chứa các thông tin các mục trong đại học dành cho sinh viên",
#         ),
#     ),
# ]

# # context = """Purpose: The primary role of this agent is to answer user's question using agent's tools."""

# agent_llm = ReActAgent.from_tools(
#     tools=tools,
#     llm=llm,
#     verbose=True,
#     # context=context,
# )

# while (prompt := input("Enter a prompt (q to quit): ")) != "q":
#     try:
#         result = agent_llm.query(prompt)
#     except Exception as e:
#         print(f"Error occured:", e)

