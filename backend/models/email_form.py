from pydantic import BaseModel, EmailStr, constr

class EmailForm(BaseModel):
    # name:constr(min_length=0, max_length=25)
    name: str
    email:str
    # phone:constr(min_length=1,max_length=18)
    phone:str
    about:str
