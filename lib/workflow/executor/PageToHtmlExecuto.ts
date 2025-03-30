

import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { PageToHtml } from "../task/PageToHtml";

export async function PageToHtmlExecutor(
    environment : ExecutionEnvironment<typeof PageToHtml>,
) : Promise<boolean> { 

    try {

        
        
        const html = await environment.getPage()!.content();
        
        
        environment.setOutputs("HTML", JSON.stringify(html));
        

        return true;  

        
    } catch (error) {
        console.error("Error launching browser:", error);
        return false;
        
    }
   }