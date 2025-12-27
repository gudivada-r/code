import os
import sys

# Add the project root and backend directory to sys.path for Vercel deployment
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)
sys.path.append(os.path.join(root_dir, "backend"))

from backend.app.main import app
