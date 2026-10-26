# Human-in-the-loop: show the final test and ask before opening a pull request.
# Then: new branch (in a temporary worktree) -> commit -> push -> AI-written PR description -> gh pr create

import os
import subprocess
import tempfile
from langgraph.types import interrupt
from config import BASE_BRANCH
from workflow.llm import llm
from workflow.state import TestState
from workflow.test_runner import save_test

PR_DESCRIPTION_PROMPT = """
Write a GitHub pull request description in Markdown for this AI-generated Playwright test.
Use these sections:
## Summary  (2-3 sentences: what the test checks)
## Test steps covered  (a short numbered list)
## How it was generated  (which agents worked on it, based on the log)
## How to run  (npx playwright test {output_file})
Keep it short and clear. Return only the Markdown.

Manual test case:
{test_case}

Test code:
{test_code}

Test status: {test_status}

Agent log:
{history}
"""


def ask_create_pr(state: TestState):
    # Note: when the graph resumes, this node runs again from the top.
    # So we don't print() here; everything to show goes inside the interrupt message.
    message = f"""
==================== FINAL TEST: {state['output_file']} ====================
{state['test_code']}
==========================================================================
Test: {state['test_status'].upper()}   Review: {state['review_status'].upper()}   Supervisor steps: {state['steps']}
"""
    if state["test_status"] != "passed":
        message += "WARNING: the test is not passing.\n"
    message += f"Create a pull request on branch '{state['branch']}'? (yes/no): "

    # interrupt() pauses the graph here and waits for your answer
    answer = interrupt(message)
    return {"create_pr": answer.strip().lower() in ("yes", "y")}


def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True)


def create_pull_request(state: TestState):
    branch = state["branch"]
    files = [state["input_file"], state["output_file"]]
    print(f"Creating branch {branch}...")

    # The spec is only on disk if the healer ran, so always write the final test
    save_test(state["output_file"], state["test_code"])

    # Build the PR branch in a separate temporary folder (a git worktree).
    # Our own folder never switches branches, so test_cases/ and tests/ are never touched.
    worktree = tempfile.mkdtemp(prefix="pr-")
    pr_url = ""
    try:
        add = git("worktree", "add", "-b", branch, worktree, BASE_BRANCH)
        if add.returncode != 0:
            print("Creating the branch failed:\n" + add.stderr)
            return {"pr_url": ""}

        # Copy the test case and spec into the worktree, then commit them there
        for path in files:
            with open(path) as f:
                save_test(os.path.join(worktree, path), f.read())

        git("-C", worktree, "add", *files)
        commit = git("-C", worktree, "commit", "-m", f"Add Playwright test for {state['input_file']}", "--", *files)
        if commit.returncode != 0:
            print("Commit failed:\n" + commit.stdout + commit.stderr)
            return {"pr_url": ""}

        push = git("-C", worktree, "push", "-u", "origin", branch)
        if push.returncode != 0:
            print("Push failed:\n" + push.stderr)
            return {"pr_url": ""}

        print("Writing the pull request description with AI...")
        description = llm.invoke(PR_DESCRIPTION_PROMPT.format(
            output_file=state["output_file"],
            test_case=state["test_case"],
            test_code=state["test_code"],
            test_status=state["test_status"],
            history="\n".join(state["history"]),
        )).content

        pr = subprocess.run(
            ["gh", "pr", "create", "--base", BASE_BRANCH, "--head", branch,
             "--title", f"Add Playwright test for {state['input_file']}", "--body", description],
            capture_output=True, text=True,
        )
        if pr.returncode == 0:
            pr_url = pr.stdout.strip()
            print(f"Pull request created: {pr_url}")
        else:
            print("Creating the pull request failed:\n" + pr.stderr)
    finally:
        # Remove the temporary folder; the branch stays (it is pushed and has the PR)
        git("worktree", "remove", "--force", worktree)

    return {"pr_url": pr_url}
