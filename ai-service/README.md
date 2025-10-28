# DelegateVault AI Service

AI-powered yield prediction and strategy optimization for DelegateVault Prime.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ai-service
pip install -r requirements.txt
```

### 2. Run the Service

```bash
cd src
python main.py
```

Service runs on `http://localhost:8000`

## 📡 API Endpoints

### Health Check
```bash
GET http://localhost:8000/health
```

### Predict APY
```bash
POST http://localhost:8000/api/ai/predict-apy
Content-Type: application/json

{
  "address": "0x123...",
  "tvl": 100000,
  "current_apy": 5.5,
  "asset_symbol": "ETH"
}
```

### Analyze Risk
```bash
POST http://localhost:8000/api/ai/analyze-risk
Content-Type: application/json

{
  "address": "0x123...",
  "tvl": 100000,
  "current_apy": 5.5
}
```

### Generate Strategy
```bash
POST http://localhost:8000/api/ai/generate-strategy
Content-Type: application/json

{
  "vault_data": {
    "address": "0x123...",
    "tvl": 100000,
    "current_apy": 5.5
  },
  "user_preferences": {
    "risk_tolerance": "medium",
    "auto_rebalance": true,
    "max_slippage": 1.0
  }
}
```

### Should Rebalance
```bash
POST http://localhost:8000/api/ai/should-rebalance
Content-Type: application/json

{
  "vault_data": {
    "address": "0x123...",
    "tvl": 100000,
    "current_apy": 5.5
  },
  "user_preferences": {
    "risk_tolerance": "medium",
    "auto_rebalance": true
  }
}
```

## 🧠 Features

- **Yield Prediction**: Predict future APY based on vault metrics
- **Risk Analysis**: Analyze risk levels and volatility
- **Strategy Generation**: Generate optimal investment strategies
- **Reasoning Engine**: Human-readable explanations for AI decisions
- **Auto-Rebalancing**: Determine when to rebalance positions

## 🔧 Architecture

```
ai-service/
├── src/
│   ├── main.py              # FastAPI app
│   ├── routes/
│   │   └── ai_routes.py     # API endpoints
│   ├── services/
│   │   ├── yield_predictor.py    # Yield prediction
│   │   └── reasoning_engine.py   # Reasoning generation
│   └── models/              # (Future: ML models)
└── requirements.txt
```

## 📝 Notes

- This is a **simplified version for hackathon**
- Uses heuristics instead of real ML models
- In production, replace with actual PyTorch models
- Add real market data integration
- Implement proper model training pipeline

## 🎯 Next Steps

1. Integrate with backend API
2. Add real-time market data
3. Train actual ML models
4. Add model versioning
5. Implement A/B testing
