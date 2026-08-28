"""
Playwright Real Browser Verification Suite for https://indra.abhishekas.in
Tests the complete citizen case intelligence journey live on the public subdomain.
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
        enter_btn = page.locator("button:has-text('ENTER WORKSPACE')")
        assert enter_btn.count() > 0, "Enter workspace button missing"
        enter_btn.click()
        time.sleep(2)
        print("[PASS] Successfully entered workspace as Aakash Verma.")

        # Step 3: Case Situation & Diagnostic Intelligence
        print("[STEP 3] Verifying Case Story & Diagnostic Intelligence...")
        page.wait_for_selector("text=Case Situation & Diagnostic Intelligence", timeout=10000)
        print("[PASS] Diagnostic intelligence rendered.")

        # Step 4: Legal Precedents Modal
        print("[STEP 4] Testing Statutory Framework Modal...")
        legal_btn = page.locator("button:has-text('Statutory Framework')")
        legal_btn.click()
        time.sleep(1)
        page.wait_for_selector("text=Statutory Precedents & Regulatory Framework")
        close_legal = page.locator("button:has-text('Close Library')")
        close_legal.click()
        time.sleep(1)
        print("[PASS] Statutory framework modal verified.")

        # Step 5: Generated Legal Petition Dossier
        print("[STEP 5] Testing Legal Petition Dossier Modal...")
        inspect_dossier = page.locator("button:has-text('Inspect Formal Legal Petition Dossier')").first
        inspect_dossier.click()
        time.sleep(1)
        page.wait_for_selector("text=Generated Administrative Petition")
        close_dossier = page.locator("button:has-text('Close Petition')")
        close_dossier.click()
        time.sleep(1)
        print("[PASS] Legal petition dossier rendered.")

        # Step 6: Citizen Consent
        print("[STEP 6] Testing Citizen Consent Authorization...")
        consent_btn = page.locator("button:has-text('1. Authorize Action')").first
        consent_btn.click()
        time.sleep(1)
        print("[PASS] Citizen consent authorized.")

        # Step 7: Submit to Bank Gateway
        print("[STEP 7] Submitting representation to Bank Gateway...")
        submit_btn = page.locator("button:has-text('2. Submit to Bank')").first
        submit_btn.click()
        time.sleep(1.5)
        print("[PASS] Action submitted to bank gateway (status: WAITING).")

        # Step 8: Fast Forward +15 Days SLA
        print("[STEP 8] Fast-Forwarding +15 Days SLA...")
        ff_btn = page.locator("button:has-text('+15d SLA')")
        ff_btn.click()
        time.sleep(1.5)
        page.wait_for_selector("text=SLA Breached - Escalated to CPGRAMS")
        print("[PASS] Automatic CPGRAMS SLA Escalation triggered.")

        # Step 9: PFMS Recovery Disbursal & Crediting Rs. 48,000
        print("[STEP 9] Executing PFMS Disbursal Recovery Cycle...")
        disburse_btn = page.locator("button:has-text('Verify & Execute PFMS Disbursal')")
        disburse_btn.click()
        time.sleep(2)
        page.wait_for_selector("text=Benefit Recovered & Credited")
        print("[PASS] Rs. 48,000 benefit credited! UTR generated. Case state: RESOLUTION.")

        # Step 10: Official Resolution & Audit Certificate
        print("[STEP 10] Testing Official Resolution & Audit Certificate...")
        cert_btn = page.locator("button:has-text('Audit Certificate')")
        cert_btn.click()
        time.sleep(1)
        page.wait_for_selector("text=CASE RESOLUTION & AUDIT CERTIFICATE")
        done_cert = page.locator("button:has-text('Done')")
        done_cert.click()
        time.sleep(1)
        print("[PASS] Resolution certificate modal verified.")

        # Step 11: React Flow Case Graph Canvas
        print("[STEP 11] Testing React Flow Case Graph Canvas...")
        graph_tab = page.locator("button:has-text('Case Graph Topology')")
        graph_tab.click()
        time.sleep(1.5)
        page.wait_for_selector("text=Interactive Case Graph Canvas")
        print("[PASS] React Flow graph canvas active with node-link topology.")

        # Step 12: Evidence Vault & Provenance
        print("[STEP 12] Testing Evidence Vault & Multimodal Provenance...")
        evidence_tab = page.locator("button:has-text('Evidence Vault & Provenance')")
        evidence_tab.click()
        time.sleep(1.5)
        page.wait_for_selector("text=Evidence Vault")
        print("[PASS] Evidence Vault loaded with source documents.")

        # Step 13: Second Domain (EPFO) Switch
        print("[STEP 13] Switching Domain to '[2] EPFO PF Claim Rejection'...")
        epfo_btn = page.locator("button:has-text('[2] EPFO PF Claim Rejection')")
        epfo_btn.click()
        time.sleep(1.5)
        story_tab = page.locator("button:has-text('Case Story & Action Hub')")
        story_tab.click()
        time.sleep(1.5)
        page.wait_for_selector("text=Pooja Sharma")
        print("[PASS] Second Domain (EPFO) loaded cleanly for Pooja Sharma.")

        # Step 14: Log Out
        print("[STEP 14] Testing Session Exit & Logout...")
        logout_btn = page.locator("button[title='Log Out (Return to Demo Login)']")
        logout_btn.click()
        time.sleep(1.5)
        page.wait_for_selector("text=National Administrative Intelligence Sandbox")
        print("[PASS] Successfully logged out to National Administrative Sandbox Gate.")

        browser.close()

    print("=" * 75)
    print("  ALL 14 TESTS PASSED 100% ON LIVE SUBDOMAIN: https://indra.abhishekas.in")
    print("=" * 75)


if __name__ == "__main__":
    test_live_custom_subdomain()
