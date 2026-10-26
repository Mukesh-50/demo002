# TEST CASE WRITER: turns a Jira story into manual test cases (test_cases/<STORY>-TC001.txt, ...),
# in the same format the rest of the team already understands.

import glob
import os
from pydantic import BaseModel, Field
from config import APP_URL, TEST_CASES_DIR
from workflow.llm import llm


# The writer must answer in exactly this shape: a list with one item per test case
class TestCase(BaseModel):
    text: str = Field(description='ONE complete test case, from "### Test Case:" to "Test Status: Not Run."')


class TestCases(BaseModel):
    test_cases: list[TestCase]


TEST_CASE_WRITER_PROMPT = """
You are a senior QA analyst. Write manual test cases for the Jira story below.

Rules:
- Write one test case for each acceptance criterion, in the same order. Each test case is a separate item in the list.
- Number the test cases {story_key}-TC001, {story_key}-TC002, ... in that order.
- Use the exact test data and exact messages from the story. Never invent data or messages.
- If the story does not name a page, link or element, describe it in plain words. Do not guess names.
- Every step must be concrete and always performed. No optional or "if" steps.
- Every test starts by navigating to {app_url}.
- Each expected result must be something a browser test can check (visible text, URL, a field's state).
- Follow the format below exactly. Leave out the Email or Password rows when a test does not use them,
  and write (empty) when a field is deliberately left empty.

Format:
### Test Case: <title starting with "Verify">

Feature: <feature> Test Type: <Positive / Negative> URL: {app_url}

| Field           | Details                                   |
| --------------- | ----------------------------------------- |
| Test Case ID    | {story_key}-TC001                         |
| Jira Reference  | {story_key} / AC1                         |
| Test Scenario   | <one sentence>                            |
| Preconditions   | <what must be true before starting>       |
| Email           | <email used>                              |
| Password        | <password used>                           |
| Expected Result | <overall result>                          |

### Test Steps

| Step | Action                    | Test Data       | Expected Result                 |
| ---- | ------------------------- | --------------- | ------------------------------- |
| 1    | Navigate to login page    | Login URL       | Login page should be displayed  |
| 2    | ...                       | ...             | ...                             |

Pass Criteria: The test passes if <the checks that decide pass or fail>.

Test Status: Not Run.

Jira story:
{story}

"""


def story_files(story_key: str):
    return sorted(glob.glob(f"{TEST_CASES_DIR}/{story_key}-TC*.txt"))


def write_test_cases(story_key: str, story: str):
    # Reuse the test cases if this story was already written up (delete them to write them again)
    existing = story_files(story_key)
    if existing:
        print(f"Test case writer: {len(existing)} test cases for {story_key} already exist, reusing them")
        return existing

    print(f"Test case writer: writing test cases for {story_key}...")
    prompt = TEST_CASE_WRITER_PROMPT.format(story_key=story_key, app_url=APP_URL, story=story)
    result = llm.with_structured_output(TestCases).invoke(prompt)

    os.makedirs(TEST_CASES_DIR, exist_ok=True)
    files = []
    for number, test_case in enumerate(result.test_cases, start=1):
        path = f"{TEST_CASES_DIR}/{story_key}-TC{number:03d}.txt"
        with open(path, "w") as file:
            file.write(test_case.text.strip() + "\n")
        files.append(path)

    print(f"Test case writer: wrote {len(files)} test cases to {TEST_CASES_DIR}/")
    return files
