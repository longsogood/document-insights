from llama_index.llms.ollama import Ollama
# from llama_parse.parse import LlamaParse
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext, set_global_service_context
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from sentence_transformers import SentenceTransformer
from llama_index.tools import QueryEngineTool, ToolMetadata
from llama_index.agent import ReActAgent
from pydantic import BaseModel
# from llama_index
# from llama_index.core.output_parsers import PydanticOutputParser
# from llama_index.core.query_pipeline import QueryPipeline
from app.temp_documents.prompt import context, code_parser_template
from llama_index.text_splitter import TokenTextSplitter
from transformers import AutoTokenizer 
# from .code_reader import code_reader
# from dotenv import load_dotenv
import os
import ast

# load_dotenv()

llm = Ollama(model="bdx0/vietcuna:7B")
embed_model = HuggingFaceEmbedding('dangvantuan/vietnamese-embedding')
text_splitter = TokenTextSplitter(chunk_size=300,
                                  chunk_overlap=20,
                                  )
service_context = ServiceContext.from_defaults(llm=llm, embed_model=embed_model, text_splitter=text_splitter)
# set_global_service_context(service_context=service_context)
# parser = LlamaParse(result_type="markdown")

# file_extractor = {".pdf": parser}
documents = SimpleDirectoryReader("app/temp_documents/data").load_data()
# print(documents)

# embed_model.
# embeddings = embed_model.get_text_embedding("Hello World!")
# print(len(embeddings))



vector_index = VectorStoreIndex.from_documents(documents, service_context=service_context, show_progress=True)
# print(vector_index._get_node_with_embedding())
query_engine = vector_index.as_chat_engine()
prompt = input("Nhập câu hỏi: ")
print("====Query====")
complation = query_engine.query(prompt)
print(complation)
# tools = [
#     QueryEngineTool(
#         query_engine=query_engine,
#         metadata=ToolMetadata(
#             name="sổ_tay_sinh_viên",
#             description="Sổ tay sinh viên chứa các thông tin các mục trong đại học dành cho sinh viên",
#         ),
#     ),
#     # code_reader,
# ]

# # code_llm = Ollama(model="codellama")
# agent = ReActAgent.from_tools(tools,
#                                llm=llm, 
#                               verbose=True, 
#                             #   context=context
#                               )


# class CodeOutput(BaseModel):
#     code: str
#     description: str
#     filename: str


# # parser = PydanticOutputParser(CodeOutput)
# # json_prompt_str = parser.format(code_parser_template)
# # json_prompt_tmpl = PromptTemplate(json_prompt_str)
# # output_pipeline = QueryPipeline(chain=[json_prompt_tmpl, llm])

# while (prompt := input("Enter a prompt (q to quit): ")) != "q":
#     retries = 0

#     while retries < 3:
#         try:
#             result = agent.query(prompt)
#             # next_result = output_pipeline.run(response=result)
#             # cleaned_json = ast.literal_eval(str(next_result).replace("assistant:", ""))
#             # break
#         except Exception as e:
#             retries += 1
#             print(f"Error occured, retry #{retries}:", e)

#     if retries >= 3:
#         print("Unable to process request, try again...")
#         continue

#     print("Code generated")
    # print(cleaned_json["code"])
    # print("\n\nDesciption:", cleaned_json["description"])

    # filename = cleaned_json["filename"]

    # try:
    #     with open(os.path.join("output", filename), "w") as f:
    #         f.write(cleaned_json["code"])
    #     print("Saved file", filename)
    # except:
    #     print("Error saving file...")