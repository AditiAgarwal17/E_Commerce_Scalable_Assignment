from pydantic import BaseModel

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    mobile: str

    model_config = {"from_attributes": True}
