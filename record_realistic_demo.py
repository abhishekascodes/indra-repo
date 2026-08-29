"""
Playwright Realistic Human-Paced Demo Video Recorder for INDRA Causal Masonry Workspace.
Produces a pristine 1080p MP4 recording demonstrating the complete forensic journey.
"""

import time
import os
import subprocess
from playwright.sync_api import sync_playwright

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEO_TEMP_DIR = os.path.join(OUTPUT_DIR, "video_temp_causal")
FINAL_MP4_PATH = os.path.join(OUTPUT_DIR, "indra_demo_recording.mp4")

os.makedirs(VIDEO_TEMP_DIR, exist_ok=True)


def inject_custom_mouse_cursor(page):
    page.evaluate("""
        () => {
            if (document.getElementById('playwright-mouse-pointer')) return;
            const pointer = document.createElement('div');
            pointer.id = 'playwright-mouse-pointer';
            pointer.style.width = '20px';
            pointer.style.height = '20px';
            pointer.style.borderRadius = '50%';
            pointer.style.backgroundColor = 'rgba(37, 99, 235, 0.7)';
            pointer.style.border = '2px solid #ffffff';
            pointer.style.boxShadow = '0 0 10px rgba(37, 99, 235, 0.8)';
            pointer.style.position = 'fixed';
            pointer.style.top = '0px';
            pointer.style.left = '0px';
            pointer.style.pointerEvents = 'none';
            pointer.style.zIndex = '9999999';
            pointer.style.transition = 'transform 0.08s ease, width 0.15s ease, height 0.15s ease, background-color 0.15s ease';
            pointer.style.transform = 'translate(-50%, -50%)';
            document.body.appendChild(pointer);

            window.addEventListener('mousemove', (e) => {
                pointer.style.left = e.clientX + 'px';
                pointer.style.top = e.clientY + 'px';
            });
            window.addEventListener('mousedown', () => {
                pointer.style.transform = 'translate(-50%, -50%) scale(0.75)';
                pointer.style.backgroundColor = 'rgba(220, 38, 38, 0.85)';
            });
            window.addEventListener('mouseup', () => {
                pointer.style.transform = 'translate(-50%, -50%) scale(1.0)';
                pointer.style.backgroundColor = 'rgba(37, 99, 235, 0.7)';
            });
        }
    """)


def smooth_move(page, target_x, target_y, steps=25):
    page.mouse.move(target_x, target_y, steps=steps)
    time.sleep(0.04)


def human_click(page, locator, post_pause=1.2):
    box = locator.bounding_box()
    if box:
        center_x = box["x"] + box["width"] / 2
        center_y = box["y"] + box["height"] / 2
        smooth_move(page, center_x, center_y, steps=20)
        time.sleep(0.15)
        page.mouse.down()
        time.sleep(0.08)
        page.mouse.up()
    else:
        locator.click()
    time.sleep(post_pause)


def run_realistic_demo_recording():
    print("=" * 70)
    print("   INDRA CAUSAL MASONRY DEMO VIDEO RECORDING (~55s)")
    print("=" * 70)

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

        # Enter Sandbox as Aakash Verma
        enter_btn = page.locator("button").filter(has_text="Enter National Administrative Sandbox").first
        print("[04s] Entering National Administrative Sandbox...")
        human_click(page, enter_btn, post_pause=2.5)
        inject_custom_mouse_cursor(page)

        # Step 2: Causal Masonry Blueprint (00:08 - 00:18)
        print("[08s] Exploring Causal Masonry Blueprint (8px Grid)...")
        time.sleep(2.0)

        # Step 3: Trigger Forensic Provenance Drawer (00:18 - 00:28)
        why_btn = page.locator("button").filter(has_text="WHY?").first
        print("[18s] Clicking 'WHY?' on Root Cause Hypothesis...")
        human_click(page, why_btn, post_pause=3.0)

        # Close Provenance Drawer
        close_drawer = page.locator("button").filter(has_text="Close Drawer").first
        print("[28s] Closing Provenance Drawer...")
        human_click(page, close_drawer, post_pause=1.5)

        # Step 4: Epistemic Fact Ledger Audit Modal (00:30 - 00:36)
        ledger_btn = page.locator("button").filter(has_text="Epistemic Ledger").first
        print("[30s] Opening Epistemic Fact Ledger (Auditor View)...")
        human_click(page, ledger_btn, post_pause=2.5)

        close_ledger = page.locator("button").filter(has_text="Close Ledger").first
        human_click(page, close_ledger, post_pause=1.5)

        # Step 5: Slide to Authorize & Enter Sentinel Waiting Mode (00:36 - 00:44)
        slider = page.locator("[role='slider']").first
        print("[36s] Sliding to Authorize Administrative Mandate (95% threshold)...")
        box = slider.bounding_box()
        if box:
            start_x = box["x"] + 24
            start_y = box["y"] + box["height"] / 2
            end_x = box["x"] + box["width"] * 0.98
            smooth_move(page, start_x, start_y, steps=15)
            page.mouse.down()
            smooth_move(page, end_x, start_y, steps=30)
            page.mouse.up()
            time.sleep(2.5)

        # Step 6: Sentinel Mode & Temporal Fast Forward (00:44 - 00:50)
        print("[44s] Sentinel Radar active. Fast-forwarding +15 Days SLA...")
        ff_btn = page.locator("button").filter(has_text="Fast Forward +15 Days").first
        human_click(page, ff_btn, post_pause=2.5)

        # Simulate Bank Resolution & Benefit Crediting
        res_btn = page.locator("button").filter(has_text="Simulate Bank Resolution").first
        print("[48s] Simulating Bank Resolution & Crediting Rs. 48,000...")
        human_click(page, res_btn, post_pause=3.0)

        # Step 7: Second Domain Switch (00:50 - 00:55)
        epfo_tab = page.locator("button").filter(has_text="[2] EPFO PF Claim").first
        print("[52s] Switching to Second Domain (EPFO - Pooja Sharma)...")
        human_click(page, epfo_tab, post_pause=3.0)

        # Finish recording
        print("[55s] Completing high-resolution video capture...")
        time.sleep(1)
        context.close()
        video_path = page.video.path()
        browser.close()

    print(f"[OK] Raw WebM Video saved to: {video_path}")

    # Convert WebM to standard MP4 via FFmpeg
    if video_path and os.path.exists(video_path):
        print("[INFO] Transcoding WebM to pristine 1080p MP4 via FFmpeg...")
        cmd = [
            "ffmpeg", "-y", "-i", video_path,
            "-c:v", "libx264", "-preset", "slow", "-crf", "18",
            "-pix_fmt", "yuv420p",
            FINAL_MP4_PATH
        ]
        try:
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode == 0:
                print(f"[SUCCESS] Final MP4 generated: {FINAL_MP4_PATH}")
                print(f"File Size: {os.path.getsize(FINAL_MP4_PATH) / 1024:.1f} KB")
            else:
                print(f"[WARN] FFmpeg transcoding stderr: {res.stderr}")
        except Exception as e:
            print(f"[ERROR] Could not run ffmpeg: {e}")


if __name__ == "__main__":
    run_realistic_demo_recording()
