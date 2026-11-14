# Little Leaf — Three Frontend Decisions

**Reference business:** [PodayOnline](https://www.podayonline.com/)  
**Reference domain:** Online plants and gardening retail  
**Our fictional business:** Little Leaf — indoor plant boutique for Islamabad and Rawalpindi

These records distinguish **observed interface behavior** from **possible effects**. Attach the investigation and implementation screenshots to the final PDF report; do not claim sales/conversion figures.

## Decision 1 — Make failed searches understandable

- **Problem (observed):** On PodayOnline, a normal search such as `rose` produced suggestions, but the misspelled query `roseyy` did not show a clear no-match explanation; the available way forward was the general shop-catalogue suggestion.
- **User task:** Find a specific plant, including when the query contains a spelling mistake.
- **Possible consequence (inference):** Users may not realize there were no matching products or may abandon the search.
- **Decision:** Display the actual query in a descriptive no-results message and provide *Clear filters and show all*. Keep the filter controls visible and reusable.
- **Alternative:** Automatically correct the query and immediately substitute another search term.
- **Reason:** Explicit feedback is predictable and does not silently reinterpret the user's intent.
- **Tradeoff:** No automated spelling-correction engine; visitors may still need to enter a shorter or corrected term.
- **Code location:** `src/pages/Shop.jsx`, `matches`, `clear`, and the conditional `matches.length === 0` state.
- **Evidence (report):** PodayOnline screenshots — successful `rose` and unsuccessful `roseyy`; Little Leaf screenshot — `rose iraj` empty results with recovery button.
- **Verify:** Search `rose iraj`, observe message and original query, click *Clear filters and show all*, confirm products return.

## Decision 2 — Show suitability filters before choosing a plant

- **Problem (observed):** The inspected PodayOnline indoor-plant catalogue showed category selection but no visible controls for narrowing by plant size, price or sunlight requirement.
- **User task:** Find a small, affordable indoor plant suitable for the available sunlight and the customer's care experience.
- **Possible consequence (inference):** Customers must review many individual items before choosing a suitable plant.
- **Decision:** Group clearly labeled search and filter controls in a dedicated filter panel: category, sunlight, care difficulty, size, and maximum price. Offer sorting by price or name and update the visible result count.
- **Alternative:** A step-by-step recommendation wizard as the main discovery interface, without visible catalogue filters.
- **Reason:** Customers can see and combine several constraints without losing the catalogue. At narrow widths, the controls stack above the product grid.
- **Tradeoff:** More controls take up space, especially on mobile. Filters depend on accurate local plant metadata.
- **Code location:** `src/pages/Shop.jsx`, filter state variables, `useMemo` filtering/sorting and filter panel; `src/App.css` for responsive layout.
- **Evidence (report):** PodayOnline Indoor Plants category screenshot; Little Leaf Shop screenshot showing filters and narrowed results, plus 390 px screenshot.
- **Verify:** Combine Low sunlight, Easy care, and a maximum price; change sorting; clear filters; test at 390 px.

## Decision 3 — Preserve a unified multi-item basket instead of separate messages

- **Problem (observed):** Clicking Aloe Vera and Peace Lily on PodayOnline opened individual WhatsApp handoffs; the observed message represented Aloe Vera only rather than one combined order for both plants. This does **not** mean the Peace Lily button failed.
- **User task:** Select multiple plants, revise quantities or options, review the combined price, and complete an order.
- **Possible consequence (inference):** Customers may need to manually consolidate their selections and request prices, causing additional effort or misunderstandings.
- **Decision:** Maintain one shared basket in React, persist it in localStorage, show add/remove feedback, support quantity and pot changes, calculate subtotal/delivery/total, and finish through a validated simulated checkout. Recheck stock before completion and deduct purchased quantities from local demo inventory.
- **Alternative:** Send a generated, combined WhatsApp message with all items and estimated total.
- **Reason:** A connected in-site journey gives immediate visible state and total-price feedback and meets the assignment's selection-to-confirmation requirements.
- **Tradeoff:** More client-side state, validation and stock-recovery logic; browser-local inventory is not a real multi-user ordering system.
- **Code location:** `src/App.jsx` (`cart`, `updateItem`, `addItem`, `setPot`, `onComplete`, localStorage), `src/pages/Cart.jsx`, `src/pages/Checkout.jsx`, `src/utils/businessRules.js`, `src/utils/inventory.js`.
- **Evidence (report):** PodayOnline WhatsApp handoff screenshot; Little Leaf multi-plant basket, editable quantity, total and confirmation screenshots; sold-out Calathea after simulated purchase.
- **Verify:** Add Aloe Vera and Peace Lily, edit quantity, remove one, refresh to restore basket, review summary, complete checkout, inspect updated stock.

## Verification notes


- Automated test run recorded on 14 November 2026: 10 passed, 0 failed (`node --test tests/businessRules.test.mjs tests/inventory.test.mjs`).
