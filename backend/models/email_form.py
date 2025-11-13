from pydantic import BaseModel, EmailStr, constr

class EmailForm(BaseModel):
    name: str = Form(...)
    email: EmailStr = Form(...)
    phone: str = Form(...)
    about: str = Form(...)
    file: UploadFile | None = File(None)