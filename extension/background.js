// Background service worker: check GitHub releases and download latest ZIP

const REPO_API_LATEST = 'https://api.github.com/repos/h4MeMengoding/hame-bookmark-extension/releases/latest';

function semverCompare(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

async function fetchLatestRelease() {
  const res = await fetch(REPO_API_LATEST, {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message?.type === 'check_update') {
        const manifest = chrome.runtime.getManifest();
        const current = manifest.version;
        const latest = await fetchLatestRelease();
        const latestTag = latest.tag_name || latest.name || '';
        // normalize tag like v1.2.3 -> 1.2.3
        const normLatest = latestTag.startsWith('v') ? latestTag.slice(1) : latestTag;
        const cmp = semverCompare(normLatest, current);
        // find a downloadable asset if available
        let downloadUrl = null;
        if (latest.assets && latest.assets.length > 0) {
          // prefer zip asset
          const zipAsset = latest.assets.find(a => a.name && a.name.endsWith('.zip'));
          if (zipAsset) downloadUrl = zipAsset.browser_download_url;
        }
        // fallback to zipball_url
        if (!downloadUrl && latest.zipball_url) downloadUrl = latest.zipball_url;

        sendResponse({
          ok: true,
          currentVersion: current,
          latestVersion: normLatest,
          updateAvailable: cmp === -1,
          downloadUrl,
        });
        return;
      }

      if (message?.type === 'download_update') {
        const url = message.url;
        if (!url) {
          sendResponse({ ok: false, error: 'No URL provided' });
          return;
        }
        try {
          const manifest = chrome.runtime.getManifest();
          const filename = `hame-bookmark-extension-v${manifest.version}-update.zip`;
          // Start download but don't rely on callback (service worker may unload)
          chrome.downloads.download({ url, filename }, () => {});
          // Respond immediately to sender
          sendResponse({ ok: true, message: 'Download started' });
        } catch (err) {
          sendResponse({ ok: false, error: err.message });
        }
        return;
      }

      sendResponse({ ok: false, error: 'Unknown message' });
    } catch (err) {
      sendResponse({ ok: false, error: err.message });
    }
  })();
  return true; // will respond asynchronously
});
