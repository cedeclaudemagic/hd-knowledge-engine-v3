# DEFINITIVE VISUAL WHEEL SPECIFICATION

**STATUS:** MASTER REFERENCE - MUST BE VERIFIED BEFORE IMPLEMENTATION
**DATE:** November 18, 2025
**PURPOSE:** Create absolute clarity on wheel direction using ONLY visual clock face terms

---

## CLOCK FACE REFERENCE (Looking at wheel from above)

```
           12 (NORTH)
              |
              |
    9 (WEST)--+--3 (EAST)
              |
              |
           6 (SOUTH)
```

**This is our ONLY reference. No mathematical angles. Just the visual clock face.**

---

## VERIFICATION CHECKLIST - ANSWER THESE FROM THE VISUAL WHEEL

### 1. CARDINAL POSITIONS (Look at the image)

Where are these gate pairs located on the clock face?

- [ ] **10|11** is at: _____ o'clock (should be 12 = NORTH)
- [ ] **25|36** is at: _____ o'clock (East = 3? or West = 9?)
- [ ] **15|12** is at: _____ o'clock (should be 6 = SOUTH)
- [ ] **46|6** is at: _____ o'clock (West = 9? or East = 3?)

**PLEASE VERIFY FROM IMAGE AND FILL IN THE BLANKS**

---

### 2. ARRAY SEQUENCE DIRECTION (Look at gates 41, 19, 13, 49, 30)

Starting from gate 41, following the sequence [41, 19, 13, 49, 30...]:

Looking at the visual wheel, these gates progress:

- [ ] From 12 towards 3 (clockwise)
- [ ] From 12 towards 9 (counter-clockwise)

**YOU SAID:** Gates 41, 19, 13 are between 9-11 o'clock (towards WEST)

**This means:** Starting near 12, moving towards 9 = **COUNTER-CLOCKWISE**

---

### 3. COMPLETE CIRCUIT (Following array 0→1→2→...→63)

If we start at North (12) and follow the array sequence around the full circle,
we encounter cardinals in what order?

Based on array positions:
- Position 9-10: EAST or WEST? (gates 36|25)
- Position 25-26: SOUTH (gates 12|15) ✓
- Position 41-42: WEST or EAST? (gates 6|46)
- Position 57-58: NORTH (gates 11|10) ✓

**COUNTER-CLOCKWISE path:** North (12) → West (9) → South (6) → East (3) → North
**CLOCKWISE path:** North (12) → East (3) → South (6) → West (9) → North

Which one matches the visual wheel?

---

## PROPOSED CONFIGURATION (Needs verification)

```json
{
  "cardinalProgression": "NWSE",
  "description": "Counter-clockwise on clock face: 12 → 9 → 6 → 3 → 12",

  "northPosition": "10|11",
  "clockPosition": "12",

  "westPosition": "25|36",
  "clockPosition": "9",

  "southPosition": "15|12",
  "clockPosition": "6",

  "eastPosition": "46|6",
  "clockPosition": "3"
}
```

**IS THIS CORRECT? Let's verify each one from the image.**

---

## VERIFICATION METHOD

### Step 1: Locate on Visual Wheel

Look at your image. For each cardinal position, find the gates and note their clock position:

**NORTH (12 o'clock):**
- Gates: 10|11
- Visual location: _____ o'clock
- Correct? YES / NO

**CLAIMED WEST (9 o'clock):**
- Gates: 25|36
- Visual location: _____ o'clock
- Correct? YES / NO

**SOUTH (6 o'clock):**
- Gates: 15|12
- Visual location: _____ o'clock
- Correct? YES / NO

**CLAIMED EAST (3 o'clock):**
- Gates: 46|6
- Visual location: _____ o'clock
- Correct? YES / NO

---

### Step 2: Trace Array Direction

Find gates 41, 19, 13, 49, 30 on the wheel.

**Gate 41** is at approximately: _____ o'clock
**Gate 19** is at approximately: _____ o'clock
**Gate 13** is at approximately: _____ o'clock

**Direction from 41 → 19 → 13:**
- [ ] Moving clockwise (towards 3)
- [ ] Moving counter-clockwise (towards 9)

---

### Step 3: Verify Full Circuit

Following the outer ring of gates on the visual wheel, starting from North (12):

**Counter-clockwise (12 → 11 → 10 → 9 ...):**
- First gates you see: 10|11, then 58, then...
- Do you hit West (9) before East (3)? YES / NO

**Clockwise (12 → 1 → 2 → 3 ...):**
- First gates you see: 10|11, then ???, then...
- Do you hit East (3) before West (9)? YES / NO

---

## WHAT I NEED FROM YOU

Please answer these specific questions by looking at the visual wheel:

### Question 1:
**Where is gate pair 25|36 on the clock face?**
- A) At 3 o'clock (East)
- B) At 9 o'clock (West)

### Question 2:
**Where is gate pair 46|6 on the clock face?**
- A) At 3 o'clock (East)
- B) At 9 o'clock (West)

### Question 3:
**Starting from North (12 o'clock) and reading the outer gate ring counter-clockwise towards 9 o'clock, what are the first 5 gates you encounter?**

(This will tell us if the array follows counter-clockwise visual direction)

### Question 4:
**Starting from North (12 o'clock) and reading the outer gate ring clockwise towards 3 o'clock, what are the first 5 gates you encounter?**

(This will tell us if the array follows clockwise visual direction)

---

## ONCE WE VERIFY THESE, WE'LL KNOW:

1. ✅ Exact clock positions of all 4 cardinals
2. ✅ Whether array follows clockwise or counter-clockwise visual direction
3. ✅ The correct "cardinalProgression" value (NWSE or NESW)
4. ✅ How to map mathematical angles to visual positions

---

## MY HYPOTHESIS (to be verified):

Based on what you've told me:

```json
{
  "cardinalProgression": "NWSE",

  "cardinals": {
    "north": { "gates": "10|11", "clock": 12 },
    "west": { "gates": "25|36", "clock": 9 },
    "south": { "gates": "15|12", "clock": 6 },
    "east": { "gates": "46|6", "clock": 3 }
  },

  "arrayDirection": "counter-clockwise on visual wheel",
  "arrayProgression": "12 → 11 → 10 → 9 → 8 → 7 → 6...",

  "note": "Visual wheel is mirrored from mathematical angles"
}
```

**IS THIS CORRECT?**

---

## ACTION ITEMS

1. **YOU:** Verify Questions 1-4 above from the visual wheel image
2. **ME:** Once verified, create unambiguous configuration that matches visual reality
3. **BOTH:** Agree on terminology before any implementation

**No code until we're 100% clear on the visual wheel layout!**
