#!/usr/bin/env python3
"""
Fix the airdrop service by adding the missing get_airdrops method
"""

import subprocess
import sys

def fix_airdrop_service():
    """Fix the airdrop service in the container"""
    
    # Remove the broken lines first
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sed", "-i", "/async def get_airdrops/d", "app/services/airdrop_service.py"
    ])
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sed", "-i", "/Get airdrops with optional status filter/d", "app/services/airdrop_service.py"
    ])
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sed", "-i", "/return await self.update_airdrops()/d", "app/services/airdrop_service.py"
    ])
    
    # Add the correct method
    method_content = '''    async def get_airdrops(self, status: Optional[str] = None) -> List[Dict]:
        """Get airdrops with optional status filter"""
        return await self.update_airdrops()
'''
    
    subprocess.run([
        "docker", "exec", "crypto-dashboard-backend", 
        "sh", "-c", f"echo '{method_content}' >> app/services/airdrop_service.py"
    ])
    
    print("✅ Airdrop service fixed")

if __name__ == "__main__":
    fix_airdrop_service() 