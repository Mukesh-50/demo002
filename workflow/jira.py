# Connects to the Atlassian MCP server (Rovo), which gives us Jira tools,
# and reads a Jira story through it.
# If the MCP server offers no Jira tools for your token (an Atlassian admin setting),
# the story is read from the Jira REST API instead, with the same token.

import base64
import json
import urllib.request

from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools

from config import ATLASSIAN_API_TOKEN, ATLASSIAN_CLOUD_ID, ATLASSIAN_EMAIL, ATLASSIAN_MCP_URL

# The MCP server accepts your Atlassian email + API token as Basic auth
credentials = base64.b64encode(f"{ATLASSIAN_EMAIL}:{ATLASSIAN_API_TOKEN}".encode()).decode()

client = MultiServerMCPClient({
    "atlassian": {
        "transport": "streamable_http",
        "url": ATLASSIAN_MCP_URL,
        "headers": {"Authorization": f"Basic {credentials}"},
    }
})


def tool_text(result):
    # Depending on the adapter version, a tool returns a string or a list of content blocks
    if isinstance(result, str):
        return result
    return "".join(block["text"] for block in result if block.get("type") == "text")


def adf_text(node):
    # The REST API returns the description as ADF (Atlassian Document Format, JSON). Turn it into plain text.
    if node.get("type") == "text":
        return node["text"]
    if node.get("type") == "hardBreak":
        return "\n"
    text = "".join(adf_text(child) for child in node.get("content", []))
    if node.get("type") in ("paragraph", "heading", "listItem", "tableRow", "codeBlock"):
        text += "\n"
    return text


def read_story_from_rest(story_key: str):
    url = f"https://api.atlassian.com/ex/jira/{ATLASSIAN_CLOUD_ID}/rest/api/3/issue/{story_key}?fields=summary,description"
    request = urllib.request.Request(url, headers={"Authorization": f"Basic {credentials}", "Accept": "application/json"})
    with urllib.request.urlopen(request) as response:
        issue = json.load(response)
    fields = issue["fields"]
    return f"Jira story {issue['key']}: {fields['summary']}\n\n{adf_text(fields['description'] or {})}"


async def read_story(story_key: str):
    # Returns the story as text: key, title and description (with its acceptance criteria)
    async with client.session("atlassian") as session:
        tools = {tool.name: tool for tool in await load_mcp_tools(session)}
        if "getJiraIssue" not in tools:
            print("Jira: the Atlassian MCP server offers no Jira tools for this token, reading the story from the Jira REST API")
            return read_story_from_rest(story_key)

        print("Jira: reading the story through the Atlassian MCP server")
        result = await tools["getJiraIssue"].ainvoke({
            "cloudId": ATLASSIAN_CLOUD_ID,
            "issueIdOrKey": story_key,
            "fields": ["summary", "description"],
            "responseContentFormat": "markdown",
        })

    issue = json.loads(tool_text(result))["issues"]["nodes"][0]
    fields = issue["fields"]
    return f"Jira story {issue['key']}: {fields['summary']}\n\n{fields['description']}"
