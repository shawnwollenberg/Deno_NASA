//mod.ts is the "entry point" for an application - just a convention
import {log, join, BufReader, parse,_} from "../deps.ts";
/*import { join } from "https://deno.land/std/path/mod.ts"; // works across different operating systems
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";
import * as log from "https://deno.land/std/log/mod.ts";
*/
//import es version of lodash
//can also get URL from deno.land/x/lodash@4.17.15-es.lodash.js
//import * as _ from "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/lodash.js"

/*interface Planet{
    [ key : string] : string
}
*/
//Cleaner way to write the above>>>
type Planet = Record<string, string>;

let planets: Array<Planet>;

//have to export so we can test
export function filterHabitablePlanets(planets: Array<Planet>){
    return planets.filter((planet) => {
        //radius of planet should be >.5 of Earth and <1.5 of Earth
        //Mass of planet should be >.78 and <1.04
        const planetaryRadius = Number(planet["koi_prad"]);
        const stellarMass = Number(planet["koi_smass"]);
        const stellarRadius = Number(planet["koi_srad"]);
        return planet["koi_disposition"]==="CONFIRMED"
            && planetaryRadius >.5 && planetaryRadius<1.5
            && stellarMass > .78 && stellarMass<1.04
            && stellarRadius > .99 && stellarRadius<1.01;
    })
}

async function loadPlanetsData() {
    const path = join("data", "KeplerData.csv")
    const file = await Deno.open(path);  
    const bufReader = new BufReader(file);
    const result = await parse(bufReader, {
        header: true,
        comment: "#",
    });
    Deno.close(file.rid); //dont forget to close file after opening

    const planets = filterHabitablePlanets(result as Array<Planet>);
/* move to own function to make testing better
    const planets = (result as Array<Planet>).filter((planet) => {
        //radius of planet should be >.5 of Earth and <1.5 of Earth
        //Mass of planet should be >.78 and <1.04
        const planetaryRadius = Number(planet["koi_prad"]);
        const stellarMass = Number(planet["koi_smass"]);
        const stellarRadius = Number(planet["koi_srad"]);
        return planet["koi_disposition"]==="CONFIRMED"
            && planetaryRadius >.5 && planetaryRadius<1.5
            && stellarMass > .78 && stellarMass<1.04
            && stellarRadius > .99 && stellarRadius<1.01
            ;
    })
    //return result;
    //return planets;
    */
    return planets.map((planet)=> {
        return _.pick(planet,[
            "koi_prad",
            "koi_smass",
            "koi_srad",
            "kepler_name",
            "koi_count",
            "koi_steff",
        ])
    });
}

planets = await loadPlanetsData();
log.info(`${planets.length} habitable planets found!`);
export function getAllPlanets(){
    return planets;
}

/*log.info(`${newEarths.length} habitable planets found!`);
for (const planet of newEarths){
    log.info(planet)
}
*/
/*newEarths.forEach(( element ) => {
    log.info(element.kepoi_name, element.kepler_name);
})*/


//Deno run --allow-read mod.ts 