# Little Leaf 🌿

**Web Programming (CS4032) — Assignment 02 | Fall 2026**  
**Student:** Iraj Aslam | **Roll no.:** 24I-2100 | **Section:** CY-5A   
**Repository:** https://github.com/i242100-jpg/little-leaf  
**Deployed website:** _Add after Vercel deployment_

## About

Little Leaf is a fictional indoor-plant boutique for students, beginners, and people decorating smaller homes in **Islamabad and Rawalpindi**. It offers 20 plant listings, discovery tools, a plant-matching quiz, a persistent basket, and a **simulated** checkout. The customer can search for an appropriate plant, inspect its details, choose a pot and quantity, review the calculated price, submit a validated sample order, and see a confirmation.

This is a **frontend-only educational application**. No actual orders, deliveries or payments take place. Use fictional contact data in the checkout form.

## Stack

React, JavaScript, Vite, React Router, HTML, authored CSS, Node.js's built-in test runner and browser localStorage. No backend or third-party UI kit.

## Setup

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
npm run lint
node --test tests/businessRules.test.mjs tests/inventory.test.mjs
```

The production build is created in `dist/`. The last recorded local test run passed **10/10** Node tests and `npm run build` succeeded (14 November 2026); rerun tests after subsequent edits.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Homepage and featured plants |
| `/shop` | Browse 20 plants; search, combined filters, sorting and demo controls |
| `/plants/:id` | Plant details, suitability, pricing, stock and add-to-basket action |
| `/match` | Plant Match questionnaire and suggestions |
| `/cart` | Review chosen plants, change quantity and pot, remove items |
| `/checkout` | Validated delivery/customer form and calculated order summary |
| `/confirmation` | Final simulated-order result |
| Other paths | Branded not-found message with recovery link |

## Features and core React concepts

- **Product data:** `src/data/plants.js` holds stable plant IDs, descriptions, prices and suitability information.
- **Search, filtering and sorting:** `src/pages/Shop.jsx` uses state, `useMemo`, array filtering and sorting to narrow the catalogue.
- **Details and navigation:** `src/App.jsx` sets up React Router and `src/pages/PlantDetails.jsx` resolves the dynamic ID.
- **Reusable components and props:** `src/components/PlantCard.jsx` and `src/components/Navbar.jsx` display reusable UI; callback props convey add-to-basket actions.
- **Shared, immutable state:** `src/App.jsx` owns basket and inventory state and passes it to related pages. It updates arrays and objects without direct mutation.
- **Persistence and effects:** `src/App.jsx` restores and saves the basket and simulated inventory with `localStorage` and `useEffect`.
- **Async loading:** `src/utils/mockLoader.js` simulates asynchronous catalogue retrieval with a failure path and a retry action.
- **Business logic and derived totals:** `src/utils/businessRules.js` exports quantity checks, pet suitability, supported delivery fees, and calculated order values.
- **Inventory updates:** `src/utils/inventory.js` deducts simulated purchases; localStorage retains the result across refreshes.
- **Controlled form:** `src/pages/Checkout.jsx` validates name, Pakistan mobile number, delivery address, supported city, stock, and pet suitability.
- **Feedback:** basket-action notifications, empty/search states, loading errors, unavailable stock, checkout errors and order confirmation.
- **Mobile/accessibility:** responsive authored CSS, labels, button/link semantics and status feedback. Verify the whole journey at 390 px and with keyboard access before submission.

## Operating rules

1. **Capacity:** quantities must be whole numbers from **1 to 6 per plant per order**, and must not exceed that plant's currently available stock. The basket and checkout prevent invalid quantities. Example boundary: 6 is valid if at least 6 are in stock; 7 is blocked.
2. **Compatibility:** when the customer selects **“I have pets”** at checkout, items not marked pet-safe must be removed or the choice must be changed before completion.
3. **Fulfilment/pricing:** delivery is supported only within **Islamabad (Rs. 200)** and **Rawalpindi (Rs. 250)**. A ceramic pot adds **Rs. 350 per item**, included in the live summary. Unsupported destinations do not qualify for checkout.

## Reproducing edge cases

1. **Search without matches:** open `/shop`, search `rose iraj`; expect a no-results explanation and *Clear filters and show all*.
2. **Empty dataset:** `/shop` → expand *Demo: loading and availability states* → enable *Simulate empty catalogue*. A distinct empty-catalogue message should appear. Disable to restore data.
3. **Loading error:** use *Simulate loading failure* in the same panel. An error and *Try again* appear. Disable the simulation, then retry to recover.
4. **Invalid URL/ID:** open `/plants/not-a-real-plant` or an unknown route; expect useful not-found feedback.
5. **Quantity limit:** add a plant, attempt more than six units or more than stock; the update is blocked with feedback.
6. **Saved basket:** add items and refresh; basket contents should be restored.
7. **Changed availability:** add an item, enable *Simulate changed availability (first basket item)* in `/shop`, then return to `/cart` and `/checkout`; correct any conflicts before completing the order.
8. **Inventory purchase/reset:** buy all available Calathea Orbifolia units using fictional details, revisit `/shop` and refresh; the item should show *Sold out*. Use *Reset demo inventory* to restore stock.
9. **Form validation:** attempt checkout with a one-character name, invalid phone and short address; expect field-specific messages and no completion.
10. **Responsive/keyboard:** check full flow at **390 px** and **1280 px** widths. Tab through core controls and inspect focus indicators and overflow.

## Known limitations

- A **simulation**, not an e-commerce backend: stock and basket are browser-local, not synchronized among different customers or devices.
- Orders are not sent to a merchant; no payment is processed.
- Refreshing the confirmation page may not reproduce the preceding order's confirmation details because order confirmation is held in React state.
- Product data and delivery fees are fictional and fixed.
- Photo sources, creators, and licenses must be individually checked and documented for the **actual downloaded files** in `docs/IMAGE-CREDITS.md` before final submission.

## Documentation

- `DECISIONS.md` — evidence-based frontend decisions related to PodayOnline.
- `docs/IMAGE-CREDITS.md` — image attribution record .
- Final PDF report — reference-site screenshots, implemented screens, and tests.

## Deployment

Deploy the repository with **Vercel**, using the Vite build command `npm run build` and output directory `dist`. Verify refresh and direct navigation on `/shop`, `/plants/:id`, `/cart`, and `/match`. Add the public deployment URL above and record the final Git commit hash in the assignment report.
