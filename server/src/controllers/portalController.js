import { PORTAL_REGISTRY } from '../data/mockPortals.js';

/**
 * Get status of all statutory government portals
 */
export function getPortalsStatus(req, res) {
  const statuses = Object.values(PORTAL_REGISTRY).map(portal => ({
    id: portal.id,
    name: portal.name,
    ministry: portal.ministry,
    status: portal.status,
    latencyMs: portal.latencyMs,
    recordCount: portal.records ? Object.keys(portal.records).length : 'N/A',
    integrationMode: portal.status === 'SANDBOX' ? 'SANDBOX' : 'MOCK_DATA'
  }));

  res.json({
    success: true,
    totalPortals: statuses.length,
    portals: statuses,
    systemTime: new Date().toISOString()
  });
}

/**
 * Perform a live multi-portal statutory check for a given PAN / GSTIN / URN / CIN
 */
export function queryStatutoryData(pan, gstin, udyam, cin, epfo, esic, startupDpiitNo, nsicCertNo, oemAuthorizationCode, digiLockerHash) {
  const results = {
    udyam: null,
    gstn: null,
    incomeTax: null,
    mca21: null,
    epfo: null,
    esic: null,
    startup: null,
    nsic: null,
    debarment: null,
    digiLocker: null,
    oemAuthorization: null
  };

  // Udyam check
  if (udyam && PORTAL_REGISTRY.UDYAM.records[udyam]) {
    results.udyam = PORTAL_REGISTRY.UDYAM.records[udyam];
  } else if (pan) {
    const foundUdyam = Object.values(PORTAL_REGISTRY.UDYAM.records).find(r => r.panLinked === pan);
    if (foundUdyam) results.udyam = foundUdyam;
  }

  // GSTN check
  if (gstin && PORTAL_REGISTRY.GSTN.records[gstin]) {
    results.gstn = PORTAL_REGISTRY.GSTN.records[gstin];
  } else if (pan) {
    const foundGst = Object.values(PORTAL_REGISTRY.GSTN.records).find(r => r.pan === pan);
    if (foundGst) results.gstn = foundGst;
  }

  // Income Tax / PAN check
  if (pan && PORTAL_REGISTRY.INCOME_TAX.records[pan]) {
    results.incomeTax = PORTAL_REGISTRY.INCOME_TAX.records[pan];
  }

  // MCA21 / ROC check
  if (cin && PORTAL_REGISTRY.MCA21.records[cin]) {
    results.mca21 = PORTAL_REGISTRY.MCA21.records[cin];
  }

  // EPFO check
  if (epfo && PORTAL_REGISTRY.EPFO.records[epfo]) {
    results.epfo = PORTAL_REGISTRY.EPFO.records[epfo];
  }

  // ESIC check
  if (esic && PORTAL_REGISTRY.ESIC.records[esic]) {
    results.esic = PORTAL_REGISTRY.ESIC.records[esic];
  }

  // NSIC check
  if (nsicCertNo && PORTAL_REGISTRY.NSIC.records[nsicCertNo]) {
    results.nsic = PORTAL_REGISTRY.NSIC.records[nsicCertNo];
  }

  // OEM authorization check
  if (oemAuthorizationCode && PORTAL_REGISTRY.OEM_AUTHORIZATION?.records?.[oemAuthorizationCode]) {
    results.oemAuthorization = PORTAL_REGISTRY.OEM_AUTHORIZATION.records[oemAuthorizationCode];
  } else if (oemAuthorizationCode) {
    results.oemAuthorization = { authorizationCode: oemAuthorizationCode, status: 'NOT_FOUND' };
  }

  // DigiLocker hash verification
  if (digiLockerHash) {
    const verified = PORTAL_REGISTRY.DIGILOCKER.verifyHash(digiLockerHash);
    results.digiLocker = {
      hash: digiLockerHash,
      status: verified ? 'AUTHENTIC' : 'NOT_REGISTERED',
      verified
    };
  }

  // Startup India check
  if (PORTAL_REGISTRY.STARTUP_INDIA.records) {
    const foundStartup = Object.values(PORTAL_REGISTRY.STARTUP_INDIA.records).find(s => 
      (pan && s.pan === pan) || (udyam && s.udyam === udyam) || (results.mca21 && s.entityName === results.mca21.companyName)
    );
    if (foundStartup) results.startup = foundStartup;
  }

  // Debarment / Blacklist check
  if (pan && PORTAL_REGISTRY.DEBARMENT_REGISTRY.records[pan]) {
    results.debarment = PORTAL_REGISTRY.DEBARMENT_REGISTRY.records[pan];
  } else {
    results.debarment = {
      isDebarred: false,
      status: 'CLEARED',
      recordsFound: 0
    };
  }

  return results;
}

/**
 * API route to inspect a single portal
 */
export function getPortalDetails(req, res) {
  const { portalId } = req.params;
  const portal = Object.values(PORTAL_REGISTRY).find(p => p.id.toLowerCase() === portalId.toLowerCase());
  
  if (!portal) {
    return res.status(404).json({ success: false, message: 'Portal not found' });
  }

  res.json({
    success: true,
    portal
  });
}
