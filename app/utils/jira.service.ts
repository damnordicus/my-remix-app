async function makeJiraRequest(url: string, method?: RequestInit['method'], body?: RequestInit['body']) {
  return fetch(`https://travisspark.atlassian.net/rest/api/3/${url}`, {
    method: method ?? 'GET',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `adam.nord@travisspark.com:${import.meta.env.VITE_JIRA_API_KEY}`
      ).toString("base64")}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });
}

export async function createJiraIssue(body: string) {
  // url = issue
  // makeJiraRequest(url, 'POST', {body})
  return await makeJiraRequest('issue', 'POST', body);
}

export function createJiraBody({classification, printer, barcodes, details, title, userId}: {classification: string; printer: string; barcodes: string[]; details: string; title: string; userId: string}){

  let num;

  switch(classification){
    case "Mission":
      num = "2";
      break;
    case "Personal":
      num = "5";
      break;
  }

  const body = {
    "fields": {
        "project": {
            "id": "10047"
        },
        "summary": title,
        "issuetype": {
            "id": "10075"
        },
        "priority": {
            "id": num
        },
        "customfield_10201": userId,
        
      "description":{
        "type": "doc",
        "version": 1,
        "content":[{
          "type": "paragraph",
          "content":[{
            "type": "text",
            "text": details
          }]
        }]
      },
      "customfield_10162": {
        "type": "doc",
        "version": 1,
        "content": [{
          "type": "paragraph",
          "content": [{
            "type": "text",
            "text": barcodes.join(", ")
            }]
        }]
      },
      "customfield_10163": {
            "value": printer
        }
    }
  }

  return JSON.stringify(body)
}

export async function getUserIssues(username: string) {
  const url = `search?jql=${encodeURIComponent(`project=10047 AND 'Inventory App User Id[Short text]'~'${username}'`)}`;
  console.log(url);
  const response = await makeJiraRequest(url);
  if (response.ok) {
    const json = (await response.json()) as JiraIssuesResponse;
    return issuesArrayToMap(json.issues);
  }
  return {error: "Couldn't connect to Jira"}
  //throw new Error(`There was an error fetching the issues. ${response.status}`);
}

function issuesArrayToMap(issues: JiraIssuesResponse["issues"]): JiraIssueMap {
  const mapper: JiraIssueMap = new Map();

  for (const { id, fields } of issues) {
    const descriptionContentNode = fields.description?.content[0].content;
    const printer = fields.customfield_10163;
    let description = "";
    if (
      descriptionContentNode &&
      Array.isArray(descriptionContentNode) &&
      descriptionContentNode.length > 0
    )
      description = descriptionContentNode[0].text ?? "";

    const userId = fields.customfield_10133;

    const { priority, created, creator, summary } = fields;

    mapper.set(id, {
      id,
      description,
      userId,
      priority,
      created,
      creator,
      summary,
      printer,
    });
  }

  return mapper;
}
