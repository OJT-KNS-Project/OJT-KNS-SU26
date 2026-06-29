export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
  },
  USERS: {
    LIST: "/admin/users",
    CREATE: "/admin/users",
    UPDATE: (id: string) => `/admin/users/${id}`,
    UPDATE_STATUS: (id: string) => `/admin/users/${id}/status`,
  },
  COURSES: {
    LIST: "/courses",
    CREATE: "/courses",
    UPDATE: (id: string) => `/courses/${id}`,
    UPDATE_STATUS: (id: string) => `/courses/${id}/status`,
    DELETE: (id: string) => `/courses/${id}`,
    GET_ENROLLMENTS: (courseId: string) => `/courses/${courseId}/enrollments`,
    SAVE_ENROLLMENTS: (courseId: string) => `/courses/${courseId}/enrollments`,
  },
  QA: {
    LIST: "/admin/qa-history",
  },
  DOCUMENTS: {
    LIST: "/documents",
    UPLOAD: "/documents/upload",
    UPDATE_STATUS: (id: string) => `/documents/${id}/status`,
    DELETE: (id: string) => `/documents/${id}`,
  },
  CHAT: {
    HISTORY: (courseId: string) => `/chat?courseId=${courseId}`,
    SEND: "/chat",
  },
  DASHBOARD: {
    LOGS: "/admin/audit-logs",
  },
} as const;

export const QUERY_KEYS = {
  AUTH: ["auth"] as const,
  USERS: ["users"] as const,
  COURSES: ["courses"] as const,
  QA: ["qa-history"] as const,
  DOCUMENTS: ["documents"] as const,
  CHAT: ["chat"] as const,
  DASHBOARD: ["dashboard"] as const,
} as const;

