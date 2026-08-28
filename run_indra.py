"""
INDRA Master Startup Script
Launches the FastAPI backend and provides development server runner.
"""

import subprocess
import sys
import os
import time


def main():
    print("=" * 65)
    print("    INDRA - Multimodal Citizen Administrative Agency System")
    print("=" * 65)
    print("Starting FastAPI Backend on http://127.0.0.1:8000 ...")

    # Start FastAPI backend
    backend = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "services.api.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=os.path.dirname(os.path.abspath(__file__))
    )

    time.sleep(2)
    print("Backend live at http://127.0.0.1:8000 (API Docs: http://127.0.0.1:8000/docs)")
    print("Starting React Case Workspace frontend on http://localhost:5173 ...")

    # Start Vite frontend
    frontend_cwd = os.path.join(os.path.dirname(os.path.abspath(__file__)), "apps", "web")
    frontend = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_cwd,
        shell=True
    )

    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        print("\nStopping INDRA services...")
        backend.terminate()
        frontend.terminate()


if __name__ == "__main__":
    main()
