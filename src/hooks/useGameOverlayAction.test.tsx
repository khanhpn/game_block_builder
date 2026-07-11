import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useGameOverlayAction } from "@/hooks/useGameOverlayAction";

describe("useGameOverlayAction", () => {
  it.each([
    ["ready", { type: "START" }],
    ["paused", { type: "TOGGLE_PAUSE" }],
    ["gameover", { type: "RESTART" }],
  ] as const)("dispatches the action for %s status", (status, action) => {
    const dispatch = vi.fn();
    const { result } = renderHook(() => useGameOverlayAction(status, dispatch));

    act(() => result.current());

    expect(dispatch).toHaveBeenCalledWith(action);
  });
});
