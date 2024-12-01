from fastapi import APIRouter, HTTPException
from app.database import get_snowflake_connection
from app.services.ia_smart_recruit import ChatSmartRecruit, UtilsSmartRecruit
from app.session import session_data

router = APIRouter()
chat_smart_candidate = None
chat_smart_recruiter = None

@router.get("/candidat")
def get_answer_candidat(candidat_id: int, question: str):
    """
    Response candidat questions
    Args:
        candidat_id (int): _description_
        question (str): _description_
    """
    if 'chat_smart_candidate' not in session_data:
        conn = get_snowflake_connection()
        #try:
        cursor = conn.cursor()
        query = """
        Select url_pdf, 'firstname: ' || u.nom || ', lastname: ' || u.prenom || ', email: ' || u.email as data_utilisateur
        from SMARTRECRUIT_DB.SMARTRECRUIT_SCHEMA.utilisateurs u
        inner join SMARTRECRUIT_DB.SMARTRECRUIT_SCHEMA.cvs c on c.utilisateur_id = u.id
        WHERE UTILISATEUR_ID = %s
        """
        cursor.execute(query, (candidat_id,))
        results = cursor.fetchall()
        url_pdf = results[0][0]
        
        chat_smart_candidate = ChatSmartRecruit(
            context= UtilsSmartRecruit.get_pdf_text([url_pdf]), is_candidate=True)
        session_data['chat_smart_candidate'] = chat_smart_candidate
        #except Exception as e:
        #    raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")
        #finally:
        conn.close()
    
    chat_smart_candidate = session_data['chat_smart_candidate']
    response = chat_smart_candidate.handle_userinput(question)
    return response

@router.get("/recruiter")
def get_answer_recruiter(recruiter_id: int, question: str):
    """
    Response recruiter questions
    Args:
        recruiter_id (int): _description_
        question (str): _description_
    """
    if 'chat_smart_recruiter' not in session_data:
        context = question #"I'am recruiter, could you help me to write a new offer."
        chat_smart_recruiter = ChatSmartRecruit(context=context, is_candidate=False)
        session_data['chat_smart_recruiter'] = chat_smart_recruiter
    
    chat_smart_recruiter = session_data['chat_smart_recruiter']
    response = chat_smart_recruiter.handle_userinput(question)
    return response
