from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

# ---- Schemas ----
class Policy(BaseModel):
    id: int
    name: str
    description: str
    enabled: bool

# ---- In-memory store (temporary) ----
policies_db: List[Policy] = [
    Policy(id=1, name="Block Port Scans", description="Detect and block network port scans", enabled=True),
    Policy(id=2, name="Prevent Unauthorized Access", description="Deny repeated failed login attempts", enabled=True),
]


# ---- Endpoints ----
@router.get("/", response_model=List[Policy])
def list_policies():
    """Get all policies"""
    return policies_db


@router.get("/{policy_id}", response_model=Policy)
def get_policy(policy_id: int):
    """Get policy by ID"""
    for policy in policies_db:
        if policy.id == policy_id:
            return policy
    raise HTTPException(status_code=404, detail="Policy not found")


@router.post("/", response_model=Policy)
def create_policy(policy: Policy):
    """Add a new policy"""
    policies_db.append(policy)
    return policy


@router.put("/{policy_id}", response_model=Policy)
def update_policy(policy_id: int, updated: Policy):
    """Update an existing policy"""
    for idx, policy in enumerate(policies_db):
        if policy.id == policy_id:
            policies_db[idx] = updated
            return updated
    raise HTTPException(status_code=404, detail="Policy not found")


@router.delete("/{policy_id}")
def delete_policy(policy_id: int):
    """Delete a policy"""
    for idx, policy in enumerate(policies_db):
        if policy.id == policy_id:
            del policies_db[idx]
            return {"message": f"Policy {policy_id} deleted"}
    raise HTTPException(status_code=404, detail="Policy not found")
