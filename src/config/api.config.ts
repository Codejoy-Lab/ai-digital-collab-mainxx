const API_BASE_URL = 'http://localhost:3005';

export const buildApiUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};

export const WS_BASE_URL = 'ws://localhost:3005';

export const API_ENDPOINTS = {
  // Demo orchestration
  PROCESS_DOCUMENT: '/demo-orchestration/process-document',

  // Auto workflows
  START_AUTO_WORKFLOW: '/auto-workflow/start',

  // Manual workflows
  MANUAL_WORKFLOW: '/manual-workflow',

  // WebSocket
  WEBSOCKET: (sessionId: string) => `/ws/${sessionId}`,
};

export default {
  buildApiUrl,
  WS_BASE_URL,
  API_ENDPOINTS,
};