
import os
import uuid
import datetime
from supabase import create_client

# Credentials from ednex.py
SUPABASE_URL = "https://rfkoylpcuptzkakmqotq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma295bHBjdXB0emtha21xb3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzY0MDYsImV4cCI6MjA4ODQxMjQwNn0.kcUD2GGSmMJLcG0tyJZtbCd9h9gB2S8jFYDz9RJKMe8"

# Note: The 'anon' key might not have permission unless RLS is disabled or appropriate policies exist.
# However, for simulation purposes in a dev project, we assume it's open or the user will provide a service key.

def seed_data():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # 1. Get a test student ID from mod00_users
    users_resp = supabase.table("mod00_users").select("id").limit(1).execute()
    if not users_resp.data:
        print("No users found in mod00_users. Cannot seed.")
        return
        
    student_id = users_resp.data[0]["id"]
    print(f"Seeding data for student: {student_id}")

    # 2. Update mod01_student_profiles with extra fields
    try:
        supabase.table("mod01_student_profiles").update({
            "dob": "2004-05-15",
            "gender": "Non-binary",
            "citizenship_status": "Citizen",
            "ethnicity": "Hispanic/Latino",
            "home_address": "123 University Way, Austin, TX 78701",
            "total_units_earned": 92.5
        }).eq("user_id", student_id).execute()
        print("Updated mod01_student_profiles")
    except Exception as e:
        print(f"Failed to update mod01: {e}")

    # 3. Insert Admissions Application (mod06)
    try:
        supabase.table("mod06_admissions_applications").insert({
            "user_id": student_id,
            "app_number": f"APP-{uuid.uuid4().hex[:8].upper()}",
            "admit_type": "Freshman",
            "status": "Admitted",
            "admit_term": "Fall 2026",
            "external_gpa": 3.92
        }).execute()
        print("Inserted mod06_admissions_applications")
    except Exception as e:
        print(f"Failed to insert mod06: {e}")

    # 4. Insert Degree Audit (mod07)
    try:
        supabase.table("mod07_degree_audits").insert([
            {"user_id": student_id, "requirement_name": "General Education - Quantitative", "status": "Met", "courses_applied": ["MATH101", "STAT200"]},
            {"user_id": student_id, "requirement_name": "Core Major Content", "status": "In Progress", "courses_applied": ["CS101", "CS201"]},
            {"user_id": student_id, "requirement_name": "Foreign Language", "status": "Not Met", "courses_applied": []}
        ]).execute()
        print("Inserted mod07_degree_audits")
    except Exception as e:
        print(f"Failed to insert mod07: {e}")

    # 5. Insert Aid Package (mod08)
    try:
        supabase.table("mod08_aid_packages").insert({
            "user_id": student_id,
            "aid_year": "2025-2026",
            "total_offered": 15000.00,
            "total_accepted": 12500.00,
            "total_disbursed": 6000.00,
            "status": "Partially Disbursed"
        }).execute()
        print("Inserted mod08_aid_packages")
    except Exception as e:
        print(f"Failed to insert mod08: {e}")

    # 6. Insert Contribution (mod09)
    try:
        supabase.table("mod09_contributions").insert({
            "user_id": student_id,
            "type": "Gift",
            "amount": 250.00,
            "designation": "Alumni Scholarship Fund",
            "contribution_date": datetime.datetime.now().isoformat()
        }).execute()
        print("Inserted mod09_contributions")
    except Exception as e:
        print(f"Failed to insert mod09: {e}")

if __name__ == "__main__":
    seed_data()
