/* ══════════════════════════════════════════════════════
   Admin Users — API Service
   Handles all API calls for the Admin Users management page
   ══════════════════════════════════════════════════════ */
import axiosInstance from "./axiosInstance";

/* ── Normalize helpers ── */

/**
 * Map role from API → Frontend.
 * The API returns role as a numeric string ("0", "1", "2") instead of
 * the enum name. This maps them to readable role names.
 *
 * NOTE: If the backend fixes this to return "Founder"/"Investor"/"Admin",
 *       the mapping will pass them through unchanged via the fallback.
 */
const mapRole = (role) => {
  const mapping = {
    "0": "Investor",
    "1": "Founder",
    "2": "Admin",
    // String values pass through if backend is already fixed
    Investor: "Investor",
    Founder: "Founder",
    Admin: "Admin",
  };
  return mapping[role] ?? role ?? "Investor";
};

/**
 * Map kycStatus from API format → Frontend display format.
 * Handles all known statuses from the backend.
 */
const mapKycStatus = (status) => {
  const mapping = {
    NotStarted: "Not Started",
    "Not Started": "Not Started",
    Pending: "Pending",
    Verified: "Verified",
    Rejected: "Rejected",
    Declined: "Rejected",
  };
  return mapping[status] || status || "Not Started";
};

/**
 * Normalize a single user object from the API → Frontend shape.
 * Handles field-name differences, defaults, role/kycStatus mapping.
 */
const normalizeUser = (u) => ({
  id: u.id || u.userId,
  firstName: u.firstName || "",
  lastName: u.lastName || "",
  email: u.email || "",
  role: mapRole(u.role),
  status: u.status || "Active",
  kycStatus: mapKycStatus(u.kycStatus),
  createdAt: u.createdAt || null,
  // Activity stats — API may return null, we default to 0
  projectCount: u.projectCount ?? u.projectsCount ?? 0,
  totalRaised: u.totalRaised ?? u.totalFundsRaised ?? 0,
  investmentCount: u.investmentCount ?? u.investmentsCount ?? 0,
  totalInvested: u.totalInvested ?? u.totalAmountInvested ?? 0,
  // Ban info
  banReason: u.banReason || null,
  banExpiry: u.banExpiry ?? u.banExpiryDate ?? null,
});

/* ════════════════════════════════════════════════════
   API Functions
   ════════════════════════════════════════════════════ */

/**
 * 1. GET /api/Admin/users
 *    Fetch all users with optional filtering & pagination.
 *
 *    @param {Object} options
 *    @param {string} [options.role]        - "Founder" | "Investor" | undefined
 *    @param {string} [options.status]      - "Active" | "Banned" | undefined
 *    @param {string} [options.searchQuery] - free-text search
 *    @param {number} [options.pageNumber]  - 1-based page number
 *    @param {number} [options.pageSize]    - items per page
 *    @returns {Promise<{ users: Array, totalCount: number, totalPages: number, pageNumber: number }>}
 */
export async function getAdminUsers({
  role,
  status,
  searchQuery,
  pageNumber = 1,
  pageSize = 10,
} = {}) {
  // API uses "page" not "pageNumber"
  const params = { page: pageNumber, pageSize };
  if (role) params.role = role;
  if (status) params.status = status;
  if (searchQuery?.trim()) params.searchQuery = searchQuery.trim();

  const res = await axiosInstance.get("/Admin/users", { params });

  // Handle multiple possible response shapes from the API
  const payload = res.data?.data ?? res.data?.value ?? res.data;

  // If paginated response (has items array)
  if (payload?.items && Array.isArray(payload.items)) {
    return {
      users: payload.items.map(normalizeUser),
      totalCount: payload.totalCount ?? payload.items.length,
      totalPages: payload.totalPages ?? 1,
      pageNumber: payload.page ?? payload.pageNumber ?? pageNumber,
    };
  }

  // If the response is a flat array
  if (Array.isArray(payload)) {
    return {
      users: payload.map(normalizeUser),
      totalCount: payload.length,
      totalPages: 1,
      pageNumber: 1,
    };
  }

  // Fallback
  return { users: [], totalCount: 0, totalPages: 1, pageNumber: 1 };
}

/**
 * 2. GET /api/Admin/users/{userId}
 *    Fetch detailed info for a single user.
 *
 *    @param {string} userId
 *    @returns {Promise<Object>} normalized user object
 */
export async function getAdminUserById(userId) {
  const res = await axiosInstance.get(`/Admin/users/${userId}`);
  const raw = res.data?.data ?? res.data?.value ?? res.data;
  return normalizeUser(raw);
}

/**
 * 3. POST /api/Admin/users/{userId}/ban
 *    Ban a user with a reason and duration.
 *
 *    @param {string} userId
 *    @param {Object} payload
 *    @param {string} payload.reason         - why the user is being banned
 *    @param {number} payload.durationInDays - number of days (-1 for permanent)
 *    @returns {Promise<Object>} API response
 */
export async function banUser(userId, { reason, durationInDays }) {
  const res = await axiosInstance.post(`/Admin/users/${userId}/ban`, {
    reason,
    durationInDays,
  });
  return res.data;
}

/**
 * 4. POST /api/Admin/users/{userId}/unban
 *    Reactivate a banned user.
 *
 *    @param {string} userId
 *    @returns {Promise<Object>} API response
 */
export async function unbanUser(userId) {
  const res = await axiosInstance.post(`/Admin/users/${userId}/unban`);
  return res.data;
}
