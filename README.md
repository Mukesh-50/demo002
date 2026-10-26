# Multi-Agent Test Generator with LangGraph + Playwright MCP

Give it a **Jira story** (e.g. `SCRUM-7`). It reads the story through the **Atlassian MCP server**,
writes manual test cases for its acceptance criteria, and a **team of AI agents** turns each one into a
working **Playwright** test, then opens a **pull request** for a human to review.

This is the follow-up to demo001 (a fixed AI workflow). Here, an AI **supervisor** decides who works next.

## The team

```
          JIRA STORY ──(Atlassian MCP)──► TEST CASE WRITER ──► test_cases/SCRUM-7-TC001.txt, ...
                                                                   │ one at a time
                                                                   ▼
                        ┌──────────────┐
            ┌──────────►│  SUPERVISOR  │◄──────────┐   decides who works next
            │           └──────┬───────┘           │
            │      ┌───────────┼───────────┬───────┴──────┐
            │      ▼           ▼           ▼              ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ EXPLORER │ │GENERATOR │ │ REVIEWER │ │  HEALER  │
       └──────────┘ └──────────┘ └──────────┘ └──────────┘
                                   │ supervisor says "finish"
                                   ▼
          YOU: see the final test → "Create a pull request?"
                                   ▼
          branch → commit → push → AI-written PR description → pull request
```

| Agent | Type | What it does |
|---|---|---|
| **Test case writer** | AI + Atlassian MCP | Reads the Jira story and writes one manual test case per acceptance criterion |
| **Supervisor** | AI decision | Reads the progress and picks the next agent, or finishes |
| **Explorer** | Agent + Playwright MCP | Performs the test steps in a real browser and reports the real page elements, on every page, including after login |
| **Generator** | AI | Writes the TypeScript test from the Explorer's report; rewrites it if the Reviewer asks |
| **Reviewer** | AI | Checks the code against a quality checklist and approves it or requests changes |
| **Healer** | Agent + Playwright MCP + run tool | Runs the test; if it fails, inspects the page and fixes the test |

## What you will learn

| Concept | Where to see it |
|---|---|
| **Supervisor pattern**: AI chooses the next step | `workflow/agents/supervisor.py` |
| **Agents with tools**: the AI calls tools in a loop | `workflow/agents/explorer.py`, `healer.py` |
| **MCP**: giving agents browser tools | `workflow/browser.py` |
| **Remote MCP over HTTP**: reading Jira | `workflow/jira.py` |
| **Structured output**: AI answers in a fixed shape | `Decision` in `supervisor.py`, `Review` in `reviewer.py` |
| **Custom tools**: your own function as a tool | `save_and_run_test` in `healer.py` |
| **Human-in-the-loop + PR flow** | `workflow/nodes/pull_request.py` |
| **Safety limits** | `MAX_SUPERVISOR_STEPS`, `MAX_HEAL_RUNS`, `SAFE_BROWSER_TOOLS` in `config.py` |

## Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer
- Git and the GitHub CLI (`gh auth login`)
- An OpenAI API key
- An Atlassian API token for your Jira site (https://id.atlassian.com/manage-profile/security/api-tokens)

## Setup (one time)

```bash
# 1. Python packages
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 2. Node packages: Playwright Test + Playwright MCP
npm install
npx playwright install chromium                         # browser for running tests
npx @playwright/mcp install-browser chrome-for-testing  # browser for the agents

# 3. Your keys
cp .env.example .env               # then open .env and fill in your OpenAI and Atlassian details
```

## Run

```bash
python main.py SCRUM-7             # read the story, write its test cases, then automate them
python main.py SCRUM-7 SCRUM-8     # several stories, one after another
python main.py                     # automate every test case already in test_cases/
```

The test cases are saved as `test_cases/SCRUM-7-TC001.txt`, `SCRUM-7-TC002.txt`, ...
If they already exist they are reused, so you can edit them by hand. Delete them to write them again from Jira.

For each test case you will see the supervisor's decisions and each agent at work.
At the end it shows the final test and asks: **Create a pull request?**

A test case is **skipped** if its test already exists in `tests/`, or if its branch (`test/scrum-7-tc001`, ...) is already on GitHub.

## Project structure

```
main.py                     ← start here
config.py                   ← model, safety limits, allowed browser tools, Jira settings
test_cases/                 ← manual test cases (SCRUM-7-TC001.txt, ...)
tests/                      ← generated Playwright tests (after the pull request is merged)
workflow/
├── state.py                ← the shared notebook all agents read and write
├── graph.py                ← supervisor in the middle, agents around it
├── decisions.py            ← skip? which agent? create the PR?
├── llm.py                  ← the AI model
├── browser.py              ← Playwright MCP connection (browser tools)
├── jira.py                 ← Atlassian MCP connection (reads a Jira story)
├── test_runner.py          ← save and run a test
├── agents/
│   ├── test_case_writer.py ← Jira story -> manual test cases
│   ├── supervisor.py
│   ├── explorer.py
│   ├── generator.py
│   ├── reviewer.py
│   └── healer.py
└── nodes/
    ├── test_case.py        ← read the test case
    └── pull_request.py     ← ask you, then branch + commit + push + PR
.github/workflows/main.yml  ← runs the tests on every pull request
```

**Suggested reading order:** `jira.py` → `agents/test_case_writer.py` → `state.py` → `graph.py` → `agents/supervisor.py` → `agents/explorer.py` → `agents/generator.py` → `agents/reviewer.py` → `agents/healer.py` → `nodes/pull_request.py` → `main.py`

## Tips

- Agents make many AI calls, so a run costs more than demo001. `MAX_SUPERVISOR_STEPS` keeps it bounded.
- Set `HEADLESS=true` in `.env` to hide the browser windows.
- Never commit your `.env` file. It is already in `.gitignore`.
