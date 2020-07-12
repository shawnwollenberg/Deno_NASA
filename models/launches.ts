import {log, _} from "../deps.ts";

//import * as log from "https://deno.land/std/log/mod.ts";
//import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js"

interface Launch{
    flightNumber: number;
    mission: string;
    rocket: string;
    customers: Array<string>;
    launchDate: number;
    upcoming: boolean;
    success?: boolean;
    target?: string;
}
const launches = new Map<number, Launch>(); 

await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler("DEBUG"),
    },
    loggers: {
        default: {
            level: "DEBUG",
            //handlers: ["console","file"],
            handlers: ["console"],
        }
    }
});
export async function downloadLaunchData() {
    log.info("Downloading launch data...");
    const response = await fetch("https://api.spacexdata.com/v3/launches", {
        method: "GET",
    });
    if (!response.ok){
        log.warning("Problem downloading")
        throw new Error("Launch data download failed");
    }
    const launchData = await response.json();
    for(const launch of launchData){
        const payloads = launch["rocket"]["second_stage"]["payloads"];
        const customers=_.flatMap(payloads, (payload: any)=>{
            return payload["customers"];
        });

        const flightData={
            flightNumber: launch["flight_number"],
            mission: launch["mission_name"],
            rocket: launch["rocket"]["rocket_name"],
            launchDate:launch["launch_date_unix"],
            upcoming: launch["upcoming"],
            success: launch["launch_success"],
            customers: customers,
        };
        launches.set(flightData.flightNumber, flightData)
        log.info(JSON.stringify(flightData));
    }

    //console.log(launchData);
}
/*async function test(){
    const response = await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: {
            "Content-Type":"application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            name: "Elon Musk",
            job: "billionaire"
        })
    });
    const testData = await response.json();
    console.log(testData);

}
*/
//https://reqres.in/api/users

//await  test();

//if(import.meta.main){
    //log.info(JSON.stringify(import.meta));
    await  downloadLaunchData();
    
    log.info(`Downloaded data for ${launches.size} SpaceX launches.`)
export function getAll(){
    return Array.from(launches.values()); //from map

}
export function removeOne(id: number){
    const aborted=launches.get(id);
    if(aborted){
        aborted.upcoming=false;
        aborted.success=false;
    }
    return aborted;

}
export function getOne(id : number){
    if(launches.has(id)){
        return launches.get(id); //from map
    }
    return null;
}
export function addOne(data : Launch){
    launches.set(data.flightNumber, Object.assign(data,{
        upcoming: true,
        customers:["Shawn","NASA"],
    }));
}
//}
//Deno run --allow-net=api.spacexdata.com mod.ts 
//for test
    //deno run --allow-net mod.ts

