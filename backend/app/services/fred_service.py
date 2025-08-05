"""
FRED Service - Transformed from original api/services/fred-service.ts
Handles Federal Reserve economic data
"""

import httpx
import os
from typing import List, Dict, Optional
from datetime import datetime
from ..config import settings


class FredService:
    """Federal Reserve economic data service"""
    
    def __init__(self):
        self.fred_api_key = settings.FRED_API_KEY
        self.base_url = "https://api.stlouisfed.org/fred"
    
    async def get_federal_funds_rate(self) -> Dict:
        """Get current Federal Funds Rate - CORRIGIDO para usar API real"""
        try:
            print("🏦 Fetching Federal Funds Rate from FRED API...")
            
            # Verificar se temos API key válida
            if not self.fred_api_key:
                print("❌ No FRED API key configured")
                raise Exception("FRED API key not configured")
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/series/observations",
                    params={
                        "series_id": "FEDFUNDS",
                        "api_key": self.fred_api_key,
                        "file_type": "json",
                        "limit": "1",
                        "sort_order": "desc"
                    }
                )
                
                if response.status_code != 200:
                    print(f"❌ FRED API error: {response.status_code}")
                    raise Exception(f"FRED API returned status {response.status_code}")
                
                data = response.json()
                observations = data.get("observations", [])
                
                if not observations:
                    print("❌ No FRED data found in API response")
                    raise Exception("No FRED data available")
                
                latest = observations[0]
                rate = float(latest.get("value", 0))
                
                fed_rate_data = {
                    "rate": rate,
                    "date": latest.get("date", datetime.now().strftime("%Y-%m-%d")),
                    "change": 0.0  # Would need to calculate from previous value
                }
                
                print(f"✅ Federal Funds Rate: {rate}% from FRED API")
                return fed_rate_data
                
        except Exception as error:
            print(f"❌ Error fetching Federal Funds Rate: {error}")
            raise error
    
    def _get_mock_fed_rate(self) -> Dict:
        """Get mock Federal Funds Rate as fallback"""
        print("🏦 Using mock Federal Funds Rate...")
        return {
            "rate": 5.25,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "change": 0.25
        }
    
    async def get_rate_history(self, months: int = 12) -> List[Dict]:
        """Get Federal Funds Rate history - CORRIGIDO para usar API real"""
        try:
            print(f"📊 Fetching {months} months of Federal Funds Rate history...")
            
            # Verificar se temos API key válida
            if not self.fred_api_key:
                print("❌ No FRED API key configured")
                raise Exception("FRED API key not configured")
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/series/observations",
                    params={
                        "series_id": "FEDFUNDS",
                        "api_key": self.fred_api_key,
                        "file_type": "json",
                        "limit": str(months * 30),  # Approximate days
                        "sort_order": "desc"
                    }
                )
                
                if response.status_code != 200:
                    print(f"❌ FRED API error: {response.status_code}")
                    raise Exception(f"FRED API returned status {response.status_code}")
                
                data = response.json()
                observations = data.get("observations", [])
                
                if not observations:
                    print("❌ No FRED history found in API response")
                    raise Exception("No FRED history data available")
                
                # Processar dados reais
                rate_history = []
                for obs in observations[:months]:
                    try:
                        rate_history.append({
                            "date": obs.get("date", ""),
                            "rate": float(obs.get("value", 0))
                        })
                    except Exception as error:
                        print(f"❌ Error processing rate observation: {error}")
                
                print(f"✅ Retrieved {len(rate_history)} months of rate history from FRED")
                return rate_history
                
        except Exception as error:
            print(f"❌ Error fetching rate history: {error}")
            raise error
    
    def _get_mock_rate_history(self, months: int = 12) -> List[Dict]:
        """Get mock rate history as fallback"""
        print("📊 Using mock rate history...")
        return [
            {"date": "2024-01-01", "rate": 5.00},
            {"date": "2024-02-01", "rate": 5.25},
        ]
    
    async def get_all_indicators(self) -> List[Dict]:
        """Get all FRED indicators - CORRIGIDO para usar API real"""
        try:
            print("📈 Fetching FRED indicators...")
            
            # Verificar se temos API key válida
            if not self.fred_api_key:
                print("❌ No FRED API key configured")
                raise Exception("FRED API key not configured")
            
            # Buscar múltiplos indicadores
            indicators = []
            
            # Federal Funds Rate
            fed_rate = await self.get_federal_funds_rate()
            if fed_rate:
                indicators.append({
                    "id": "fed-001",
                    "title": "Federal Funds Rate",
                    "type": "rate_decision",
                    "content": f"The Federal Reserve maintains the target rate at {fed_rate['rate']}%",
                    "interestRate": fed_rate["rate"],
                    "publishedAt": datetime.now().isoformat(),
                    "createdAt": datetime.now().isoformat()
                })
            
            # GDP Growth Rate
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.get(
                        f"{self.base_url}/series/observations",
                        params={
                            "series_id": "GDP",
                            "api_key": self.fred_api_key,
                            "file_type": "json",
                            "limit": "1",
                            "sort_order": "desc"
                        }
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        observations = data.get("observations", [])
                        if observations:
                            gdp_value = float(observations[0].get("value", 0))
                            indicators.append({
                                "id": "fed-002",
                                "title": "GDP Growth Rate",
                                "type": "economic_indicator",
                                "content": f"Current GDP growth rate: {gdp_value}%",
                                "interestRate": None,
                                "publishedAt": datetime.now().isoformat(),
                                "createdAt": datetime.now().isoformat()
                            })
            except Exception as error:
                print(f"❌ Error fetching GDP data: {error}")
            
            if not indicators:
                print("❌ No indicators found in API responses")
                raise Exception("No FRED indicators data available")
            
            print(f"✅ Retrieved {len(indicators)} indicators from FRED")
            return indicators
            
        except Exception as error:
            print(f"❌ Error fetching FRED indicators: {error}")
            raise error
    
    def _get_mock_indicators(self) -> List[Dict]:
        """Get mock FRED indicators as fallback"""
        print("📈 Using mock FRED indicators...")
        return [
            {
                "id": "fed-001",
                "title": "Federal Funds Rate Decision",
                "type": "rate_decision",
                "content": "The Federal Reserve decided to maintain rates at 5.25%",
                "interestRate": 5.25,
                "publishedAt": datetime.now().isoformat(),
                "createdAt": datetime.now().isoformat()
            }
        ]