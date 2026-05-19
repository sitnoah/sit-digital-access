"use client";

import { useCallback, useEffect, useState } from "react";
import { repairStatusApi } from "@/lib/repair-status-api";
import { RepairStatusError, type RepairStatusResult } from "@/types/repair-status";

type RepairStatusLookupState =
  | { status: "idle"; repair: null; error: null }
  | { status: "loading"; repair: null; error: null }
  | { status: "success"; repair: RepairStatusResult; error: null }
  | { status: "error"; repair: null; error: RepairStatusError };

function toPublicStatusError(error: unknown) {
  if (error instanceof RepairStatusError) return error;
  return new RepairStatusError("SERVER_ERROR", "Repair status could not be loaded.");
}

export function useRepairStatus(initialTicketId = "", initialToken = "") {
  const [ticketId, setTicketId] = useState(initialTicketId);
  const [token, setToken] = useState(initialToken);
  const [showToken, setShowToken] = useState(false);
  const [helperOpen, setHelperOpen] = useState(false);
  const [state, setState] = useState<RepairStatusLookupState>({ status: "idle", repair: null, error: null });

  const lookup = useCallback(async (nextTicketId = ticketId, nextToken = token) => {
    const trimmedTicketId = nextTicketId.trim();
    const trimmedToken = nextToken.trim();

    if (!trimmedTicketId || !trimmedToken) {
      setState({
        status: "error",
        repair: null,
        error: new RepairStatusError("INVALID_LOOKUP", "Enter your ticket ID and status token.")
      });
      return null;
    }

    setState({ status: "loading", repair: null, error: null });
    try {
      const repair = await repairStatusApi.lookup(trimmedTicketId, trimmedToken);
      setState({ status: "success", repair, error: null });
      return repair;
    } catch (error) {
      setState({ status: "error", repair: null, error: toPublicStatusError(error) });
      return null;
    }
  }, [ticketId, token]);

  useEffect(() => {
    if (!initialTicketId || !initialToken) return;
    void lookup(initialTicketId, initialToken);
  }, [initialTicketId, initialToken, lookup]);

  async function pasteTokenFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) setToken(text.trim());
    } catch {
      setState({
        status: "error",
        repair: null,
        error: new RepairStatusError("INVALID_LOOKUP", "Clipboard access is unavailable. Paste the token manually.")
      });
    }
  }

  return {
    ticketId,
    token,
    showToken,
    helperOpen,
    state,
    setTicketId,
    setToken,
    setShowToken,
    setHelperOpen,
    pasteTokenFromClipboard,
    lookup
  };
}
