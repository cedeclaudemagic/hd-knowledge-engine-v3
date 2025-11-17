# Setup Instructions for Parallel Sessions

## IMPORTANT: Do This FIRST Before Starting Sessions

### Step 1: Ensure Root System is on Remote

The root docking system has been pushed to:
```
Branch: feature/calculation-first-architecture
```

This branch contains:
- `core/root-system/` - The docking foundation
- `core/templates/` - Templates and verification
- `core/scripts/` - Branch creation automation
- All data sources in `data/source/`

### Step 2: For Each New Session

When you open a NEW Claude session, start with this context block:

```markdown
# Context for Session

Repository: hd-knowledge-engine
Branch to start from: feature/calculation-first-architecture

Important Git Operations:
1. First, check out the root system branch:
   git checkout feature/calculation-first-architecture
   git pull origin feature/calculation-first-architecture

2. Then create your knowledge system branch from it:
   git checkout -b feature/knowledge-system-[name]

This ensures you have the root docking system available.

Now proceed with the specific session prompt...
```

### Step 3: Session Workflow

Each session should follow this sequence:

```bash
# 1. Start from root system branch
git checkout feature/calculation-first-architecture
git pull origin feature/calculation-first-architecture

# 2. Create knowledge system branch
# (This is automated by the session prompt)
./core/scripts/create-knowledge-branch.sh gene-keys

# 3. Work on mappings
cd knowledge-systems/gene-keys
# ... extract and create mappings ...

# 4. Verify
./verify.sh

# 5. Commit
git add .
git commit -m "Add Gene Keys knowledge system"

# 6. Push your branch
git push -u origin feature/knowledge-system-gene-keys
```

### Step 4: Parallel Execution

You can now open multiple Claude sessions in parallel:

**Session A**: Copy `01-gene-keys-session.md` → New Claude session
**Session B**: Copy `02-codon-rings-session.md` → New Claude session
**Session C**: Copy `04-traditional-gates-session.md` → New Claude session
**Session D**: Copy `03-incarnation-crosses-session.md` → New Claude session

Each will:
1. Start from `feature/calculation-first-architecture`
2. Create their own branch
3. Work independently
4. Push their own branch
5. No conflicts (different branches)

## What Each Session Needs

All sessions need access to:
- ✅ Root system: `core/root-system/` (on feature/calculation-first-architecture)
- ✅ Data sources: `data/source/` (on feature/calculation-first-architecture)
- ✅ Scripts: `core/scripts/` (on feature/calculation-first-architecture)
- ✅ Templates: `core/templates/` (on feature/calculation-first-architecture)

All of this is available on the `feature/calculation-first-architecture` branch.

## Branch Structure After Sessions

```
feature/calculation-first-architecture (ROOT - pushed to remote)
├── feature/knowledge-system-gene-keys (Session A output)
├── feature/knowledge-system-codon-rings (Session B output)
├── feature/knowledge-system-hd-traditional-gates (Session C output)
└── feature/knowledge-system-incarnation-crosses (Session D output)
```

Each knowledge system branch is independent and can be merged separately.

## Verification Before Starting

Check that root system branch exists on remote:
```bash
git fetch origin
git branch -r | grep feature/calculation-first-architecture
```

Should show: `origin/feature/calculation-first-architecture`

## Quick Start Checklist

- [ ] Root system pushed to remote ✅
- [ ] Choose a session prompt (start with 01-gene-keys)
- [ ] Open NEW Claude session
- [ ] Add context block (checkout root branch first)
- [ ] Copy/paste session prompt
- [ ] Let Claude complete the work
- [ ] Verify output branch exists on remote
- [ ] Repeat for other systems

## Common Issues

**Issue**: Session can't find `core/root-system/`
**Fix**: Make sure session started from `feature/calculation-first-architecture` branch

**Issue**: Verification script not found
**Fix**: Branch creation script should be run first: `./core/scripts/create-knowledge-branch.sh`

**Issue**: Data source files not found
**Fix**: Ensure you're on the right branch with git checkout

**Issue**: Branch already exists
**Fix**: Either delete old branch or choose different name

## Ready to Start?

1. ✅ Root system is pushed
2. ✅ Session prompts are ready
3. ✅ You understand the workflow

Pick a session prompt and open your first parallel extraction session!
