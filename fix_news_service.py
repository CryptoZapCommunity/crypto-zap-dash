#!/usr/bin/env python3
"""
Fix the news service by adding the missing get_news method
"""

import subprocess
import sys

def fix_news_service():
    """Fix the news service in the container"""
    
    # The correct content to add
    method_content = '''    async def get_news(self, limit: int = 20, category: Optional[str] = None) -> List[Dict]:
        """Get news data - wrapper for update_general_news"""
        return await self.update_general_news(category, limit)
'''
    
    # Remove the broken lines first
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sed", "-i", "/async def get_news/d", "app/services/news_service.py"
    ])
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sed", "-i", "/Get news data - wrapper/d", "app/services/news_service.py"
    ])
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sed", "-i", "/return await self.update_general_news(category, limit)/d", "app/services/news_service.py"
    ])
    
    # Add the correct method
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sh", "-c", f"echo '{method_content}' >> app/services/news_service.py"
    ])
    
    print("✅ News service fixed")

if __name__ == "__main__":
    fix_news_service() 