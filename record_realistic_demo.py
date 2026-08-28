"""
High-Definition Human-Paced Video Recorder with Realistic Animated Cursor
Records a smooth ~55-second natural demonstration of INDRA in action and converts to MP4.
"""

import os
import time
import shutil
import subprocess
from playwright.sync_api import sync_playwright, Page, Locator

ARTIFACT_DIR = r"C:\Users\AbhishekPC\Desktop\the FIRST WIN"
VIDEO_TEMP_DIR = os.path.join(ARTIFACT_DIR, "video_temp_realistic")


def inject_custom_mouse_cursor(page: Page):
    """Injects a visible, smooth mouse cursor into the DOM."""
    js_code = """
    (() => {
        if (document.getElementById('playwright-mouse-pointer')) return;
        const box = document.createElement('div');
        box.id = 'playwright-mouse-pointer';
        box.style.position = 'fixed';
        box.style.top = '0';
        box.style.left = '0';
        box.style.width = '20px';
        box.style.height = '20px';
        box.style.pointerEvents = 'none';
        box.style.zIndex = '999999';
        box.style.transition = 'transform 0.05s linear';
        box.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L5.85 2.36a.5.5 0 0 0-.35.85z" fill="#0F172A" stroke="#FFFFFF" stroke-width="1.5"/>
            </svg>
            <div id="click-ripple" style="position: absolute; top: 0; left: 0; width: 24px; height: 24px; border-radius: 50%; background: rgba(99, 102, 241, 0.4); transform: scale(0); opacity: 0; transition: transform 0.3s ease-out, opacity 0.3s ease-out;"></div>
        `;
        document.body.appendChild(box);

        window.movePointer = (x, y) => {
            box.style.transform = `translate(${x}px, ${y}px)`;
        };

        window.clickPointer = () => {
            const ripple = document.getElementById('click-ripple');
            if (ripple) {
                ripple.style.transform = 'scale(2.2)';
                ripple.style.opacity = '1';
                setTimeout(() => {
                    ripple.style.transform = 'scale(0)';
                    ripple.style.opacity = '0';
                }, 250);
            }
        };
    })();
    """
    page.evaluate(js_code)


def smooth_move_to_locator(page: Page, locator: Locator, steps: int = 20, pause: float = 0.3):
    """Smoothly moves the visible cursor to the center of a locator and hovers."""
    try:
        box = locator.bounding_box()
        if not box:
            return
        target_x = box["x"] + box["width"] / 2
        target_y = box["y"] + box["height"] / 2

        # Animate in intermediate steps
        page.evaluate(f"window.movePointer({target_x}, {target_y})")
        page.mouse.move(target_x, target_y, steps=steps)
        time.sleep(pause)
    except Exception as e:
        pass


def human_click(page: Page, locator: Locator, post_pause: float = 1.0):
    """Simulates a human moving cursor, clicking with ripple feedback, and pausing."""
    smooth_move_to_locator(page, locator, steps=15, pause=0.25)
    page.evaluate("window.clickPointer()")
    locator.click()
    time.sleep(post_pause)


