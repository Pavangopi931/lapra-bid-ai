const API_BASE = 'http://localhost:5000/api';

async function fetchWithTimeout(url, options = {}, timeout = 30000) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Server request timed out after 30 seconds.');
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchBidders(params = {}) {
  const query = new URLSearchParams(params).toString();

  const res = await fetchWithTimeout(
    `${API_BASE}/bidders?${query}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch bidders');
  }

  return res.json();
}

export async function fetchBidderDetails(id) {
  const res = await fetchWithTimeout(
    `${API_BASE}/bidders/${id}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch bidder details');
  }

  return res.json();
}

export async function reVerifyBidder(
  id,
  officerId = 'OFFICER-GEM-BUYER-042'
) {
  const res = await fetchWithTimeout(
    `${API_BASE}/bidders/${id}/reverify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ officerId })
    }
  );

  if (!res.ok) {
    throw new Error('Failed to re-verify bidder');
  }

  return res.json();
}

export async function recordOfficerDecision(
  id,
  decisionData
) {
  const res = await fetchWithTimeout(
    `${API_BASE}/bidders/${id}/decision`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(decisionData)
    }
  );

  if (!res.ok) {
    throw new Error('Failed to record decision');
  }

  return res.json();
}

export async function fetchClarificationNotice(id) {
  const res = await fetchWithTimeout(
    `${API_BASE}/bidders/${id}/clarification`
  );

  if (!res.ok) {
    throw new Error(
      'Failed to fetch clarification notice draft'
    );
  }

  return res.json();
}

export async function createAndVerifyBidder(formData) {
  console.log('[CLIENT] Sending new bidder verification...');

  const res = await fetchWithTimeout(
    `${API_BASE}/bidders/new`,
    {
      method: 'POST',
      body: formData
    },
    60000
  );

  console.log(
    '[CLIENT] Backend response received:',
    res.status
  );

  if (!res.ok) {
    const errorData =
      await res.json().catch(() => ({}));

    throw new Error(
      errorData.message ||
      `Verification failed with HTTP ${res.status}`
    );
  }

  return res.json();
}

export async function resetBidders() {
  const res = await fetchWithTimeout(
    `${API_BASE}/bidders/reset`,
    {
      method: 'POST'
    }
  );

  if (!res.ok) {
    throw new Error('Failed to reset dataset');
  }

  return res.json();
}

export async function fetchPortalsStatus() {
  const res = await fetchWithTimeout(
    `${API_BASE}/portals/status`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch portals status');
  }

  return res.json();
}

export async function fetchAuditLogs(
  entityId = null
) {
  const query = entityId
    ? `?entityId=${encodeURIComponent(entityId)}`
    : '';

  const res = await fetchWithTimeout(
    `${API_BASE}/audit-logs${query}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch audit logs');
  }

  return res.json();
}

export async function fetchGeminiConfig() {
  const res = await fetchWithTimeout(
    `${API_BASE}/config/gemini`
  );

  if (!res.ok) {
    throw new Error(
      'Failed to fetch Gemini configuration'
    );
  }

  return res.json();
}

export async function updateGeminiConfig(configData) {
  const res = await fetchWithTimeout(
    `${API_BASE}/config/gemini`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(configData)
    }
  );

  if (!res.ok) {
    const errorData =
      await res.json().catch(() => ({}));

    throw new Error(
      errorData.message ||
      'Failed to update Gemini API Key'
    );
  }

  return res.json();
}
export async function verifyAuditChain() {
  const res = await fetchWithTimeout(`${API_BASE}/audit-logs/verify`);
  if (!res.ok) throw new Error('Failed to verify audit chain');
  return res.json();
}
