import type { Case, UIGraphData } from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

export const api = {
  async getDomains() {
    const res = await fetch(`${API_BASE}/domains`);
    return res.json();
  },

  async getCases(): Promise<Case[]> {
    const res = await fetch(`${API_BASE}/cases`);
    return res.json();
  },

  async getCase(caseId: string): Promise<Case> {
    const res = await fetch(`${API_BASE}/cases/${caseId}`);
    return res.json();
  },

  async createCase(data: { title: string; citizen_name: string; domain_id: string; objective?: string }): Promise<Case> {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async ingestFlagship(caseId: string): Promise<Case> {
    const res = await fetch(`${API_BASE}/cases/${caseId}/ingest-flagship`, {
      method: 'POST',
    });
    return res.json();
  },

  async triggerReasoning(caseId: string): Promise<Case> {
    const res = await fetch(`${API_BASE}/cases/${caseId}/reason`, {
      method: 'POST',
    });
    return res.json();
  },

  async grantConsent(caseId: string, actionId: string, consent: boolean = true) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/actions/${actionId}/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consent }),
    });
    return res.json();
  },

  async submitAction(caseId: string, actionId: string) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/actions/${actionId}/submit`, {
      method: 'POST',
    });
    return res.json();
  },

  async advanceTime(caseId: string, days: number = 15): Promise<Case> {
    const res = await fetch(`${API_BASE}/cases/${caseId}/advance-time`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days }),
    });
    return res.json();
  },

  async simulateEvent(caseId: string, eventType: string): Promise<any> {
    const res = await fetch(`${API_BASE}/cases/${caseId}/simulate-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: eventType }),
    });
    return res.json();
  },

  async resolveDbtChain(caseId: string) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/resolve-dbt-chain`, {
      method: 'POST',
    });
    return res.json();
  },

  async executeAutopilot(caseId: string) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/autopilot`, {
      method: 'POST',
    });
    return res.json();
  },

  async getGraph(caseId: string): Promise<UIGraphData> {
    const res = await fetch(`${API_BASE}/cases/${caseId}/graph`);
    return res.json();
  },

  async resetMockState() {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
    });
    return res.json();
  },
};
