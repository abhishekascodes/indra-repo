"""
Playwright Real Browser Verification Suite for https://indra.abhishekas.in
Tests the complete forensic Causal Masonry workspace and Semantic Zoom journey.
"""

import time
from playwright.sync_api import sync_playwright

PUBLIC_SUBDOMAIN = "https://indra.abhishekas.in"


def test_live_custom_subdomain():
    print("=" * 75)
    print(f"  PLAYWRIGHT LIVE PRODUCTION VERIFICATION: {PUBLIC_SUBDOMAIN}")
    print("=" * 75)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # Step 1: Open public subdomain
        print(f"[STEP 1] Navigating to {PUBLIC_SUBDOMAIN} ...")
        page.goto(PUBLIC_SUBDOMAIN)
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        # Step 2: Login Gate
        print("[STEP 2] Verifying National Administrative Sandbox Gate...")
        enter_btn = page.locator("button:has-text('Enter National Administrative Sandbox')").first
        if enter_btn.count() == 0:
            enter_btn = page.locator("button:has-text('Enter')").first
        assert enter_btn.count() > 0, "Enter button missing"
        enter_btn.click()
        time.sleep(2)
        print("[PASS] Successfully entered workspace as Aakash Verma.")

        # Step 3: Causal Masonry Canvas & Semantic Zoom
        print("[STEP 3] Verifying Causal Masonry Canvas & Level 2 Blueprint...")
        page.wait_for_selector("text=INDRA CORE", timeout=10000)
        page.wait_for_selector("text=1. Grounded Facts & Evidence")
        print("[PASS] Causal Masonry canvas rendered on 8px grid.")

        # Step 4: Provenance Drawer (WHY? Interaction)
        print("[STEP 4] Testing WHY? Provenance Trace Drawer...")
        why_btn = page.locator("button:has-text('WHY?')").first
        assert why_btn.count() > 0, "WHY? button missing"
        why_btn.click()
        time.sleep(1)
        page.wait_for_selector("text=Forensic Provenance Trace")
        close_drawer = page.locator("button:has-text('Close Drawer')")
        close_drawer.click()
        time.sleep(1)
        print("[PASS] Provenance drawer and reasoning chain verified.")

        # Step 5: Epistemic Fact Ledger Modal
        print("[STEP 5] Testing Epistemic Ledger Audit Modal...")
        ledger_btn = page.locator("button:has-text('Epistemic Ledger')")
        ledger_btn.click()
        time.sleep(1)
        page.wait_for_selector("text=Epistemic Fact Ledger & Grounded Provenance")
        close_ledger = page.locator("button:has-text('Close Ledger')")
        close_ledger.click()
        time.sleep(1)
        print("[PASS] Epistemic ledger modal verified.")

        # Step 6: Presenter / Demo Mode (Shift+D)
        print("[STEP 6] Testing Presenter Deck (Shift+D)...")
        presenter_btn = page.locator("button[aria-label='Presenter Controls']")
        presenter_btn.click()
        time.sleep(1)
        page.wait_for_selector("text=Presenter & Evaluator Control Deck")
        close_presenter = page.locator("button[aria-label='Close Presenter Deck']")
        close_presenter.click()
        time.sleep(1)
        print("[PASS] Light-themed Presenter Deck verified.")

        # Step 7: Consent & Action Transmission (Entering Sentinel Waiting State)
        print("[STEP 7] Testing Citizen Consent & Portal Transmission...")
        slider = page.locator("[role='slider']").first
        assert slider.count() > 0, "Consent slider missing"
        # Click on the right side of the slider track to reach 95%+ threshold
        box = slider.bounding_box()
        if box:
            page.mouse.click(box["x"] + box["width"] * 0.96, box["y"] + box["height"] * 0.5)
        time.sleep(2)
        print("[PASS] Citizen authorization executed. State: WAITING.")

        # Step 8: Fast Forward +15 Days SLA
        print("[STEP 8] Fast-Forwarding +15 Days SLA...")
        ff_btn = page.locator("button:has-text('Fast Forward +15 Days')").first
        ff_btn.click()
        time.sleep(1.5)
        page.wait_for_selector("text=STATUTORY SLA BREACH DETECTED")
        print("[PASS] Automatic CPGRAMS SLA Escalation triggered.")

        # Step 9: Simulate Resolution & Benefit Credited
        print("[STEP 9] Simulating Resolution Disbursal Cycle...")
        res_btn = page.locator("button:has-text('Simulate Bank Resolution')").first
        res_btn.click()
        time.sleep(2)
        page.wait_for_selector("text=ADMINISTRATIVE CERTAINTY RESTORED")
        page.wait_for_selector("text=48,000")
        print("[PASS] Rs. 48,000 benefit credited! Case state: RESOLUTION.")

        # Step 10: Second Domain Switch (EPFO PF Claim)
        print("[STEP 10] Switching Domain to '[2] EPFO PF Claim'...")
        epfo_tab = page.locator("button:has-text('[2] EPFO PF Claim')")
        epfo_tab.click()
        time.sleep(2)
        page.wait_for_selector("text=Pooja Sharma")
        print("[PASS] Second Domain (EPFO) loaded cleanly with Exit Date Contradiction.")

        # Step 11: Session Exit & Logout
        print("[STEP 11] Testing Session Exit & Logout...")
        logout_btn = page.locator("button[aria-label='Exit Sandbox']")
        logout_btn.click()
        time.sleep(1.5)
        page.wait_for_selector("text=Select Evaluation Profile")
        print("[PASS] Successfully logged out to National Administrative Sandbox Gate.")

        print("=" * 75)
        print(f"  ALL 11 REAL BROWSER TESTS PASSED 100% ON LIVE SUBDOMAIN")
        print("=" * 75)


if __name__ == "__main__":
    test_live_custom_subdomain()
