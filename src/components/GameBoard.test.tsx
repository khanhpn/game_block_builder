import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createInitialState } from "@/game/reducer";
import { GameBoard } from "@/components/GameBoard";

describe("GameBoard", () => {
  it("renders 200 cells with active and ghost pieces", () => {
    render(
      <GameBoard
        state={{ ...createInitialState(() => 0.5), status: "playing" }}
        dispatch={() => undefined}
      />
    );
    expect(screen.getAllByRole("gridcell")).toHaveLength(200);
    expect(document.querySelectorAll(".cell--active")).toHaveLength(4);
    expect(document.querySelectorAll(".cell--ghost")).toHaveLength(4);
  });

  it("shows the ready overlay", () => {
    render(
      <GameBoard
        state={createInitialState(() => 0.5)}
        dispatch={() => undefined}
      />
    );
    expect(
      screen.getByRole("button", { name: /start game/i })
    ).toBeInTheDocument();
  });
});
