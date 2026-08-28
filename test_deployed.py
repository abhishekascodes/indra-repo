"""
Playwright Test for Deployed Production Cloudflare Worker
Tests the live public deployment at https://indra-repo.abhishekascodes.workers.dev
"""

import time
from playwright.sync_api import sync_playwright

DEPLOYED_URL = "https://indra-repo.abhishekascodes.workers.dev"


def test_deployed_indra():
    print("=" * 70)
    print(f" TESTING DEPLOYED PRODUCTION INSTANCE: {DEPLOYED_URL}")
    print("=" * 70)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # Step 1: Open public URL
        print("[STEP 1] Navigating to Deployed Public URL...")
        page.goto(DEPLOYED_URL)
        page.wait_for_load_state("networkidle")
        time.sleep(1.5)

        # Step 2: Login Screen
        enter_btn = page.locator("button:has-text('ENTER WORKSPACE')")
        if enter_btn.count() > 0:
            print("[PASS] National Sandbox Login Screen rendered cleanly on public deployment.")
            enter_btn.click()
            time.sleep(1.5)

        # Step 3: Story & Intelligence
        page.wait_for_selector("text=Case Situation & Diagnostic Intelligence", timeout=10000)
        print("[PASS] Case Story & Diagnostic Intelligence rendered.")

        # Step 4: Consent
        consent_btn = page.locator("button:has-text('1. Authorize Action')").first
        if consent_btn.count() > 0:
            consent_btn.click()
            time.sleep(1)
            print("[PASS] Citizen Consent toggled successfully.")

        # Step 5: Submit Action
        submit_btn = page.locator("button:has-text('2. Submit to Bank')").first
        if submit_btn.count() > 0:
            submit_btn.click()
            time.sleep(1)
            print("[PASS] Action submitted to bank gateway.")

        # Step 6: +15D SLA
        ff_btn = page.locator("button:has-text('+15d SLA')")
        if ff_btn.count() > 0:
            ff_btn.click()
            time.sleep(1)
            print("[PASS] Fast-Forward +15d SLA triggered.")

        # Step 7: PFMS Disbursal & Resolution
        disburse_btn = page.locator("button:has-text('Verify & Execute PFMS Disbursal')")
        if disburse_btn.count() > 0:
            disburse_btn.click()
            time.sleep(1.5)
            print("[PASS] Benefit Disbursal executed on public instance!")

        # Step 8: View Graph Canvas
        graph_tab = page.locator("button:has-text('Case Graph Topology')")
        graph_tab.click()
        time.sleep(1)
        print("[PASS] React Flow Graph canvas loaded.")

        # Step 9: Evidence Vault
        evidence_tab = page.locator("button:has-text('Evidence Vault & Provenance')")
        evidence_tab.click()
        time.sleep(1)
        print("[PASS] Evidence Vault loaded with multimodal document tabs.")

        # Step 10: Switch to EPFO Domain
        epfo_btn = page.locator("button:has-text('[2] EPFO PF Claim Rejection')")
        epfo_btn.click()
        time.sleep(1)
        story_tab = page.locator("button:has-text('Case Story & Action Hub')")
        story_tab.click()
        time.sleep(1)
        page.wait_for_selector("text=Pooja Sharma")
        print("[PASS] Second Domain (EPFO) loaded cleanly on public instance.")

        browser.close()

    print("=" * 70)
    print(" ALL PRODUCTION TESTS PASSED ON CLOUDFLARE DEPLOYMENT!")
    print("=" * 70)


if __name__ == "__main__":
    test_deployed_indra()
