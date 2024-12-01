from dotenv import load_dotenv
from PyPDF2 import PdfReader
import os
import json
from langchain.prompts import ChatPromptTemplate
from langchain_openai.chat_models import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS

class UtilsSmartRecruit:
    """
    Utils for SmartRecruit
    """
    @staticmethod
    def get_pdf_text(pdf_docs):
        """
        Extract text from pdf files
        :param pdf_docs: list of pdf files
        :return: text extracted from pdf files
        """
        text = ""
        for pdf in pdf_docs:
            pdf_reader = PdfReader(pdf)
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text

    @staticmethod
    def json_to_dict(json_text):
        """
        Convert json text to dictionary
        :param json_text: json text
        :return: dictionary
        """
        return json.loads(json_text)

    @staticmethod
    def dict_to_json(dict_text):
        """
        Convert dictionary to json text
        :param dict_text: dictionary
        :return: json text
        """
        return json.dumps(dict_text)

    @staticmethod
    def get_text_chunks(text, chunk_size=1000, chunk_overlap=200):
        """
        Get text chunks
        """
        text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len
        )
        chunks = text_splitter.split_text(text)
        return chunks

    @staticmethod
    def get_vectorstore(text_chunks):
        """
        Get vectorstore
        """
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
        return vectorstore

class IASmartRecruit:
    def __init__(self, model_name="gpt-3.5-turbo"):
        load_dotenv()
        self.model = None
        self.parser = StrOutputParser()
        self.init_model(model_name)
        self.init_templates()
        self.init_chains()

    def init_model(self, model_name="gpt-3.5-turbo"):
        """
        Initialize model
        """
        self.model = ChatOpenAI(model=model_name, temperature=0.0)

    def init_templates(self):
        """
        Set default templates for the chatbot
        """
        skills_candidate_template = r""" 
        Given as context the full text of a candidate's resume (cv), please extract their competencies or skills and the number of years of experience for each. It is very important that you use the following template to answer, do not answer something else. If you cannot identify the person's skills, answer with an empty template. This is the template:
        {{
          "skills": [
            {{skill: skill name 1, years:1}},
            {{skill: skill name 2, years:3}}
          ]
        }}
        The cv is:
        -----
        {context}
        -----
        """
        self.prompt_skills_candidate = ChatPromptTemplate.from_template(skills_candidate_template)

        skills_offer_template = r""" 
        Given as context the full text of a job offer, please extract your competencies or skills and the number of years of experience required in each. It is very important that you use the following template to answer, do not answer something else. If you cannot identify the skills required please respond with an empty template. This is the template:
        {{
          "skills": [
            {{"skill": "skill name 1", "years":1}},
            {{"skill": "skill name 2", "years":3}}
          ]
        }}
        The offer is:
        -----
        {context}
        -----
        """
        self.prompt_skills_offer = ChatPromptTemplate.from_template(skills_offer_template)

        skills_comparation_template = r"""
        Given as context the skills of a candidate and the skills required in an offer, please answer which skills can be compatible, no matter if they are not written exactly the same or do not have the required number of years. It is important that you answer explicitly using the following template, do not answer something else or if you do not find compatibility return an empty template. Similarly, one of the variables is your estimation of how much compatibility there is between the candidate's skills and the required skills, answer in the variable "suitable": "1" if it is suitable or "0" if it is not. This is the template:
        {{
          "suitable":1,
          "skills": [
            {{"candidate_skill": "skill name 1", "offer_skill": "skill name 1", "suitable":1}},
            {{"candidate_skill": "skill name 2", "offer_skill": "skill name 2", "suitable":0}}
          ]
        }}
        candidate skills:
        -----
        {skills_candidate}
        -----
        offer skills:
        -----
        {skills_offer}
        -----
        """
        self.prompt_skills_comparation = ChatPromptTemplate.from_template(skills_comparation_template)        

        letter_template = r"""
        Given as context the cv of a candidate, and the text with the description of the offer and the name of the offering company. Please write a cover letter for the candidate that takes into account a brief summary of my experience, highlighting the key points for the offer. A short description of the position and showing how and why the candidate would be a perfect fit for the position. Also mention any additional skills or soft skills that may be relevant to the offer. All written in a professional, formal but enthusiastic tone. Also add my contact details.
        candidate's data:
        -----
        {data_candidate}
        -----
        the candidate's cv:
        -----
        {cv_candidate}
        -----
        the employer's data:
        -----
        {data_employer}
        -----
        the job description:
        -----
        {job_description}
        -----
        """
        self.prompt_letter = ChatPromptTemplate.from_template(letter_template)
        
    def init_chains(self):
        """
        Initialize the chain
        """
        self.chain_skills_candidate = self.prompt_skills_candidate | self.model | self.parser
        self.chain_skills_offer = self.prompt_skills_offer | self.model | self.parser
        self.chain_skills_comparation = self.prompt_skills_comparation | self.model | self.parser
        self.chain_letter = self.prompt_letter | self.model | self.parser

    def get_skills_from_candidate_cv(self, pdf_doc):
        """
        Get skills from candidate cv
        :param pdf_docs: list of pdf files
        :return: skills extracted from candidate cv
        """
        candidate_cv_text = UtilsSmartRecruit.get_pdf_text([pdf_doc])
        skills_candidate = self.chain_skills_candidate.invoke({"context" : candidate_cv_text})
        return UtilsSmartRecruit.json_to_dict(skills_candidate)
    
    def get_skills_from_offer(self, text):
        """
        Get skills from job offer
        :param text: text of job offer
        :return: skills extracted from job offer
        """
        skills_offer = self.chain_skills_offer.invoke({"context" : text})
        return UtilsSmartRecruit.json_to_dict(skills_offer)
    
    def get_skills_comparation(self, skills_candidate, skills_offer):
        """
        Get skills comparation
        :param skills_candidate: skills extracted from candidate cv
        :param skills_offer: skills extracted from job offer
        :return: skills comparation
        """
        if type(skills_candidate) == dict:
            skills_candidate = UtilsSmartRecruit.dict_to_json(skills_candidate)
        if type(skills_offer) == dict:
            skills_offer = UtilsSmartRecruit.dict_to_json(skills_offer)
        skills_comparation = self.chain_skills_comparation.invoke(
            {"skills_candidate" : skills_candidate, "skills_offer" : skills_offer})
        return UtilsSmartRecruit.json_to_dict(skills_comparation)
    
    def get_skills_comparation_no_ia(self, skills_candidate, skills_offer):
        """
        Get skills comparation Without using the IA chain
        :param skills_candidate: skills extracted from candidate cv
        :param skills_offer: skills extracted from job offer
        :return: skills comparation
        """
        skills_comparation = []
        for skill_candidate in skills_candidate["skills"]:
            for skill_offer in skills_offer["skills"]:
                if str(skill_candidate["skill"]).lower().strip() == str(skill_offer["skill"]).lower().strip():
                    skills_comparation.append({"candidate_skill": skill_candidate["skill"], "offer_skill": skill_offer["skill"], "suitable": 1})
        return {"suitable": 1 if len(skills_comparation) > 0 else 0, "skills": skills_comparation}
        
    def get_cover_letter(self, data_candidate, cv_candidate, data_employer, job_description):
        """
        Get cover letter
        :param data_candidate: candidate's data
        :param cv_candidate: candidate's cv
        :param data_employer: employer name
        :param job_description: job description
        :return: cover letter
        """
        cover_letter = self.chain_letter.invoke(
            {
                "data_candidate" : data_candidate, "cv_candidate" : cv_candidate,
                "data_employer" : data_employer, "job_description" : job_description
            })
        return cover_letter

