#!/usr/bin/env python3
"""
Fix the economic service by adding the missing get_economic_events method
"""

import subprocess
import sys

def fix_economic_service():
    """Fix the economic service in the container"""
    
    # Remove the broken lines first
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sed", "-i", "/async def get_economic_events/d", "app/services/economic_service.py"
    ])
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sed", "-i", "/Get economic events for the specified number of days/d", "app/services/economic_service.py"
    ])
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sed", "-i", "/return await self.update_economic_calendar()/d", "app/services/economic_service.py"
    ])
    
    # Add the correct method
    method_content = '''    async def get_economic_events(self, days: int = 7) -> List[Dict]:
        """Get economic events for the specified number of days"""
        return await self.update_economic_calendar()
'''
    
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sh", "-c", f"echo '{method_content}' >> app/services/economic_service.py"
    ])
    
    print("✅ Economic service fixed")

if __name__ == "__main__":
    fix_economic_service() 