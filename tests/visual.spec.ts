// Captures our build in each reference state. Compare with: npm run compare -- <state|all>
import { test } from "@playwright/test";
import { STATE_NAMES, captureState } from "./visual-states";

// Transitions resolve instantly, so captures show the settled end state.
test.use({ reducedMotion: "reduce" });

test.describe("visual capture", () => {
  for (const state of STATE_NAMES) {
    test(state, async ({ page }) => {
      await captureState(page, state);
    });
  }
});
