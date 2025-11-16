from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core_dashboard.database import get_db
from core_dashboard.models.security_policy import SecurityPolicy
from core_dashboard.schemas.security_policy import SecurityPolicy, SecurityPolicyCreate
from core_dashboard.utils.security import get_current_user

router = APIRouter(prefix="/api/security/policies", tags=["Security Policies"])

# Get all policies
@router.get("/", response_model=list[SecurityPolicy])
def get_policies(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return db.query(SecurityPolicy).all()

# Create new policy
@router.post("/", response_model=SecurityPolicy)
def create_policy(
    policy_data: SecurityPolicyCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    new_policy = SecurityPolicy(**policy_data.model_dump())
    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)
    return new_policy

# Toggle enable/disable
@router.put("/{policy_id}/toggle", response_model=SecurityPolicy)
def toggle_policy(
    policy_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    policy = db.query(SecurityPolicy).filter(SecurityPolicy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    policy.enabled = not policy.enabled
    db.commit()
    db.refresh(policy)
    return policy
