# Credit Card Validator

A small interactive UI that mimics a physical credit card. It detects the card network as you type and validates the card number in real time using the **Luhn algorithm** — the card visually flips between "valid" and "invalid" states, and its logo updates automatically.

## Screenshot
<img width="755" height="515" alt="image" src="https://github.com/user-attachments/assets/c5056745-0f37-46c0-bad9-276a54503a8d" />
<img width="790" height="705" alt="image" src="https://github.com/user-attachments/assets/a31e43cc-79f3-42f7-8eee-9b56859227cf" />
<img width="759" height="707" alt="image" src="https://github.com/user-attachments/assets/af1ae53b-bb45-479f-9514-d790b8e6a78e" />



## Features

- Realistic card UI (logo, chip, card number, name, expiry) styled with CSS
- Auto-formats input into groups of 4 digits as you type (`xxxx xxxx xxxx xxxx`)
- Strips out any non-digit characters automatically, so pasting works cleanly
- **Detects the card network** (Visa, MasterCard, American Express, Discover, ARCA) from the number's prefix, and swaps in the matching logo live
- Shows an animated **skeleton placeholder** in place of the logo until enough digits are entered to recognize a network
- Validates the number using the Luhn checksum once it's between 13 and 19 digits long (covering shorter/longer formats like American Express)
- Visual feedback: the card gets a `valid` or `unvalid` CSS class depending on the result
- A toast-style notification (`✅ Card is valid` / `❌ Card isn't valid`) appears on every check

## How card type detection works

`detectCardType(number)` looks at the digits typed so far and matches them against each network's known prefix pattern, checked in this order:

1. **ARCA** — checked first via `isArca()`, against a hardcoded list of known ARCA [BINs](https://en.wikipedia.org/wiki/Payment_card_number#Issuer_identification_number) (bank identification numbers, i.e. the first 6 digits): `417729`, `437420`, `441254`.
2. **Visa** — numbers starting with `4`.
3. **MasterCard** — numbers starting with `51`–`55` or `22`–`27`.
4. **American Express** — numbers starting with `34` or `37`.
5. **Discover** — numbers starting with `6011` or `65`.
6. If nothing matches yet, the **skeleton placeholder** is shown instead of a logo, since there isn't enough information to tell yet (or the input is empty).

Once a network is identified, `setIcon(type)` swaps the skeleton out for the matching logo image (`img/{type}.png`) and network name.

## How the validation works — the Luhn algorithm

Card validation lives in the `isValid()` function in `script.js`, and it implements the **Luhn algorithm** (also called the "modulus 10" algorithm), the standard checksum formula used to catch typos in credit card, IMEI, and other identification numbers.

The idea: starting from the **rightmost digit** and moving left, every second digit is doubled. If doubling pushes a digit above 9, you subtract 9 from it (equivalent to summing its two digits, e.g. `8 × 2 = 16 → 1 + 6 = 7`, which is the same as `16 - 9 = 7`). All digits — doubled or not — are then summed up. If the total is a multiple of 10, the number is valid.

Step by step, as implemented here:

1. **Strip formatting.** The spaces added for display (`xxxx xxxx xxxx xxxx`) are removed, leaving a plain string of digits.

2. **Walk the digits from right to left.** A `shouldDouble` flag starts as `false` and flips every iteration, so it becomes `true` on every second digit — exactly the digits the Luhn algorithm requires you to double, starting from the second-to-last digit.

3. **Double every other digit.** When `shouldDouble` is `true`, the current digit is multiplied by 2. If that result is greater than 9, `9` is subtracted from it — a shortcut equivalent to adding its individual digits together.

4. **Accumulate the sum.** Every digit (doubled or original) is added to a running `sum`.

5. **Check divisibility by 10.** Once all digits have been processed, if `sum % 10 === 0`, the number passes the Luhn check and is treated as valid; otherwise it's invalid.

The check now runs as soon as the number is **13 to 19 digits long**, rather than requiring exactly 16 — this matters because not every network uses the same length (e.g. American Express numbers are 15 digits).

### Worked example

For a well-known Luhn-valid test number, `4539 1488 0343 6467`:
- Digits from the right, every second one doubled (with the "subtract 9 if over 9" rule applied), then all digits summed, produces a total that is an exact multiple of 10 — so the card is reported as **valid**.

Changing any single digit (e.g. a typo) will, in the vast majority of cases, break that divisibility and cause the check to fail — which is exactly what the Luhn algorithm is designed to catch: accidental single-digit errors and adjacent-digit transpositions.

> **Note:** the Luhn check only verifies that a number is *structurally* well-formed (i.e. it could plausibly be a real card number) — it does **not** verify that the card actually exists, belongs to a real account, or is not expired/stolen. It's a checksum, not a fraud or authorization check.

## Project Structure

```
Credit-Card-Validator/
├── index.html      # Card markup + input field + skeleton/logo placeholders
├── script.js       # Input formatting, card type detection, Luhn validation
├── style.css       # Card styling, skeleton animation, valid/invalid states
└── img/
    ├── chip.png
    └── masterCard.png
```

## Getting Started

No build step or dependencies — it's plain HTML/CSS/JS.

1. Clone the repo:
   ```bash
   git clone https://github.com/KhachaturKhojoyan/Credit-Card-Validator.git
   cd Credit-Card-Validator
   ```
2. Open `index.html` directly in your browser, or serve it locally:
   ```bash
   npx serve .
   ```
3. Type a card number into the card number field — watch the logo appear once the network is recognized, and the valid/invalid state update once the length is right.

## Adding a screenshot

1. Open `index.html` in your browser and type in a card number (try both a valid and an invalid one).
2. Take a screenshot (Windows: `Win+Shift+S`, Mac: `Cmd+Shift+4`, Linux: your screenshot tool).
3. Save it as `screenshot.png` in the project root (same folder as `README.md`).
4. Commit and push:
   ```bash
   git add screenshot.png
   git commit -m "Add screenshot"
   git push
   ```

## Status

🚧 Personal/learning project exploring DOM manipulation, input formatting, and checksum algorithms. Feedback welcome!

## License

This project currently has no license specified.
