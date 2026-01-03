from pydantic import BaseModel
from typing import List, Optional

# Generic "Action Item" replacing specific terms like "Hold" or "Fine"
class ActionItem(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    type: str  # critical, warning, info
    resolved: bool = False

# Generic "Metric" replacing specific terms like "GPA" or "Credit Score"
class Metric(BaseModel):
    label: str
    value: str
    trend: Optional[str] = None # "up", "down", "neutral"
