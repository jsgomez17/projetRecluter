class Utilisateur:
    def __init__(self, id: int, nom: str,prenom: str, email: str, mot_de_passe: str, profil_id: int, plan_id: int):
        self.id = id
        self.nom = nom
        self.prenom = prenom
        self.email = email
        self.mot_de_passe = mot_de_passe
        self.profil_id = profil_id
        self.plan_id = plan_id
