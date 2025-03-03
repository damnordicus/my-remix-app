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

export async function createJiraIssue(data: any) {
  // url = issue
  // makeJiraRequest(url, 'POST', {body})
  const response = makeJiraRequest('issue', 'POST', data);
}

export function createJiraBody({classification, printer, barcodes, details, title, userId}: {classification: string; printer: string; barcodes: string[]; details: string; title: string; userId: string}){

  let num;

  switch(classification){
    case "Mission":
      num = 5;
      break;
    case "Personal":
      num = 1;
      break;
  }

  const body = {
    "fields": {
        "project": {
            "id": "10012"
        },
        "summary": title,
        "issuetype": {
            "id": "10009"
        },
        "priority": {
            "id": num
        },
        "customfield_10133": userId,
        "customfield_10030": {
        "id": "10124"
      },
      "description":{
        "type": "doc",
        "version": 1,
        "content":[{
          "type": "paragraph",
          "content":[{
            "type": "text",
            "text": details,
          }]
        }],
      },
      "customfield_10162": {
        "type": "doc",
        "version": 1,
        "content": [{
          "type": "paragraph",
          "content": [{
            "type": "text",
            "text": barcodes.join(", ")}
          ],
        }
        ],
      },
      "customfield_10163": {
        "value": printer,
        "id": "10157",
      }
    }
  }

  return body
}

export async function getUserIssues(username: string) {
  const url = `search?jql=project%20%3D%20%22Additive%20Manufacturing%20Old%22%20AND%20%22Contact%20Full%20Name%5BShort%20text%5D%22%20~%20'ignore-me'`;
  const response = await makeJiraRequest(url);
  if (response.ok) {
    const json = (await response.json()) as JiraIssuesResponse;
    return issuesArrayToMap(json.issues);
  }
  throw new Error(`There was an error fetching the issues. ${response.status}`);
}

function issuesArrayToMap(issues: JiraIssuesResponse["issues"]): JiraIssueMap {
  const mapper: JiraIssueMap = new Map();

  for (const { id, fields } of issues) {
    const descriptionContentNode = fields.description?.content[0].content;
    console.log(descriptionContentNode);
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
    });
  }

  return mapper;
}
