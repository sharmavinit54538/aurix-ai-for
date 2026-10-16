export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>App Update Available</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        background: #090d16;
        color: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        padding: 1rem;
      }
      .card {
        width: 100%;
        max-width: 28rem;
        background: #0d1526;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
      }
      .icon-container {
        margin: 0 auto 1rem;
        width: 3rem;
        height: 3rem;
        border-radius: 9999px;
        background: rgba(59, 130, 246, 0.12);
        color: #60a5fa;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .spinner {
        width: 1.5rem;
        height: 1.5rem;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      h1 {
        font-size: 1.25rem;
        font-weight: 600;
        letter-spacing: -0.025em;
        margin: 0 0 0.5rem;
        color: #f8fafc;
      }
      p {
        font-size: 0.875rem;
        color: #94a3b8;
        margin: 0 0 1.5rem;
        line-height: 1.5;
      }
      .actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .btn {
        display: inline-flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
        padding: 0.625rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        transition: background-color 0.2s, color 0.2s;
        border: 1px solid transparent;
      }
      .btn-primary {
        background: #f8fafc;
        color: #0f172a;
      }
      .btn-primary:hover {
        background: #e2e8f0;
      }
      .btn-secondary {
        background: transparent;
        color: #f8fafc;
        border-color: rgba(255, 255, 255, 0.15);
      }
      .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon-container">
        <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>
      <h1>App Update Available</h1>
      <p>A new version of OFC360 has been deployed. Please refresh to load the latest features and updates.</p>
      <div class="actions">
        <button class="btn btn-primary" onclick="const u = new URL(window.location.href); u.searchParams.set('_v', String(Date.now())); window.location.replace(u.toString());">
          Update & Refresh Now
        </button>
        <a class="btn btn-secondary" href="/">
          Back to Home
        </a>
      </div>
    </div>
  </body>
</html>`;
}
