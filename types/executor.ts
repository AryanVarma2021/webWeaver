
import { Browser, Page } from "puppeteer";
import { WorkflowTask } from "./workflow";

export type Environment = {
    page?: Page;

    browser?:Browser;
    phases : {
        [key:string] : {
            inputs : Record<string, string>;
            outputs : Record<string, string>;
        }
    }
}


export type ExecutionEnvironment<T extends WorkflowTask>  = {

    getBrowser() : Browser | undefined;
    setBrowser(browser : Browser) : void;
    setOutputs(name : T["outputs"][number]["name"], value:string) : void;
    getPage() : Page | undefined;
    setPage(page : Page) : void;
    getInput(name : T["inputs"][number]["name"]):string; 

}