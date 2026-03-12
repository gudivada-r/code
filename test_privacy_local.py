
import re

class PrivacyGateway:
    """
    Handles PII (Personally Identifiable Information) scrubbing and restoration.
    Ensures that sensitive data is tokenized before leaving the university perimeter.
    """
    def __init__(self, student_context: dict):
        self.student_context = student_context
        self.mapping = {}
        self.reverse_mapping = {}

    def tokenize(self, text: str) -> str:
        """Replace sensitive terms with durable tokens."""
        scrubbed_text = text
        
        # 1. Scrub Student Name
        name = self.student_context.get('name')
        if name:
            token = "[[STUDENT_NAME]]"
            self.mapping[name] = token
            self.reverse_mapping[token] = name
            scrubbed_text = re.sub(re.escape(name), token, scrubbed_text, flags=re.IGNORECASE)
            
            parts = name.split()
            if len(parts) > 1:
                first_name = parts[0]
                self.mapping[first_name] = "[[STUDENT_FIRST_NAME]]"
                self.reverse_mapping["[[STUDENT_FIRST_NAME]]"] = first_name
                scrubbed_text = re.sub(re.escape(first_name), "[[STUDENT_FIRST_NAME]]", scrubbed_text, flags=re.IGNORECASE)

        # 2. Scrub Emails 
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        emails = re.findall(email_pattern, scrubbed_text)
        for email in emails:
            token = f"[[EMAIL_{hash(email) % 1000}]]"
            self.mapping[email] = token
            self.reverse_mapping[token] = email
            scrubbed_text = scrubbed_text.replace(email, token)

        # 3. Scrub UUIDs (Common in Supabase/EdNex)
        uuid_pattern = r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
        uuids = re.findall(uuid_pattern, scrubbed_text, flags=re.IGNORECASE)
        for uid in uuids:
            token = f"[[ID_{hash(uid) % 1000}]]"
            self.mapping[uid] = token
            self.reverse_mapping[token] = uid
            scrubbed_text = scrubbed_text.replace(uid, token)

        # 4. Scrub Phone Numbers
        phone_pattern = r'(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}'
        phones = re.findall(phone_pattern, scrubbed_text)
        for phone in phones:
            token = "[[PHONE_NUMBER]]"
            scrubbed_text = scrubbed_text.replace(phone, token)

        return scrubbed_text

    def detokenize(self, text: str) -> str:
        """Restore PII from tokens in the LLM response."""
        restored_text = text
        for token, original in self.reverse_mapping.items():
            restored_text = restored_text.replace(token, original)
        return restored_text

def test_privacy():
    ctx = {"name": "John Doe"}
    gateway = PrivacyGateway(ctx)
    test_text = "Hello John Doe, your email is john.doe@example.com and your ID is 123e4567-e89b-12d3-a456-426614174000. Call us at 555-123-4567."
    
    masked = gateway.tokenize(test_text)
    print("Original:", test_text)
    print("Masked:", masked)
    
    unmasked = gateway.detokenize(masked)
    print("Unmasked:", unmasked)
    
    assert "John Doe" not in masked
    assert "john.doe@example.com" not in masked
    assert "123e4567-e89b-12d3-a456-426614174000" not in masked
    # Note: Phone number pattern is simple and replaces with a generic token
    assert "555-123-4567" not in masked
    
    assert "John Doe" in unmasked
    # Emails and IDs use hashed tokens, but detokenization should restore them
    assert "john.doe@example.com" in unmasked
    assert "123e4567-e89b-12d3-a456-426614174000" in unmasked
    
    print("\nPrivacy test passed!")

if __name__ == "__main__":
    test_privacy()
