import { Tasktype } from "@/types/Tasktype";
import { ExtractTextFromElement } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtml } from "./PageToHtml";
import { WorkflowTask } from "@/types/workflow";

export const TaskRegistry : Registry = {
    LAUNCH_BROWSER : LaunchBrowserTask,
    PAGE_TO_HTML : PageToHtml,
    EXTRACT_TEXT_FROM_ELEMENT : ExtractTextFromElement
}

type Registry = {
    [k in Tasktype] : WorkflowTask & {type : k};
}