class ChatSmartRecruit:
    def __init__(self, context:str, is_candidate:bool=True, model_name="gpt-3.5-turbo"):
        load_dotenv()
        self.model = None
        self.conversation_chain = None
        self.parser = StrOutputParser()
        self.init_model(model_name)
        self.init_templates()
        chunks = UtilsSmartRecruit.get_text_chunks(context)
        vectorstore = UtilsSmartRecruit.get_vectorstore(chunks)
        self.init_conversation_chain(vectorstore, model_name, 
            qa_prompt=self.prompt_chat_candidate if is_candidate else self.prompt_chat_recruiter)

    def init_model(self, model_name="gpt-3.5-turbo"):
        """
        Initialize model
        """
        self.model = ChatOpenAI(model=model_name, temperature=0.0)

    def init_templates(self):
        """
        Set default templates for the chatbot
        """
        chat_candidate_template = r"""
        Given the context of a candidate's cv, please respond to the same candidate on questions related to his/her cv and job opportunities or professional and academic development. Avoid answering questions that are not related to work or academic aspects. Respond in a cordial manner and if it is not related to work or study, please answer that you are not allowed to talk about those topics. 
        Respond to the user questions only based on the provided content.
        IF THE QUESTION, WHATSOEVER, IS NOT SIMILAR TO WHAT IS MENTIONED IN THE PROVIDED CONTEXT, PROVIDE SUGGESTIONS OF QUESTIONS THE USER CAN ASK AND RESPOND TO THEM.
        VERIFY THE RESPONSE AND RESPOND WHEN YOU ARE CONFIDENT THAT THE RESPONSE IS ACCURATE. ANYTHING OUTSIDE THE CONTEXT SHOULD BE NOTIFIED.

        -----
        {context}
        -----
        """

        chat_recruiter_template = r"""
        The user of this chat is a recruiter in charge of writing job offers for different companies. Please help him to improve the wording of an offer based on what he asks you, or help him with other topics related to recruitment or other job related issues. Avoid answering questions that are not related to work or academic aspects. 
        Respond in a cordial manner and if it is not related to work or study, please answer that you are not allowed to talk about those topics. 
        IF THE QUESTION, WHATSOEVER, IS NOT SIMILAR TO WHAT IS MENTIONED IN THE PROVIDED CONTEXT, PROVIDE SUGGESTIONS OF QUESTIONS THE USER CAN ASK AND RESPOND TO THEM.
        VERIFY THE RESPONSE AND RESPOND WHEN YOU ARE CONFIDENT THAT THE RESPONSE IS ACCURATE. ANYTHING OUTSIDE THE CONTEXT SHOULD BE NOTIFIED.

        -----
        {context}
        -----
        """
        general_user_template = "Question:```{question}```"

        messages_candidate = [
          SystemMessagePromptTemplate.from_template(chat_candidate_template),
          HumanMessagePromptTemplate.from_template(general_user_template)
        ]
        self.prompt_chat_candidate = ChatPromptTemplate.from_messages(messages_candidate)

        messages_recruiter = [
          SystemMessagePromptTemplate.from_template(chat_recruiter_template),
          HumanMessagePromptTemplate.from_template(general_user_template)
        ]
        self.prompt_chat_recruiter = ChatPromptTemplate.from_messages(messages_recruiter)
    
    def init_conversation_chain(self, vectorstore, model_name="gpt-3.5-turbo", qa_prompt=""):
        """
        Initialize the conversation chain        
        """
        llm = ChatOpenAI(model=model_name)
        memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
        self.conversation_chain = ConversationalRetrievalChain.from_llm(
            llm=llm, retriever=vectorstore.as_retriever(), memory=memory, 
            combine_docs_chain_kwargs={'prompt': qa_prompt})

    def handle_userinput(self, user_question):
        """
        Handle user input
        """
        if self.conversation_chain is None or self.model is None:
            raise Exception("Conversation chain or model is not initialized.")
        return self.conversation_chain.invoke({"question": user_question})

