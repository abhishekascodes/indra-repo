"""
Playwright Demo Video Recorder
Records a high-definition video walkthrough of INDRA in action.
"""

import os
import time
import shutil
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\AbhishekPC\.gemini\antigravity\brain\56b64b0a-9c81-42b0-85ce-e1b71ff3699a"
VIDEO_TEMP_DIR = os.path.join(ARTIFACT_DIR, "video_temp")


def record_demo_walkthrough():
    print("=" * 70)
    print("       INDRA FULL DEMO VIDEO RECORDING IN PROGRESS")
    print("=" * 70)

    os.makedirs(VIDEO_TEMP_DIR, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            record_video_dir=VIDEO_TEMP_DIR,
            record_video_size={"width": 1440, "height": 900}
        )
        page = context.new_page()

        # Step 1: Open Gateway
        print("[VIDEO] 1. Navigating to National Administrative Sandbox...")
        page.goto("http://127.0.0.1:5173")
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        # Ensure we are at login screen (clear storage if needed)
        logout_btn = page.locator("button[title='Log Out (Return to Demo Login)']")
        if logout_btn.count() > 0:
            logout_btn.click()
            time.sleep(1.5)

        # Highlight profile selection
        page.wait_for_selector("text=National Administrative Sandbox")
        time.sleep(1)

        # Step 2: Click Enter Workspace
        print("[VIDEO] 2. Entering as Aakash Verma (Flagship)...")
        enter_btn = page.locator("button:has-text('ENTER WORKSPACE')")
        enter_btn.click()
        time.sleep(2)

        # Step 3: Executive Case Story & Diagnostic Intelligence
        print("[VIDEO] 3. Inspecting Diagnostic Summary & Causal Flow...")
        page.wait_for_selector("text=Case Situation & Diagnostic Intelligence")
        time.sleep(2)

        # Step 4: Open Legal Precedents Modal
        print("[VIDEO] 4. Viewing Legal Precedents...")
        legal_btn = page.locator("button:has-text('Legal Precedents')")
        legal_btn.click()
        time.sleep(2)
        close_legal = page.locator("button:has-text('Close Library')")
        close_legal.click()
        time.sleep(1)

        # Step 5: Inspect Generated Legal Petition Dossier
        print("[VIDEO] 5. Inspecting Legal Petition Dossier...")
        inspect_dossier = page.locator("button:has-text('Inspect Formal Legal Petition Dossier')").first
        inspect_dossier.click()
        time.sleep(2)
        close_dossier = page.locator("button:has-text('Close Petition')")
        close_dossier.click()
        time.sleep(1)

        # Step 6: Grant Citizen Consent
        print("[VIDEO] 6. Authorizing Citizen Consent...")
        consent_btn = page.locator("button:has-text('1. Authorize Action')").first
        consent_btn.click()
        time.sleep(1.5)

        # Step 7: Submit to Bank Portal
        print("[VIDEO] 7. Submitting to Bank Portal...")
        submit_btn = page.locator("button:has-text('2. Submit to Bank Portal')").first
        submit_btn.click()
        time.sleep(2)

        # Step 8: Advance Time +15 Days SLA
        print("[VIDEO] 8. Fast-Forwarding Clock +15 Days (SLA Expiry)...")
        ff_btn = page.locator("button:has-text('+15d SLA')")
        ff_btn.click()
        time.sleep(2)

        # Step 9: Finalize Benefit Disbursal (PFMS Recovery Cycle)
        print("[VIDEO] 9. Finalizing PFMS Disbursal & Crediting Rs. 48,000...")
        disburse_btn = page.locator("button:has-text('Verify & Execute PFMS Disbursal')")
        disburse_btn.click()
        time.sleep(2.5)

        # Step 10: View Resolution Certificate
        print("[VIDEO] 10. Viewing Resolution & Audit Certificate...")
        cert_btn = page.locator("button:has-text('View Resolution Certificate')")
        cert_btn.click()
        time.sleep(2.5)
        done_cert = page.locator("button:has-text('Done')")
        done_cert.click()
        time.sleep(1)

        # Step 11: Case Graph Topology Canvas
        print("[VIDEO] 11. Exploring React Flow Case Graph Canvas...")
        graph_tab = page.locator("button:has-text('Case Graph Topology')")
        graph_tab.click()
        time.sleep(2)

        # Step 12: Evidence Vault & Provenance
        print("[VIDEO] 12. Exploring Evidence Vault & Document Sheets...")
        evidence_tab = page.locator("button:has-text('Evidence Vault & Provenance')")
        evidence_tab.click()
        time.sleep(1.5)

        doc_buttons = page.locator(".scrollbar-none button")
        for i in range(min(doc_buttons.count(), 5)):
            doc_buttons.nth(i).click()
            time.sleep(1)

        # Step 13: Chronology & Timeline
        print("[VIDEO] 13. Viewing Chronology & SLA Timeline...")
        timeline_tab = page.locator("button:has-text('Chronology & Timeline')")
        timeline_tab.click()
        time.sleep(2)

        # Step 14: Switch to Second Domain (EPFO)
        print("[VIDEO] 14. Switching to Second Domain: EPFO Claim Rejection...")
        epfo_btn = page.locator("button:has-text('[2] EPFO PF Claim Rejection')")
        epfo_btn.click()
        time.sleep(2)

        story_tab = page.locator("button:has-text('Case Story & Action Hub')")
        story_tab.click()
        time.sleep(2)

        # Step 15: Log Out
        print("[VIDEO] 15. Logging Out...")
        logout_btn = page.locator("button[title='Log Out (Return to Demo Login)']")
        logout_btn.click()
        time.sleep(2)

        page.close()
        context.close()
        browser.close()

    # Move recorded video to artifact directory
    video_files = [os.path.join(VIDEO_TEMP_DIR, f) for f in os.listdir(VIDEO_TEMP_DIR) if f.endswith('.webm')]
    if video_files:
        latest_video = max(video_files, key=os.path.getctime)
        target_video = os.path.join(ARTIFACT_DIR, "indra_demo_recording.webm")
        shutil.copyfile(latest_video, target_video)
        print(f"[SUCCESS] Demo video recorded and saved to: {target_video}")
        return target_video

    return None


if __name__ == "__main__":
    record_demo_walkthrough()
