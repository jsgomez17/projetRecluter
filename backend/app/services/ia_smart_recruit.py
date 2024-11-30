from dotenv import load_dotenv
from PyPDF2 import PdfReader
import os
import json
from langchain.prompts import ChatPromptTemplate
from langchain_openai.chat_models import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

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
        
    def init_chains(self):
        """
        Initialize the chain
        """
        self.chain_skills_candidate = self.prompt_skills_candidate | self.model | self.parser
        self.chain_skills_offer = self.prompt_skills_offer | self.model | self.parser
        self.chain_skills_comparation = self.prompt_skills_comparation | self.model | self.parser

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