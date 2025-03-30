
import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function launchBrowserExecutor(
    environment : ExecutionEnvironment<typeof LaunchBrowserTask>,
) : Promise<boolean> { 

    try {


       
        


        const websiteIrl = environment.getInput("Website URL")
       
        
        
        
        const browser = await puppeteer.launch({
            headless:true
        })

        environment.setBrowser(browser)
        const page = await browser.newPage()
        await page.goto(websiteIrl);
        environment.setPage(page);


    


        return true;

        
    } catch (error) {
        console.error("Error launching browser:", error);
        return false;
        
    }
   }