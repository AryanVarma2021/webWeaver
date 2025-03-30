import { Tasktype } from "@/types/Tasktype";
import { launchBrowserExecutor } from "./launchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecuto";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";


type ExecutorFn<T extends WorkflowTask> = (environment : ExecutionEnvironment<T>) => Promise<any> | any;

type RegistryType  = {
    [k in Tasktype] : ExecutorFn<WorkflowTask & {type : k}>;
}
export const ExecuteRegistry:RegistryType = {
    LAUNCH_BROWSER : launchBrowserExecutor,
    PAGE_TO_HTML : PageToHtmlExecutor,
    EXTRACT_TEXT_FROM_ELEMENT : () => Promise.resolve(true),
}