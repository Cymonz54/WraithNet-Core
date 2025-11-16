from pydantic import BaseModel

class SecurityPolicyBase(BaseModel):
    name: str
    description: str | None = None
    enabled: bool = True

class SecurityPolicyCreate(SecurityPolicyBase):
    pass

class SecurityPolicy(SecurityPolicyBase):
    id: int

    class Config:
        from_attributes = True  # replaces orm_mode in Pydantic v2
