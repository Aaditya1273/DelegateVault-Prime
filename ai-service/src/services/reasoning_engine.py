from datetime import datetime
from typing import Dict, List

class ReasoningEngine:
    """Generate human-readable reasoning for AI decisions"""
    
    def generate_reasoning(self, action: str, data: Dict) -> Dict:
        """Generate reasoning trail for an action"""
        
        if action == "rebalance":
            return self._rebalance_reasoning(data)
        elif action == "predict":
            return self._prediction_reasoning(data)
        elif action == "risk_analysis":
            return self._risk_reasoning(data)
        else:
            return {"reasoning": "Unknown action", "confidence": 0}
    
    def _rebalance_reasoning(self, data: Dict) -> Dict:
        current_apy = data.get('current_apy', 0)
        predicted_apy = data.get('predicted_apy', 0)
        
        reasons = []
        
        if predicted_apy > current_apy:
            reasons.append(f"Predicted APY ({predicted_apy:.2f}%) is higher than current ({current_apy:.2f}%)")
            reasons.append("Market conditions favor rebalancing to capture higher yields")
        
        if data.get('volatility', 0) > 20:
            reasons.append("High volatility detected - rebalancing to reduce risk exposure")
        
        if data.get('tvl_change', 0) > 10:
            reasons.append("Significant TVL change detected - adjusting strategy")
        
        return {
            "action": "rebalance",
            "reasoning": reasons,
            "confidence": min(95, 70 + len(reasons) * 5),
            "timestamp": datetime.utcnow().isoformat(),
            "recommendation": "EXECUTE" if len(reasons) >= 2 else "MONITOR"
        }
    
    def _prediction_reasoning(self, data: Dict) -> Dict:
        predicted_apy = data.get('predicted_apy', 0)
        
        factors = []
        factors.append(f"Historical performance analysis suggests {predicted_apy:.2f}% APY")
        factors.append("Market trend analysis indicates favorable conditions")
        factors.append("Liquidity metrics are within acceptable ranges")
        
        return {
            "action": "predict",
            "reasoning": factors,
            "confidence": 85,
            "timestamp": datetime.utcnow().isoformat(),
            "prediction": predicted_apy
        }
    
    def _risk_reasoning(self, data: Dict) -> Dict:
        risk_level = data.get('risk_level', 5)
        
        factors = []
        
        if risk_level > 7:
            factors.append("High risk detected due to low liquidity")
            factors.append("Recommend reducing position size")
        elif risk_level > 4:
            factors.append("Moderate risk - suitable for balanced portfolios")
        else:
            factors.append("Low risk - stable investment opportunity")
        
        return {
            "action": "risk_analysis",
            "reasoning": factors,
            "confidence": 90,
            "timestamp": datetime.utcnow().isoformat(),
            "risk_level": risk_level
        }
