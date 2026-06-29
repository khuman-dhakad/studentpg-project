import React, { useState, useEffect } from "react";
import { getPendingListings, updateListingStatus } from "../services/api/admin.api";
import { formatINR } from "../utils/helpers";
import { MdCheck, MdClose, MdSecurity } from "react-icons/md";

export default function AdminDashboard() {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Will host the current item context ID
  const [error, setError] = useState("");

  /**
   * FETCH PENDING LISTINGS (With standard production mount safeguard)
   */
  useEffect(() => {
    let isMounted = true;
    
    const fetchPending = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getPendingListings();
        if (!isMounted) return;
        setPendingList(data || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load pending listings from server buffer.");
        setPendingList([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPending();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * APPROVE / REJECT ACTION ENGINE
   */
  const handleAction = async (targetId, statusAction) => {
    if (!targetId) return;
    
    try {
      setActionLoading(targetId);

      await updateListingStatus(targetId, statusAction);

      // Defending against database polymorphisms (MongoDB _id fallback fallback filtering)
      setPendingList((prev) =>
        prev.filter((item) => {
          const itemId = item.id || item._id;
          return itemId !== targetId;
        })
      );
    } catch (err) {
      console.error("Administrative update action matrix failure:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex-grow w-full">
      {/* HEADER BLOCK */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <MdSecurity className="text-amber-500 text-2xl animate-pulse" />
            <span>Admin Console Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System Operations Framework &bull; Verification Queue
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-center min-w-[70px]">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Queue
          </p>
          <p className="text-xl font-black text-amber-400">
            {pendingList.length}
          </p>
        </div>
      </div>

      {/* ERROR HANDLER LOG SYSTEM */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* CORE DISPLAY ROUTER PANELS */}
      {loading ? (
        <div className="text-center py-24 text-xs font-semibold text-slate-400">
          Querying secure storage buffers...
        </div>
      ) : pendingList.length === 0 ? (
        <div className="text-center py-20 text-xs font-medium text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white/50">
          No records requiring validation found inside active datastores.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Title Listing</th>
                  <th className="p-4">Registered Owner Address</th>
                  <th className="p-4">Region/Area</th>
                  <th className="p-4">Rate Matrix</th>
                  <th className="p-4 text-center">Operation Tokens</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {pendingList.map((item) => {
                  const resolvedId = item.id || item._id;
                  const isActioning = actionLoading === resolvedId;

                  return (
                    <tr key={resolvedId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900 text-sm">
                        {item.title}
                      </td>

                      <td className="p-4 text-slate-500 font-mono text-[11px]">
                        {item.owner || "Anonymous Host"}
                      </td>

                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                          {item.area}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-slate-900">
                        {formatPrice(item.price)}<span className="text-slate-400 font-normal">/mo</span>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            disabled={actionLoading !== null}
                            onClick={() => handleAction(resolvedId, "APPROVED")}
                            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all disabled:opacity-40 shadow-sm"
                          >
                            <MdCheck className="text-sm" /> 
                            <span>{isActioning && actionLoading === resolvedId ? "Processing..." : "Approve"}</span>
                          </button>

                          <button
                            disabled={actionLoading !== null}
                            onClick={() => handleAction(resolvedId, "REJECTED")}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all disabled:opacity-40 shadow-sm"
                          >
                            <MdClose className="text-sm" /> 
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}