
import sys
import os
backend_path = os.path.join(os.getcwd(), '3_code', 'backend')
sys.path.insert(0, backend_path)

from app.agent.graph import PrivacyGateway

def test_privacy():
    gateway = PrivacyGateway()
    test_text = "My name is John Doe and my email is john.doe@example.com. My phone number is 555-123-4567. My student ID is 123e4567-e89b-12d3-a456-426614174000."
    
    masked = gateway.mask(test_text)
    print("Original:", test_text)
    print("Masked:", masked)
    
    unmasked = gateway.unmask(masked)
    print("Unmasked:", unmasked)
    
    assert "John Doe" not in masked
    assert "john.doe@example.com" not in masked
    assert "555-123-4567" not in masked
    assert "123e4567-e89b-12d3-a456-426614174000" not in masked
    assert "John Doe" in unmasked
    assert "john.doe@example.com" in unmasked
    assert "555-123-4567" in unmasked
    
    print("\nPrivacy test passed!")

if __name__ == "__main__":
    test_privacy()
