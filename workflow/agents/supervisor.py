# SUPERVISOR: an AI that reads the progress and decides which agent works next

from typing import Literal

from pydantic import BaseModel, Field

from config import MAX_SUPERVISOR_STEPS
from workflow.llm import llm
from workflow.state import TestState


# The supervisor must answer in exactly this shape
class Decision(BaseModel):
    next_agent: Literal["explorer", "generator", "reviewer", "healer", "finish"]
    reason: str = Field(description="One short sentence explaining the choice")


SUPERVISOR_PROMPT = """
You are the supervisor of a QA automation team. Your team turns a manual test case
into a working Playwright test. Decide which team member works next.

Team:
- explorer: performs the test steps in a real browser and reports the real page elements. Needed before any code is written.
- generator: writes the Playwright test from the explorer's report. Also rewrites it when the reviewer requests changes.
- reviewer: reviews the test code for quality. Approves it or requests changes.
- healer: runs the test. If it fails, it fixes the test using the browser.
- finish: the work is done (test passed AND code approved), or the team is stuck.

Current progress:
- Exploration done: {explored}
- Test code written: {has_code}
- Review status: {review_status}
- Reviewer feedback: {review_feedback}
- Test status: {test_status}
- Healer fixes tried: {heal_runs}

What each agent did so far (oldest first):
{history}
"""


def supervisor(state: TestState):
    steps = state["steps"] + 1

    # Safety limit: stop if the team has taken too many steps
    if steps > MAX_SUPERVISOR_STEPS:
        print(f"\nSupervisor: step limit ({MAX_SUPERVISOR_STEPS}) reached -> finish")
        return {"next_agent": "finish", "steps": steps}

    # Has the explorer already explored the page?
    if state["exploration"]:
        explored = "yes"
    else:
        explored = "no"

    # Has the generator already written the test code?
    if state["test_code"]:
        has_code = "yes"
    else:
        has_code = "no"

    # What did the reviewer say? If nothing yet, write "none".
    if state["review_feedback"]:
        review_feedback = state["review_feedback"]
    else:
        review_feedback = "none"

    # What has each agent done so far? Put every entry on its own line.
    if state["history"]:
        history = "\n".join(state["history"])
    else:
        history = "nothing yet"

    # Fill these values into the {placeholders} of SUPERVISOR_PROMPT
    prompt = SUPERVISOR_PROMPT.format(
        explored=explored,
        has_code=has_code,
        review_status=state["review_status"],
        review_feedback=review_feedback,
        test_status=state["test_status"],
        heal_runs=state["heal_runs"],
        history=history,
    )
    decision = llm.with_structured_output(Decision).invoke(prompt)

    print(f"\nSupervisor (step {steps}): {decision.next_agent} - {decision.reason}")
    return {"next_agent": decision.next_agent, "steps": steps}
