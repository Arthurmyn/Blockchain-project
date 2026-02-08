const API_URL = 'http://localhost:5000/api';

export const api = {
  async getCampaigns() {
    const res = await fetch(`${API_URL}/campaigns`);
    return res.json();
  },

  async createCampaign(data) {
    const res = await fetch(`${API_URL}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async recordDonation(data) {
    const res = await fetch(`${API_URL}/donate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};