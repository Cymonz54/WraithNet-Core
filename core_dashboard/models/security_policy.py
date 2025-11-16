from sqlalchemy import Column, Integer, String, Boolean
from core_dashboard.database import Base

class SecurityPolicy(Base):
    __tablename__ = "security_policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    enabled = Column(Boolean, default=True)
