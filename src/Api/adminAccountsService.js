/* ══════════════════════════════════════════════════════
   Admin Accounts — API Service
   Handles all API calls for the Admin Accounts page
   ══════════════════════════════════════════════════════ */
import axiosInstance from "./axiosInstance";

/**
 * Normalize admin object from API → Frontend shape.
 */
const normalizeAdmin = (a) => ({
  id: a.id || a.adminId,
  firstName: a.firstName || "",
  lastName: a.lastName || "",
  email: a.email || "",
  createdAt: a.createdAt || null,
  lastLogin: a.lastLogin ?? a.lastLoginAt ?? null,
});

/* ════════════════════════════════════════════════════
   API Functions
   ════════════════════════════════════════════════════ */

/**
 * 1. GET /api/Admin/accounts
 *    Fetch all admin accounts.
 */
export async function getAdminAccounts() {
  const res = await axiosInstance.get("/Admin/accounts");
  const payload = res.data?.data ?? res.data?.value ?? res.data;

  if (Array.isArray(payload)) {
    return payload.map(normalizeAdmin);
  }
  // If paginated
  if (payload?.items && Array.isArray(payload.items)) {
    return payload.items.map(normalizeAdmin);
  }
  return [];
}

/**
 * 2. POST /api/Admin/accounts
 *    Create a new admin account.
 *
 *    @param {Object} data
 *    @param {string} data.firstName
 *    @param {string} data.lastName
 *    @param {string} data.email
 *    @param {string} data.password
 *    @returns {Promise<Object>} created admin
 */
export async function createAdminAccount({ firstName, lastName, email, password }) {
  const res = await axiosInstance.post("/Admin/accounts", {
    firstName,
    lastName,
    email,
    password,
  });
  const raw = res.data?.data ?? res.data?.value ?? res.data;
  return raw ? normalizeAdmin(raw) : null;
}

/**
 * 3. GET /api/Admin/accounts/{id}
 *    Get a single admin account by ID.
 */
export async function getAdminAccountById(id) {
  const res = await axiosInstance.get(`/Admin/accounts/${id}`);
  const raw = res.data?.data ?? res.data?.value ?? res.data;
  return normalizeAdmin(raw);
}

/**
 * 4. DELETE /api/Admin/accounts/{id}
 *    Delete an admin account.
 */
export async function deleteAdminAccount(id) {
  const res = await axiosInstance.delete(`/Admin/accounts/${id}`);
  return res.data;
}