# Example of use
if __name__ == "__main__":
    # Create an instance of the class
    ia_smart_recruit = IASmartRecruit()
    # Path to the cv pdf file
    pdf_doc = os.path.join(os.path.dirname(__file__), "./CV_Jenny_Gomez-Azul.pdf")
    # Offer text
    text_offer = "Software Engineer position. Required skills: C#, Python, Java, SQL, Git"
    # Get skills from candidate cv
    skills_candidate = ia_smart_recruit.get_skills_from_candidate_cv(pdf_doc)
    # Get skills from job offer
    skills_offer = ia_smart_recruit.get_skills_from_offer(text_offer)
    # Using IA chain
    skills_comparation = ia_smart_recruit.get_skills_comparation(skills_candidate, skills_offer)
    # Without using IA chain
    #skills_comparation = ia_smart_recruit.get_skills_comparation_no_ia(skills_candidate, skills_offer)
    # Print result
    if skills_comparation["suitable"] == 1:
        print("\n =========== The candidate is suitable for the job offer 😀. ===========")
    else:
        print("\n =========== The candidate is not suitable for the job offer 😣. ===========")

    print("\nSkills comparation:")
    for skill in skills_comparation["skills"]:
        print(f"Skill: {skill['candidate_skill']} - Suitable: {'Yes' if skill['suitable'] == 1 else 'No'}")

    # Example of chat
    chat_smart_candidate = ChatSmartRecruit(
        context= UtilsSmartRecruit.get_pdf_text([pdf_doc]), is_candidate=True)
    question = ""
    while question != "exit":
        question = input("Ask a question: ")
        if question == "exit":
            print("Bye!")
            break
        response = chat_smart_candidate.handle_userinput(question)
        print(response['answer'])