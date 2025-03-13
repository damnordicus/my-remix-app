interface JiraIssuesResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraIssue[];
}

// Issue type
interface JiraIssue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: JiraIssueFields;
}

// Fields for an issue
interface JiraIssueFields {
  statuscategorychangedate: string;
  fixVersions: unknown[];
  resolution: null;
  lastViewed: string;
  priority: ValidJiraPriority;
  labels: string[];
  aggregatetimeoriginalestimate: null | number;
  timeestimate: null | number;
  versions: unknown[];
  issuelinks: unknown[];
  assignee: JiraUser | null;
  status: JiraStatus;
  components: unknown[];
  customfield_10059: null;
  customfield_10063: string | null;
  aggregatetimeestimate: null | number;
  creator: JiraUser;
  subtasks: unknown[];
  reporter: JiraUser;
  aggregateprogress: JiraProgress;
  progress: JiraProgress;
  votes: JiraVotes;
  issuetype: JiraIssueType;
  timespent: null | number;
  project: JiraProject;
  aggregatetimespent: null | number;
  resolutiondate: null;
  workratio: number;
  watches: JiraWatches;
  created: string;
  customfield_10024: null | string;
  customfield_10018: JiraHasEpicLink;
  updated: string;
  timeoriginalestimate: null;
  description: JiraContent | null;
  customfield_10133: string | null;
  security: null;
  summary: string;
  customfield_10001: JiraAvatar | null;
  environment: null;
  duedate: string | null;
}

// User data type
interface JiraUser {
  self: string;
  accountId: string;
  avatarUrls: {
    "48x48": string;
    "24x24": string;
    "16x16": string;
    "32x32": string;
  };
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
}

// Priority ID literal type
type JiraPriorityId = "1" | "2" | "3" | "4" | "5";

// Priority name literal type corresponding to IDs
// type JiraPriorityName = 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';

// Priority data type with enforced ID-name correlation
// interface JiraPriority {
//   self: string;
//   iconUrl: string;
//   id: JiraPriorityId;
//   name: JiraPriorityName;
// }

// Helper type to enforce correlation between ID and name
type JiraPriorityMap = {
  "1": "Highest";
  "2": "High";
  "3": "Medium";
  "4": "Low";
  "5": "Lowest";
};

// Type that enforces the correlation
type ValidJiraPriority = {
  [K in JiraPriorityId]: {
    self: string;
    iconUrl: string;
    id: K;
    name: JiraPriorityMap[K];
  };
}[JiraPriorityId];

// Status data type
interface JiraStatus {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: JiraStatusCategory;
}

// Status category data type
interface JiraStatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

// Progress data type
interface JiraProgress {
  progress: number;
  total: number;
  percent?: number;
}

// Votes data type
interface JiraVotes {
  self: string;
  votes: number;
  hasVoted: boolean;
}

// Issue type data type
interface JiraIssueType {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
  hierarchyLevel: number;
}

// Project data type
interface JiraProject {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  avatarUrls: {
    "48x48": string;
    "24x24": string;
    "16x16": string;
    "32x32": string;
  };
}

// Watches data type
interface JiraWatches {
  self: string;
  watchCount: number;
  isWatching: boolean;
}

// Description content type (Atlassian Document Format)
interface JiraContent {
  type: string;
  version: number;
  content: JiraContentNode[];
}

interface JiraContentNode {
  type: string;
  content?: JiraContentNode[];
  text?: string;
  marks?: JiraMark[];
}

interface JiraMark {
  type: string;
  attrs?: {
    href?: string;
    [key: string]: string | undefined;
  };
}

// Custom field type for parent link
interface JiraHasEpicLink {
  hasEpicLinkFieldDependency: boolean;
  showField: boolean;
  nonEditableReason: {
    reason: string;
    message: string;
  };
}

// Custom field for teams/groups
interface JiraAvatar {
  id: string;
  name: string;
  avatarUrl: string;
  isVisible: boolean;
  isVerified: boolean;
  title: string;
  isShared: boolean;
}

type JiraIssueMap = Map<
  string,
  {
    id: string;
    description: string;
    userId: string | null;
    priority: JiraIssueFields["priority"];
    created: JiraIssueFields["created"];
    creator: JiraIssueFields["creator"];
    summary: JiraIssueFields["summary"];
    printer: JiraIssueFields["customfield_10063"]
    
  },
  string,
>;
