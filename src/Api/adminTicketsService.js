/* ══════════════════════════════════════════════════════
   Admin Tickets — API Service
   Handles all API calls for the Admin Support Tickets page
   ══════════════════════════════════════════════════════ */
import axiosInstance from "./axiosInstance";

/**
 * Normalize a ticket object from API → Frontend shape.
 */
const normalizeTicket = (t) => ({
  id: t.id || t.ticketId,
  userName: t.userName || t.userFullName || "",
  userEmail: t.userEmail || "",
  userRole: t.userRole || "Investor",
  category: t.category || "Other",
  subject: t.subject || t.title || "",
  message: t.message || t.description || t.body || "",
  createdAt: t.createdAt || null,
  status: t.status || "Open",
  adminReply: t.adminReply || t.reply || t.replyMessage || null,
});

/* ════════════════════════════════════════════════════
   API Functions
   ════════════════════════════════════════════════════ */

/**
 * 1. GET /api/Admin/tickets
 *    Fetch all support tickets with optional filtering.
 *
 *    @param {Object} [options]
 *    @param {string} [options.status] - "Open" | "Resolved"
 *    @returns {Promise<Array>} normalized tickets
 */
export async function getAdminTickets({ status } = {}) {
  const params = {};
  if (status && status !== "All") params.status = status;

  const res = await axiosInstance.get("/Admin/tickets", { params });
  const payload = res.data?.data ?? res.data?.value ?? res.data;

  // Paginated response
  if (payload?.items && Array.isArray(payload.items)) {
    return payload.items.map(normalizeTicket);
  }
  // Flat array
  if (Array.isArray(payload)) {
    return payload.map(normalizeTicket);
  }
  return [];
}

/**
 * 2. PUT /api/Admin/tickets/{id}/reply
 *    Reply to a support ticket and mark it as Resolved.
 *
 *    @param {string} ticketId
 *    @param {string} replyMessage - The admin's reply text
 *    @returns {Promise<Object>} API response
 */
export async function replyToTicket(ticketId, replyText) {
  const res = await axiosInstance.put(`/Admin/tickets/${ticketId}/reply`, {
    reply: replyText,
  });
  return res.data;
}
