import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useNextPiecePreview } from "@/hooks/useNextPiecePreview";

describe("useNextPiecePreview", () => {
  it("builds a centered 4 by 4 preview", () => {
    const { result } = renderHook(() => useNextPiecePreview("I"));

    expect(result.current).toHaveLength(16);
    expect(result.current.filter(Boolean)).toHaveLength(4);
    expect(result.current.slice(4, 8)).toEqual([true, true, true, true]);
  });
});
