import {assertEquals} from "../test_deps.ts";
/*import{
    assertEquals,
    //assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
*/

import {filterHabitablePlanets} from "./planets.ts";
//import filter from "../../../../../AppData/Local/deno/deps/https/raw.githubusercontent.com/59207cb31a6f3132e1f550c7e938cc302f360a4637fd989914df5f0088bf4f27.ts";

//Earth would be a good test sample for passing
const HABITABLE_PLANET = {
    koi_disposition: "CONFIRMED",
    koi_prad: "1",
    koi_srad: "1",
    koi_smass: "1",
}
//test the Bounds
const NOT_CONFIRMED={
    koi_disposition: "FALSE POSITIVE",
    koi_prad: "1",
    koi_srad: "1",
    koi_smass: "1",
}

const CONFIRMED_TOOLARGE_RADIUS={
    koi_disposition: "CONFIRMED",
    koi_prad: "1.5",
    koi_srad: "1",
    koi_smass: "1",
}

const CONFIRMED_TOOLARGE_SOLAR_RADIUS={
    koi_disposition: "CONFIRMED",
    koi_prad: "1",
    koi_srad: "1.01",
    koi_smass: "1",
}

const CONFIRMED_TOOLARGE_MASS={
    koi_disposition: "CONFIRMED",
    koi_prad: "1",
    koi_srad: "1",
    koi_smass: "1.04",
}

Deno.test("filter only habitable planets",() => {
    const filtered=filterHabitablePlanets([HABITABLE_PLANET,NOT_CONFIRMED,CONFIRMED_TOOLARGE_MASS,CONFIRMED_TOOLARGE_RADIUS,CONFIRMED_TOOLARGE_SOLAR_RADIUS]);
    assertEquals(filtered,[HABITABLE_PLANET]);

});
//deno test --allow-read