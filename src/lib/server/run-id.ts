const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

/**
 * Request-local fetch wrapper for the Lovable AI Gateway.
 * Resends the run ID minted by the gateway/backend on follow-up calls and
 * captures the minted one from the first response. Never mint IDs in app code.
 */
export function createLovableAiGatewayRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  let resolveRunId: (value: string | undefined) => void = () => {};
  let runIdResolved = false;
  const runIdReady = new Promise<string | undefined>((resolve) => {
    resolveRunId = resolve;
  });

  const publishRunId = (value?: string) => {
    const nextRunId = value?.trim() || undefined;
    if (!runId && nextRunId) {
      runId = nextRunId;
    }
    if (!runIdResolved) {
      runIdResolved = true;
      resolveRunId(runId);
    }
  };
  if (runId) publishRunId(runId);

  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }

      try {
        const response = await fetch(input, { ...init, headers });
        publishRunId(response.headers.get(LOVABLE_AIG_RUN_ID_HEADER) ?? undefined);
        return response;
      } catch (error) {
        publishRunId(undefined);
        throw error;
      }
    },
    getRunId: () => runId,
    waitForRunId: () => runIdReady,
  };
}

/** Reads a backend/gateway-issued run ID from the incoming request, if any. */
export function getLovableAiGatewayRunId(request: Request): string | undefined {
  return request.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined;
}

/** Forwards only the gateway-issued run ID header onto the response. */
export function withLovableAiGatewayRunIdHeader(
  response: Response,
  runIdFetch: { getRunId: () => string | undefined },
): Response {
  const runId = runIdFetch.getRunId();
  if (!runId || response.headers.has(LOVABLE_AIG_RUN_ID_HEADER)) return response;
  const headers = new Headers(response.headers);
  headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
