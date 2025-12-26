from sqlmodel import Session, select
from typing import List, Dict
from datetime import datetime, timedelta
from app.auth import engine
from app.models import Course

class MockLMS:
    """Mock Learning Management System Tool"""
    def get_student_grades(self, student_id: str) -> Dict:
        """Fetch actual grades from the database."""
        try:
            with Session(engine) as session:
                statement = select(Course).where(Course.user_id == int(student_id))
                courses = session.exec(statement).all()
                if not courses:
                    return {"Info": "No courses found. Please add courses in the Courses tab."}
                
                return {c.name: c.grade for c in courses}
        except Exception as e:
            return {"Error": f"Could not fetch grades: {str(e)}"}
    
    def get_upcoming_assignments(self, student_id: str) -> List[Dict]:
        return [
            {"course": "Chemistry 101", "assignment": "Lab Report", "due_date": (datetime.now() + timedelta(days=2)).isoformat()},
            {"course": "Calculus I", "assignment": "Midterm", "due_date": (datetime.now() + timedelta(days=5)).isoformat()}
        ]

class MockSchedulingTool:
    """Mock Scheduling/Calendar Tool"""
    def check_calendar(self, student_id: str) -> List[Dict]:
        return [
            {"event": "Counseling Session", "time": (datetime.now() + timedelta(days=1)).isoformat()},
            {"event": "Add/Drop Deadline", "time": (datetime.now() + timedelta(days=3)).isoformat()}
        ]

class RAGRetriever:
    """Mock RAG Retriever (Placeholder for ChromaDB implementation)"""
    def query(self, query_text: str, category: str = "general") -> str:
        # detailed mock responses based on category
        if category == "admin":
            if "drop" in query_text.lower():
                return "University Policy 3.1: Students may drop a course without penalty up to the 4th week of the semester. After that, a 'W' grade is recorded."
            if "financial aid" in query_text.lower():
                return "Financial Aid Handbook: Students must maintain a 2.0 GPA to remain eligible for federal aid."
        elif category == "wellness":
             return "Counseling Services are available 24/7. Walk-ins welcome at the Student Center, Room 302."
        elif category == "academic":
             return "Tutoring Center: Free math tutoring is available M-F 9am-5pm."
        
        return "No specific documents found."

# Instantiate global tools
lms_tool = MockLMS()
calendar_tool = MockSchedulingTool()
rag_tool = RAGRetriever()
