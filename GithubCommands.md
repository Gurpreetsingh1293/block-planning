# 🐙 Git & GitHub Team Master Guide (`GithubCommands.md`)

> **For our 6-person hackathon team:** This guide covers all everyday Git commands, branching strategies, conflict resolution, rebasing, and safety techniques to undo mistakes without losing code.

---

## 📑 Table of Contents
1. [Git Fundamentals & First-Time Configuration](#1-git-fundamentals--first-time-configuration)
2. [How Branches Work & Branch Management](#2-how-branches-work--branch-management)
3. [Working with Teams: The Daily Collaboration Flow](#3-working-with-teams-the-daily-collaboration-flow)
4. [Pulling from Remote: `git fetch` vs `git pull`](#4-pulling-from-remote-git-fetch-vs-git-pull)
5. [Merge Conflicts: Step-by-Step Resolution Playbook](#5-merge-conflicts-step-by-step-resolution-playbook)
6. [Rebase vs. Merge: Keeping Clean Commit Histories](#6-rebase-vs-merge-keeping-clean-commit-histories)
7. [Undoing Mistakes & Fixing Commits](#7-undoing-mistakes--fixing-commits)
8. [Stashing: Pausing Work Without Committing](#8-stashing-pausing-work-without-committing)
9. [Quick Command Reference Cheatsheet](#9-quick-command-reference-cheatsheet)

---

## 1. Git Fundamentals & First-Time Configuration

### Set Up Your Identity
Run these once on your Windows computer so your team knows who made each commit:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Enable Colorful, Readable Log Output
```powershell
git config --global color.ui auto
```

### Check Current Status & History
```powershell
# See modified, staged, and untracked files
git status

# View a clean, graphical one-line history tree
git log --oneline --graph --decorate --all -n 15
```

---

## 2. How Branches Work & Branch Management

### What is a Branch?
In Git, a branch is simply a **lightweight, movable pointer** to a specific commit. When you commit, your branch pointer moves forward automatically.

```text
       C --- D (feature/ui-gantt)
      /
A --- B (main)
```

Working on separate branches allows all 6 team members to write code simultaneously without overwriting each other's files.

### Branch Commands

```powershell
# List all local branches (* indicates currently active branch)
git branch

# List all branches including remote branches
git branch -a

# Create and immediately switch to a new branch
git checkout -b feature/mark-train-gantt
# OR modern Git syntax:
git switch -c feature/mark-train-gantt

# Switch between existing branches
git checkout main
# OR
git switch main

# Rename your current local branch
git branch -m feature/new-branch-name

# Delete a local branch that has already been merged into main
git branch -d feature/old-feature

# Force delete an unmerged branch (CAUTION: discards unmerged commits!)
git branch -D feature/abandoned-experiment
```

---

## 3. Working with Teams: The Daily Collaboration Flow

### Step 1: Start your day by updating `main`
Always pull the latest changes that your teammates pushed while you were away:
```powershell
git checkout main
git pull origin main
```

### Step 2: Create a branch for your task
```powershell
git checkout -b feature/yourname-task-description
```

### Step 3: Write code, check status, and stage files
```powershell
# Check what you changed
git status

# Review line-by-line differences
git diff

# Stage specific files (recommended)
git add backend/src/controllers/blockPlan.controller.js

# Or stage all changed and new files
git add .
```

### Step 4: Commit with a meaningful message
Follow conventional commit prefixes (`feat:`, `fix:`, `docs:`, `refactor:`):
```powershell
git commit -m "feat(backend): add train conflict detection heuristic"
```

### Step 5: Push your branch to GitHub
The first time you push your branch, link it to the remote with `-u`:
```powershell
git push -u origin feature/yourname-task-description
```
On subsequent pushes from that branch, you only need:
```powershell
git push
```

### Step 6: Create a Pull Request (PR) on GitHub
Go to GitHub, open a PR from `feature/yourname-task-description` into `main`, ask a teammate to review, and merge once tests pass.

---

## 4. Pulling from Remote: `git fetch` vs `git pull`

Understanding the difference prevents accidental messy merge commits:

### `git fetch` (Safe & Informational)
Downloads all commits, files, and new branches from the remote repository, but **does not touch your working code or alter your local branches**:
```powershell
git fetch origin
```
Use this when you want to see what teammates have pushed without changing your current files.

### `git pull` (Fetch + Merge)
Runs `git fetch` behind the scenes and immediately attempts to **merge** the remote branch into your current local branch:
```powershell
git pull origin main
```

> **Pro Tip for Teams:** To prevent unnecessary merge commits when pulling into your local branch, use rebase pull:
> ```powershell
> git pull --rebase origin main
> ```

---

## 5. Merge Conflicts: Step-by-Step Resolution Playbook

A **merge conflict** occurs when two developers edit the same lines of the same file on different branches, or one developer deletes a file that another developer edited.

### How to Resolve a Conflict

#### Step 1: Detect the Conflict
When merging or rebasing, Git will stop and print:
```text
CONFLICT (content): Merge conflict in backend/src/models/Section.js
Automatic merge failed; fix conflicts and then commit the result.
```

#### Step 2: Identify Conflicted Files
Run:
```powershell
git status
```
Look under **"Unmerged paths:"** to see all files marked `both modified:`.

#### Step 3: Open the File and Inspect Conflict Markers
Inside the conflicted file, Git inserts markers:
```javascript
<<<<<<< HEAD
// Your local changes on your current branch
const maxSpeedKmph = 130;
=======
// Changes coming from the incoming branch (e.g. main)
const maxSpeedKmph = 160;
>>>>>>> main
```

#### Step 4: Resolve the Conflict
Manually edit the file:
1. Decide which code to keep (or combine both if needed).
2. **Delete the conflict markers** (`<<<<<<< HEAD`, `=======`, `>>>>>>>`).
3. Save the file.

#### Step 5: Mark as Resolved and Finish Merge
```powershell
# Stage the resolved file
git add backend/src/models/Section.js

# Verify all conflicts are resolved (status should show no unmerged paths)
git status

# Complete the merge commit
git commit -m "merge: resolve conflict in Section model maxSpeed"

# Push the merged branch
git push origin feature/your-branch
```

#### Emergency Escape Hatch: Abort the Merge
If you get stuck or need to discuss with your teammate before proceeding, you can cancel the merge anytime to return your code to its pre-merge state:
```powershell
git merge --abort
```

---

## 6. Rebase vs. Merge: Keeping Clean Commit Histories

### Merge (`git merge main`)
- Creates a new **merge commit** joining the two histories.
- Preserves the exact chronological timeline of commits.
- Can create a "train track" diagram with many crisscrossing lines.

### Rebase (`git rebase main`)
- Takes your feature branch commits, temporarily sets them aside, moves your branch to the tip of `main`, and **re-applies your commits one by one on top**.
- Results in a perfectly **linear, clean Git history**.

```text
Before Rebase:
      C --- D (your feature branch)
     /
A --- B --- E (main with teammate's commit E)

After "git rebase main" on your branch:
A --- B --- E --- C' --- D' (your commits reapplied on top of E)
```

### How to Rebase Your Feature Branch on Latest Main:
```powershell
# 1. Update your local main
git checkout main
git pull origin main

# 2. Switch back to your feature branch
git checkout feature/my-feature

# 3. Rebase onto main
git rebase main

# If a conflict occurs during rebase:
# 1. Fix the conflict markers in your editor
# 2. git add <conflicted-file>
# 3. git rebase --continue
# (To cancel: git rebase --abort)

# 4. Push to remote (if already pushed previously, requires force with lease)
git push --force-with-lease origin feature/my-feature
```

> [!CAUTION]
> **The Golden Rule of Rebase:** Never rebase a public branch that other teammates are working on (like `main`). Only rebase your personal feature branches!

---

## 7. Undoing Mistakes & Fixing Commits

### Scenario A: You staged a file by mistake and want to unstage it
```powershell
# Unstages file but keeps your edits intact
git restore --staged <filename>
# Legacy equivalent: git reset HEAD <filename>
```

### Scenario B: You made unwanted edits in a file and want to discard them
```powershell
# Discard changes and revert file to last committed state
git restore <filename>
# Legacy equivalent: git checkout -- <filename>

# Discard ALL uncommitted changes in the entire workspace (CAUTION!)
git restore .
```

### Scenario C: You made a typo in the last commit message
```powershell
git commit --amend -m "fix(frontend): correct API base URL port to 5000"
```

### Scenario D: You forgot to include a file in the last commit
```powershell
git add forgotten-file.js
git commit --amend --no-edit
```

### Scenario E: Undo the last commit, but KEEP all your changed code
Use **Soft Reset** (your changes remain staged in the editor):
```powershell
git reset --soft HEAD~1
```

### Scenario F: Completely destroy the last commit and wipe out changes
Use **Hard Reset** (permanently deletes code!):
```powershell
git reset --hard HEAD~1
```

### Scenario G: You already pushed a bad commit to `main` and need to safely undo it
Never hard reset a shared branch! Instead, create an inverse commit with `revert`:
```powershell
# Creates a new commit that exactly reverses commit abc1234
git revert abc1234
git push origin main
```

---

## 8. Stashing: Pausing Work Without Committing

Use `git stash` when you need to switch branches to fix a bug or pull code, but your current task is half-finished and not ready to commit.

```powershell
# 1. Stash your uncommitted changes with a helpful label
git stash push -m "WIP: block window conflict calculations"

# 2. Your working tree is now clean! Switch branches or pull main
git checkout main
git pull origin main

# 3. Switch back to your feature branch
git checkout feature/my-feature

# 4. List all saved stashes
git stash list

# 5. Restore your saved work and remove it from the stash list
git stash pop

# (Optional: apply stash without deleting it from list)
# git stash apply

# (Optional: delete a specific stash)
# git stash drop stash@{0}
```

---

## 9. Quick Command Reference Cheatsheet

| Task | Command |
| :--- | :--- |
| **Check workspace status** | `git status` |
| **View branch visual graph** | `git log --oneline --graph --all` |
| **Create and switch branch** | `git checkout -b <branch>` or `git switch -c <branch>` |
| **Update local main** | `git checkout main && git pull origin main` |
| **Stage all changes** | `git add .` |
| **Commit staged changes** | `git commit -m "<message>"` |
| **Push new branch to remote** | `git push -u origin <branch>` |
| **Stash uncommitted changes** | `git stash push -m "<label>"` |
| **Restore stashed changes** | `git stash pop` |
| **Undo last commit (keep code)** | `git reset --soft HEAD~1` |
| **Abort an active merge** | `git merge --abort` |
| **Safely undo a pushed commit** | `git revert <commit-hash>` |
