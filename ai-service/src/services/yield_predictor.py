import random
from typing import Dict, List

class YieldPredictor:
    """Simple yield prediction for hackathon - uses mock data"""
    
    def predict_apy(self, vault_data: Dict) -> float:
        """Predict APY for a vault based on simple heuristics"""
        # Mock prediction - in production this would use ML model
        base_apy = 5.0
        
        # Add randomness for demo
        volatility = random.uniform(-2, 3)
        
        # Factor in TVL (higher TVL = slightly lower APY due to competition)
        tvl = float(vault_data.get('tvl', 0))
        tvl_factor = -0.1 if tvl > 1000000 else 0.5
        
        predicted_apy = base_apy + volatility + tvl_factor
        return max(0, min(predicted_apy, 50))  # Cap between 0-50%
    
    def analyze_risk(self, vault_data: Dict) -> Dict:
        """Analyze risk metrics"""
        tvl = float(vault_data.get('tvl', 0))
        
        # Simple risk scoring
        if tvl < 10000:
            risk_score = "HIGH"
            risk_level = 8
        elif tvl < 100000:
            risk_score = "MEDIUM"
            risk_level = 5
        else:
            risk_score = "LOW"
            risk_level = 2
        
        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "volatility": random.uniform(5, 25),
            "liquidity_score": min(100, tvl / 1000)
        }
    
    def generate_strategy(self, vault_data: Dict, user_preferences: Dict) -> Dict:
        """Generate investment strategy"""
        risk_tolerance = user_preferences.get('risk_tolerance', 'medium')
        
        strategies = {
            'low': {
                'allocation': {'stable': 70, 'growth': 20, 'high_risk': 10},
                'rebalance_frequency': 'weekly',
                'max_slippage': 0.5
            },
            'medium': {
                'allocation': {'stable': 40, 'growth': 40, 'high_risk': 20},
                'rebalance_frequency': 'daily',
                'max_slippage': 1.0
            },
            'high': {
                'allocation': {'stable': 20, 'growth': 30, 'high_risk': 50},
                'rebalance_frequency': 'hourly',
                'max_slippage': 2.0
            }
        }
        
        return strategies.get(risk_tolerance, strategies['medium'])
