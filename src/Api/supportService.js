/* ══════════════════════════════════════════════════════
   Support — API Service
   Handles support ticket API calls for Investor/Founder pages
   ══════════════════════════════════════════════════════ */
import axiosInstance from "./axiosInstance";

/**
 * Normalize a ticket from API → Frontend shape.
 */
const normalizeTicket = (t) => ({
  id: t.id || t.ticketId,
  subject: t.subject || t.title || "",
  message: t.message || t.description || t.body || "",
  category: t.category || "Other",
  status: t.status || "Open",
  date: t.createdAt
    ? new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "",
  createdAt: t.createdAt || null,
  adminReply: t.adminReply || t.reply || t.replyMessage || null,
});

/**
 * POST /api/Support/tickets
 * Create a new support ticket.
 *
 * @param {Object} data
 * @param {string} data.category
 * @param {string} data.subject
 * @param {string} data.message
 * @returns {Promise<Object>}
 */
export async function createSupportTicket({ category, subject, message }) {
  const res = await axiosInstance.post("/Support/tickets", {
    category,
    subject,
    message,
  });
  return res.data;
}

/**
 * GET /api/Support/my-tickets
 * Get current user's support tickets.
 *
 * @returns {Promise<Array>} normalized tickets
 */
export async function getMyTickets() {
  const res = await axiosInstance.get("/Support/my-tickets");
  const payload = res.data?.data ?? res.data?.value ?? res.data;

  if (payload?.items && Array.isArray(payload.items)) {
    return payload.items.map(normalizeTicket);
  }
  if (Array.isArray(payload)) {
    return payload.map(normalizeTicket);
  }
  return [];
}
