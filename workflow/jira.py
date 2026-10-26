# Hello! This file has one job: read a Jira story.
#
# A Jira story is like a little note card. It has:
#   - a key         (its name tag, like "SCRUM-7")
#   - a summary     (its title)
#   - a description (the long text, with the acceptance criteria)
#
# We have two ways to get the card:
#   Way 1: ask the Atlassian MCP server (it has tools that can read Jira).
#   Way 2: ask the Jira REST API directly, if Way 1 does not work.

import base64
import json
import urllib.request
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools

from config import ATLASSIAN_API_TOKEN, ATLASSIAN_CLOUD_ID, ATLASSIAN_EMAIL, ATLASSIAN_MCP_URL


# ---------- Step 1: make our secret password ----------
# Jira wants to know who we are.
# We glue our email and token together like "email:token",
# then wrap it up in base64 (a secret code Jira understands).
email_and_token = f"{ATLASSIAN_EMAIL}:{ATLASSIAN_API_TOKEN}"
secret_password = base64.b64encode(email_and_token.encode()).decode()


# ---------- Step 2: get ready to talk to the MCP server (Way 1) ----------
client = MultiServerMCPClient({
    "atlassian": {
        "transport": "streamable_http",
        "url": ATLASSIAN_MCP_URL,
        "headers": {"Authorization": f"Basic {secret_password}"},
    }
})


def get_words_from_answer(answer):
    # Sometimes the MCP tool answers with plain words.
    if isinstance(answer, str):
        return answer

    # Other times it gives a list of content blocks.
    # We take every block whose type is "text" and put all the words together.
    all_words = ""
    for content_block in answer:
        if content_block.get("type") == "text":
            all_words += content_block["text"]
    return all_words


def turn_jira_blocks_into_words(block):
    # The REST API (Way 2) gives the description as building blocks (called ADF), not plain words.
    # This function takes the blocks apart and gives back plain words.

    # A "text" block is just words. Easy!
    if block.get("type") == "text":
        return block["text"]

    # A "hardBreak" block means "start a new line".
    if block.get("type") == "hardBreak":
        return "\n"

    # Any other block has smaller blocks inside it.
    # We look inside each small block (this same function again!) and join the words.
    words = ""
    for small_block in block.get("content", []):
        words += turn_jira_blocks_into_words(small_block)

    # Things like paragraphs and headings should end with a new line.
    if block.get("type") in ("paragraph", "heading", "listItem", "tableRow", "codeBlock"):
        words += "\n"

    return words


def read_story_from_rest(story_key: str):
    # Way 2: ask Jira directly for the story.

    # This is Jira's address for our story. We only ask for the title and the description.
    jira_address = (
        f"https://api.atlassian.com/ex/jira/{ATLASSIAN_CLOUD_ID}"
        f"/rest/api/3/issue/{story_key}?fields=summary,description"
    )

    # We show our secret password and say "please answer in JSON".
    question = urllib.request.Request(jira_address, headers={
        "Authorization": f"Basic {secret_password}",
        "Accept": "application/json",
    })

    # Send the question and read Jira's answer.
    with urllib.request.urlopen(question) as answer:
        story = json.load(answer)

    # Pick out the parts we want.
    key = story["key"]
    title = story["fields"]["summary"]
    description_blocks = story["fields"]["description"] or {}  # no description? use an empty dictionary
    description = turn_jira_blocks_into_words(description_blocks)

    return f"Jira story {key}: {title}\n\n{description}"


async def read_story(story_key: str):
    # This is the main function other files use.
    # Give it a story key (like "SCRUM-7") and it gives back the story as text.

    async with client.session("atlassian") as session:
        # Ask the MCP server: "What tools do you have?"
        mcp_tools = {}
        for tool in await load_mcp_tools(session):
            mcp_tools[tool.name] = tool

        # No "getJiraIssue" tool? Then Way 1 cannot work, so we use Way 2.
        # (An Atlassian admin decides if your token gets Jira tools.)
        if "getJiraIssue" not in mcp_tools:
            print("Jira: the Atlassian MCP server offers no Jira tools for this token, reading the story from the Jira REST API")
            return read_story_from_rest(story_key)

        # Way 1 works! Use the "getJiraIssue" tool to read the story.
        print("Jira: reading the story through the Atlassian MCP server")
        answer = await mcp_tools["getJiraIssue"].ainvoke({
            "cloudId": ATLASSIAN_CLOUD_ID,
            "issueIdOrKey": story_key,
            "fields": ["summary", "description"],
            "responseContentFormat": "markdown",
        })

    # The answer is JSON text. Turn it into a Python dictionary.
    answer_words = get_words_from_answer(answer)
    story = json.loads(answer_words)["issues"]["nodes"][0]

    # Pick out the parts we want.
    key = story["key"]
    title = story["fields"]["summary"]
    description = story["fields"]["description"]

    return f"Jira story {key}: {title}\n\n{description}"
