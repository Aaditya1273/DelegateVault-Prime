from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional
import sys
sys.path.append('..')

from services.yield_predictor import YieldPredictor
from services.reasoning_engine import ReasoningEngine
from services.pytorch_predictor import pytorch_predictor

router = APIRouter()

# Initialize services
yield_predictor = YieldPredictor()
reasoning_engine = ReasoningEngine()

# Request models
class VaultData(BaseModel):
    address: str
    tvl: Optional[float] = 0
    current_apy: Optional[float] = 0
    asset_symbol: Optional[str] = "ETH"

class UserPreferences(BaseModel):
    risk_tolerance: str = "medium"
    auto_rebalance: bool = True
    max_slippage: float = 1.0

class RebalanceRequest(BaseModel):
    vault_data: VaultData
    user_preferences: UserPreferences

# Routes
@router.post("/predict-apy")
async def predict_apy(vault_data: VaultData):
    """Predict APY for a vault using PyTorch ML model"""
    try:
        # Use PyTorch predictor for production-grade predictions
        prediction = pytorch_predictor.predict_apy(vault_data.dict())
        
        reasoning = reasoning_engine.generate_reasoning("predict", {
            "predicted_apy": prediction['predicted_apy']
        })
        
        return {
            **prediction,
            "reasoning": reasoning,
            "vault_address": vault_data.address,
            "ml_model": "PyTorch LSTM-Attention"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-risk")
async def analyze_risk(vault_data: VaultData):
    """Analyze risk for a vault using PyTorch ML model"""
    try:
        # Use PyTorch predictor for risk analysis
        risk_analysis = pytorch_predictor.predict_risk_score(vault_data.dict())
        
        reasoning = reasoning_engine.generate_reasoning("risk_analysis", risk_analysis)
        
        return {
            "risk_analysis": risk_analysis,
            "reasoning": reasoning,
            "vault_address": vault_data.address,
            "ml_model": "PyTorch Ensemble"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-strategy")
async def generate_strategy(request: RebalanceRequest):
    """Generate investment strategy using PyTorch ML model"""
    try:
        # Use PyTorch predictor for strategy generation
        strategy = pytorch_predictor.generate_strategy(
            request.vault_data.dict(),
            request.user_preferences.dict()
        )
        
        return {
            "strategy": strategy,
            "vault_address": request.vault_data.address,
            "user_preferences": request.user_preferences.dict(),
            "ml_model": "PyTorch Strategy Generator"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/should-rebalance")
async def should_rebalance(request: RebalanceRequest):
    """Determine if vault should be rebalanced using PyTorch ML model"""
    try:
        vault_dict = request.vault_data.dict()
        
        # Use PyTorch predictor for rebalancing decision
        rebalance_decision = pytorch_predictor.should_rebalance(vault_dict, {})
        
        return {
            **rebalance_decision,
            "vault_address": request.vault_data.address,
            "ml_model": "PyTorch Rebalance Optimizer"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
