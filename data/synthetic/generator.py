"""
Synthetic Multimodal Evidence Generator for INDRA
Generates realistic PDF documents, statements, rejection notices, and SMS logs
with precise page numbers, raw text, and bounding-box coordinates.
"""

import os
import json
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors


def create_flagship_dbt_evidence(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)

    # 1. Scholarship Sanction Letter PDF
    pdf1_path = os.path.join(output_dir, "01_scholarship_sanction_order.pdf")
    c1 = canvas.Canvas(pdf1_path, pagesize=letter)
    c1.setFont("Helvetica-Bold", 14)
    c1.drawString(50, 750, "GOVERNMENT OF INDIA - MINISTRY OF SOCIAL JUSTICE & EMPOWERMENT")
    c1.setFont("Helvetica", 10)
    c1.drawString(50, 735, "DIRECT BENEFIT TRANSFER (DBT) WELFARE & SCHOLARSHIP MISSION")
    c1.line(50, 725, 550, 725)

    c1.setFont("Helvetica-Bold", 11)
    c1.drawString(50, 700, "SANCTION ORDER & BENEFICIARY ENTITLEMENT ADVICE")
    c1.setFont("Helvetica", 9)
    c1.drawString(50, 680, "Sanction ID: DBT/2026/SCH-884920")
    c1.drawString(350, 680, "Date: 10 July 2026")
    c1.drawString(50, 660, "Beneficiary Name: Aakash Verma")
    c1.drawString(350, 660, "Date of Birth: 14/05/2001")
    c1.drawString(50, 640, "Aadhaar Number: XXXX-XXXX-8821")
    c1.drawString(350, 640, "Category: Post-Matric Professional Scholarship")
    c1.drawString(50, 620, "Sanctioned Amount: Rs. 48,000.00")
    c1.drawString(350, 620, "Disbursal Mode: Aadhaar Payment Bridge (APBS)")

    c1.drawString(50, 590, "Sanction Status: APPROVED / SANCTIONED")
    c1.drawString(50, 570, "Designated Processing Gateway: Public Financial Management System (PFMS)")
    c1.drawString(50, 540, "Note: Funds will be credited directly to the citizen's Aadhaar-seeded primary bank account.")
    c1.showPage()
    c1.save()

    # 2. PFMS Rejection Slip PDF
    pdf2_path = os.path.join(output_dir, "02_pfms_disbursal_rejection_slip.pdf")
    c2 = canvas.Canvas(pdf2_path, pagesize=letter)
    c2.setFont("Helvetica-Bold", 13)
    c2.drawString(50, 750, "PUBLIC FINANCIAL MANAGEMENT SYSTEM (PFMS) - DISBURSAL ADVICE")
    c2.line(50, 740, 550, 740)
    c2.setFont("Helvetica-Bold", 10)
    c2.drawString(50, 710, "TRANSACTION SETTLEMENT EXCEPTION REPORT")
    c2.setFont("Helvetica", 9)
    c2.drawString(50, 685, "PFMS Transaction Ref: PFMS-TXN-2026-99214")
    c2.drawString(350, 685, "Processing Date: 14 August 2026")
    c2.drawString(50, 665, "Beneficiary Name: Aakash Verma")
    c2.drawString(350, 665, "Scheme: DBT-SCHOLARSHIP-POST-MATRIC")
    c2.drawString(50, 645, "Target IFSC: CNRB0002145 (Canara Bank)")
    c2.drawString(350, 645, "Target Account: *******4401")
    c2.drawString(50, 625, "Credit Amount: Rs. 48,000.00")
    c2.setFont("Helvetica-Bold", 10)
    c2.setFillColor(colors.red)
    c2.drawString(50, 595, "Settlement Status: REJECTED / DISBURSAL FAILED")
    c2.drawString(50, 575, "Error Code: BNS-410")
    c2.setFont("Helvetica", 9)
    c2.drawString(50, 555, "Reason Description: Beneficiary Account Inactive / Debit Freeze / Lien Restriction at Destination Bank")
    c2.setFillColor(colors.black)
    c2.drawString(50, 525, "Institutional Action: Disbursal halted. Beneficiary must resolve bank mapping status.")
    c2.showPage()
    c2.save()

    # 3. Canara Bank Statement PDF
    pdf3_path = os.path.join(output_dir, "03_canara_bank_statement.pdf")
    c3 = canvas.Canvas(pdf3_path, pagesize=letter)
    c3.setFont("Helvetica-Bold", 12)
    c3.drawString(50, 750, "CANARA BANK - ACCOUNT STATUS STATEMENT")
    c3.line(50, 740, 550, 740)
    c3.setFont("Helvetica", 9)
    c3.drawString(50, 715, "Account Holder: AAKASH VERMA")
    c3.drawString(350, 715, "Account No: 2145101004401")
    c3.drawString(50, 695, "Branch: Connaught Place, New Delhi")
    c3.drawString(350, 695, "IFSC: CNRB0002145")
    c3.drawString(50, 675, "Account Type: Savings Bank")
    c3.drawString(350, 675, "Available Balance: Rs. 1,240.50")
    c3.drawString(50, 645, "Debit Status: RESTRICTED / ADMINISTRATIVE LIEN MARKED")
    c3.drawString(50, 625, "NPCI Mapper Status: INACTIVE (APBS Mandate Suspended)")
    c3.drawString(50, 605, "Lien Reason: Cyber Cell Requisition Hold (Sec 102 CrPC Reference #CR-4412)")
    c3.showPage()
    c3.save()

    # 4. State Bank of India Active Account
    pdf4_path = os.path.join(output_dir, "04_sbi_active_bank_statement.pdf")
    c4 = canvas.Canvas(pdf4_path, pagesize=letter)
    c4.setFont("Helvetica-Bold", 12)
    c4.drawString(50, 750, "STATE BANK OF INDIA - ACCOUNT CONFIRMATION")
    c4.line(50, 740, 550, 740)
    c4.setFont("Helvetica", 9)
    c4.drawString(50, 715, "Account Holder: Aakash Verma")
    c4.drawString(350, 715, "Account No: 38492018812")
    c4.drawString(50, 695, "Branch: Delhi University Branch")
    c4.drawString(350, 695, "IFSC: SBIN0001067")
    c4.drawString(50, 675, "Account Status: ACTIVE / FULL KYC COMPLIANT")
    c4.drawString(50, 655, "Aadhaar Seeding Status: SEEDED / READY FOR NPCI APBS MANDATE")
    c4.showPage()
    c4.save()

    # 5. SMS / Rejection Notice Text
    sms_path = os.path.join(output_dir, "05_pfms_alert_sms.txt")
    with open(sms_path, "w", encoding="utf-8") as f:
        f.write("FROM: VM-PFMSGV\nDATE: 14-AUG-2026 14:32\nDear Aakash Verma, your DBT payment of Rs 48000 for Post-Matric Scholarship failed due to destination bank rejection BNS-410 (Account Inactive/Lien). Kindly contact your bank or update NPCI mandate.")

    # Metadata map with precise bounding boxes (normalized [ymin, xmin, ymax, xmax])
    metadata = {
        "case_id": "CASE-FLAGSHIP-DBT",
        "domain_id": "dbt_failure",
        "citizen_name": "Aakash Verma",
        "evidence_files": [
            {
                "file": "01_scholarship_sanction_order.pdf",
                "type": "pdf",
                "title": "Ministry Scholarship Sanction Order",
                "extractions": [
                    {
                        "field": "sanction_status",
                        "value": "APPROVED / SANCTIONED",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.21, 0.08, 0.23, 0.45],
                        "raw_text": "Sanction Status: APPROVED / SANCTIONED",
                        "confidence": 0.99
                    },
                    {
                        "field": "sanctioned_amount",
                        "value": 48000.0,
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.17, 0.08, 0.19, 0.45],
                        "raw_text": "Sanctioned Amount: Rs. 48,000.00",
                        "confidence": 0.99
                    },
                    {
                        "field": "dob",
                        "value": "2001-05-14",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.12, 0.58, 0.14, 0.90],
                        "raw_text": "Date of Birth: 14/05/2001",
                        "confidence": 0.99
                    }
                ]
            },
            {
                "file": "02_pfms_disbursal_rejection_slip.pdf",
                "type": "pdf",
                "title": "PFMS Disbursal Exception Report",
                "extractions": [
                    {
                        "field": "error_code",
                        "value": "BNS-410",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.23, 0.08, 0.25, 0.35],
                        "raw_text": "Error Code: BNS-410",
                        "confidence": 0.99
                    },
                    {
                        "field": "rejection_reason",
                        "value": "Beneficiary Account Inactive / Debit Freeze / Lien Restriction at Destination Bank",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.26, 0.08, 0.29, 0.95],
                        "raw_text": "Reason Description: Beneficiary Account Inactive / Debit Freeze / Lien Restriction at Destination Bank",
                        "confidence": 0.99
                    },
                    {
                        "field": "disbursal_status",
                        "value": "REJECTED / DISBURSAL FAILED",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.20, 0.08, 0.22, 0.55],
                        "raw_text": "Settlement Status: REJECTED / DISBURSAL FAILED",
                        "confidence": 0.99
                    }
                ]
            },
            {
                "file": "03_canara_bank_statement.pdf",
                "type": "pdf",
                "title": "Canara Bank Restricted Account Statement",
                "extractions": [
                    {
                        "field": "freeze_type",
                        "value": "FULL_ACCOUNT_FREEZE",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.14, 0.08, 0.16, 0.70],
                        "raw_text": "Debit Status: RESTRICTED / ADMINISTRATIVE LIEN MARKED",
                        "confidence": 0.98
                    },
                    {
                        "field": "npci_mapper_status",
                        "value": "INACTIVE",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.16, 0.08, 0.18, 0.70],
                        "raw_text": "NPCI Mapper Status: INACTIVE (APBS Mandate Suspended)",
                        "confidence": 0.98
                    }
                ]
            },
            {
                "file": "04_sbi_active_bank_statement.pdf",
                "type": "pdf",
                "title": "State Bank of India Active Account Confirmation",
                "extractions": [
                    {
                        "field": "sbi_account_status",
                        "value": "ACTIVE",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.10, 0.08, 0.12, 0.60],
                        "raw_text": "Account Status: ACTIVE / FULL KYC COMPLIANT",
                        "confidence": 0.99
                    },
                    {
                        "field": "sbi_npci_ready",
                        "value": "ELIGIBLE",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.12, 0.08, 0.14, 0.85],
                        "raw_text": "Aadhaar Seeding Status: SEEDED / READY FOR NPCI APBS MANDATE",
                        "confidence": 0.99
                    }
                ]
            },
            {
                "file": "05_pfms_alert_sms.txt",
                "type": "sms",
                "title": "PFMS Gateway Alert SMS",
                "extractions": [
                    {
                        "field": "sms_alert_code",
                        "value": "BNS-410",
                        "category": "FACT",
                        "page": 1,
                        "bbox": None,
                        "raw_text": "payment of Rs 48000 for Post-Matric Scholarship failed due to destination bank rejection BNS-410",
                        "confidence": 0.99
                    }
                ]
            }
        ]
    }

    with open(os.path.join(output_dir, "flagship_dbt_metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"Generated Flagship DBT Evidence in {output_dir}")


def create_epfo_evidence(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)

    # 1. EPFO Form 19 Rejection Slip
    pdf1_path = os.path.join(output_dir, "01_epfo_claim_rejection.pdf")
    c1 = canvas.Canvas(pdf1_path, pagesize=letter)
    c1.setFont("Helvetica-Bold", 13)
    c1.drawString(50, 750, "EMPLOYEES' PROVIDENT FUND ORGANISATION (EPFO)")
    c1.drawString(50, 735, "FIELD OFFICE: REGIONAL OFFICE DELHI SOUTH")
    c1.line(50, 725, 550, 725)
    c1.setFont("Helvetica-Bold", 10)
    c1.drawString(50, 700, "EPF FINAL SETTLEMENT CLAIM REJECTION ADVICE (FORM 19/10C)")
    c1.setFont("Helvetica", 9)
    c1.drawString(50, 675, "Member Name: Pooja Sharma")
    c1.drawString(350, 675, "UAN: 100982341120")
    c1.drawString(50, 655, "Claim ID: DLCPM261099482")
    c1.drawString(350, 655, "Claim Date: 02 June 2026")
    c1.setFont("Helvetica-Bold", 9)
    c1.setFillColor(colors.red)
    c1.drawString(50, 625, "Claim Status: REJECTED")
    c1.drawString(50, 605, "Rejection Code: EPFO-REJ-DATE-MISMATCH")
    c1.setFont("Helvetica", 9)
    c1.drawString(50, 585, "Rejection Reason: Date of Exit 31/03/2023 in Member Master conflicts with employer service record.")
    c1.setFillColor(colors.black)
    c1.drawString(50, 555, "Remedial Directive: Submit Joint Declaration countersigned by Employer under Revised SOP.")
    c1.showPage()
    c1.save()

    # 2. Company Relieving Letter
    pdf2_path = os.path.join(output_dir, "02_company_relieving_certificate.pdf")
    c2 = canvas.Canvas(pdf2_path, pagesize=letter)
    c2.setFont("Helvetica-Bold", 12)
    c2.drawString(50, 750, "TECHVENTURES INDIA PRIVATE LIMITED - HR SERVICES")
    c2.line(50, 740, 550, 740)
    c2.setFont("Helvetica-Bold", 10)
    c2.drawString(50, 715, "SERVICE RELIEVING & EXPERIENCE CERTIFICATE")
    c2.setFont("Helvetica", 9)
    c2.drawString(50, 690, "To Whomsoever It May Concern,")
    c2.drawString(50, 665, "This is to certify that Ms. Pooja Sharma (Emp ID: TV-4412) served as Senior Analyst.")
    c2.drawString(50, 645, "Date of Joining: 01/08/2020")
    c2.drawString(50, 625, "Date of Relieving / Exit: 15/04/2023")
    c2.drawString(50, 595, "All dues have been settled. Reason for exit: Resignation.")
    c2.showPage()
    c2.save()

    metadata = {
        "case_id": "CASE-EPFO-CLAIM",
        "domain_id": "epfo_claim",
        "citizen_name": "Pooja Sharma",
        "evidence_files": [
            {
                "file": "01_epfo_claim_rejection.pdf",
                "type": "pdf",
                "title": "EPFO Form 19 Claim Rejection Slip",
                "extractions": [
                    {
                        "field": "error_code",
                        "value": "EPFO-REJ-DATE-MISMATCH",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.22, 0.08, 0.24, 0.45],
                        "raw_text": "Rejection Code: EPFO-REJ-DATE-MISMATCH",
                        "confidence": 0.99
                    },
                    {
                        "field": "date_of_exit",
                        "value": "2023-03-31",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.24, 0.08, 0.27, 0.95],
                        "raw_text": "Date of Exit 31/03/2023 in Member Master",
                        "confidence": 0.99
                    }
                ]
            },
            {
                "file": "02_company_relieving_certificate.pdf",
                "type": "pdf",
                "title": "Company Relieving Certificate",
                "extractions": [
                    {
                        "field": "date_of_exit",
                        "value": "2023-04-15",
                        "category": "FACT",
                        "page": 1,
                        "bbox": [0.20, 0.08, 0.22, 0.45],
                        "raw_text": "Date of Relieving / Exit: 15/04/2023",
                        "confidence": 0.99
                    }
                ]
            }
        ]
    }

    with open(os.path.join(output_dir, "epfo_metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"Generated EPFO Evidence in {output_dir}")


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    create_flagship_dbt_evidence(os.path.join(base_dir, "flagship_dbt"))
    create_epfo_evidence(os.path.join(base_dir, "epfo_case"))