def run_realistic_demo_recording():
    print("=" * 70)
    print("   INDRA REALISTIC HUMAN-PACED DEMO VIDEO RECORDING (~55s)")
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

        # Step 1: Open Gateway (00:00 - 00:05)
        print("[00s] Navigating to National Administrative Sandbox...")
        page.goto("http://127.0.0.1:5173")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        inject_custom_mouse_cursor(page)

        # If already logged in, log out first to show clean gateway
        logout_btn = page.locator("button[title='Log Out (Return to Demo Login)']")
        if logout_btn.count() > 0:
            human_click(page, logout_btn, post_pause=1.0)
            inject_custom_mouse_cursor(page)

        # Select Aakash Verma & Enter
        enter_btn = page.locator("button:has-text('ENTER WORKSPACE')")
        print("[04s] Hovering and entering as Aakash Verma (Flagship)...")
        human_click(page, enter_btn, post_pause=2.0)
        inject_custom_mouse_cursor(page)

        # Step 2: Open Architecture Blueprint (00:06 - 00:10)
        arch_btn = page.locator("button:has-text('Architecture')")
        print("[06s] Inspecting INDRA Core Architecture Blueprint...")
        human_click(page, arch_btn, post_pause=2.0)
        close_arch = page.locator("button:has-text('Close Blueprint')")
        human_click(page, close_arch, post_pause=1.0)

        # Step 3: Case Situation & Diagnostic Intelligence (00:10 - 00:18)
        print("[10s] Reviewing Root Cause Hypothesis & Cross-Domain Flow...")
        page.wait_for_selector("text=Case Situation & Diagnostic Intelligence")
        time.sleep(2.0)

        # Step 4: Inspect Generated Legal Petition Dossier (00:18 - 00:24)
        inspect_dossier = page.locator("button:has-text('Inspect Formal Legal Petition Dossier')").first
        print("[18s] Inspecting Legal Petition Dossier...")
        human_click(page, inspect_dossier, post_pause=2.5)

        close_dossier = page.locator("button:has-text('Close Petition')")
        human_click(page, close_dossier, post_pause=1.0)

        # Step 5: Grant Citizen Consent (00:24 - 00:28)
        consent_btn = page.locator("button:has-text('1. Authorize Action')").first
        print("[24s] Granting Citizen Consent Authorization...")
        human_click(page, consent_btn, post_pause=1.8)

        # Step 6: Submit to Bank Portal (00:28 - 00:32)
        submit_btn = page.locator("button:has-text('2. Submit to Bank')").first
        print("[28s] Submitting representation to Bank Portal...")
        human_click(page, submit_btn, post_pause=2.0)

        # Step 7: Fast Forward +15 Days (SLA Expiry & Auto-Escalation) (00:32 - 00:38)
        ff_btn = page.locator("button:has-text('+15d SLA')")
        print("[32s] Fast-forwarding +15 days to test statutory SLA...")
        human_click(page, ff_btn, post_pause=2.5)

        # Step 8: PFMS Recovery Disbursal & Crediting Rs. 48,000 (00:38 - 00:44)
        disburse_btn = page.locator("button:has-text('Verify & Execute PFMS Disbursal')")
        print("[38s] Finalizing PFMS Disbursal & Crediting Rs. 48,000...")
        human_click(page, disburse_btn, post_pause=2.5)

        # View Resolution Certificate
        cert_btn = page.locator("button:has-text('Audit Certificate')")
        print("[42s] Viewing Official Resolution Certificate...")
        human_click(page, cert_btn, post_pause=2.5)
        done_cert = page.locator("button:has-text('Done')")
        human_click(page, done_cert, post_pause=1.0)

        # Step 9: React Flow Case Graph Canvas (00:44 - 00:50)
        graph_tab = page.locator("button:has-text('Case Graph Topology')")
        print("[45s] Exploring React Flow Case Graph Canvas...")
        human_click(page, graph_tab, post_pause=3.0)

        # Step 10: Evidence Vault (00:50 - 00:54)
        evidence_tab = page.locator("button:has-text('Evidence Vault & Provenance')")
        print("[50s] Exploring Evidence Vault & Document Sheets...")
        human_click(page, evidence_tab, post_pause=1.5)

        doc_buttons = page.locator(".scrollbar-none button")
        if doc_buttons.count() >= 2:
            human_click(page, doc_buttons.nth(1), post_pause=1.5)

        # Step 11: Switch to Second Domain EPFO (00:54 - 00:57)
        epfo_btn = page.locator("button:has-text('[2] EPFO')")
        print("[54s] Switching to Second Domain (EPFO)...")
        human_click(page, epfo_btn, post_pause=2.0)

        logout_btn = page.locator("button[title='Log Out (Return to Demo Login)']")
        print("[57s] Logging out to Sandbox Gateway...")
        human_click(page, logout_btn, post_pause=1.5)

        page.close()
        context.close()
        browser.close()

    # Move recorded video to root and convert to MP4
    video_files = [os.path.join(VIDEO_TEMP_DIR, f) for f in os.listdir(VIDEO_TEMP_DIR) if f.endswith('.webm')]
    if video_files:
        latest_video = max(video_files, key=os.path.getctime)
        webm_dest = os.path.join(ARTIFACT_DIR, "indra_demo_recording.webm")
        mp4_dest = os.path.join(ARTIFACT_DIR, "indra_demo_recording.mp4")
        shutil.copyfile(latest_video, webm_dest)

        print("[FFMPEG] Converting to 1080p/H.264 MP4 with optimal 25fps timing...")
        subprocess.run([
            "ffmpeg", "-y", "-i", webm_dest,
            "-c:v", "libx264", "-preset", "fast", "-crf", "20",
            "-pix_fmt", "yuv420p", mp4_dest
        ], check=True)

        # Also copy to public directory
        public_mp4 = os.path.join(ARTIFACT_DIR, "apps", "web", "public", "indra_demo_recording.mp4")
        shutil.copyfile(mp4_dest, public_mp4)

        print(f"[SUCCESS] Natural ~58s MP4 video with visible cursor saved to: {mp4_dest}")
        return mp4_dest

    return None


if __name__ == "__main__":
    run_realistic_demo_recording()
