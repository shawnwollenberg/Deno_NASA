import {Router} from "./deps.ts";
//import { Router } from "https://deno.land/x/oak@v5.3.1/mod.ts";

import * as planets from "./models/planets.ts";
import * as launches from "./models/launches.ts";

const router = new Router();

router.get("/", (ctx) =>{
    ctx.response.body=`
                          <>
    .-"""-.       ||::::::==========
   /= ___  \      ||::::::==========
  |- /~~~\  |     ||::::::==========
  |=( '.' ) |     ||================
  \__\_=_/__/     ||================
   {_______}      ||================
 /' *       ''--._||
/= .     [] .     { >
/  /|ooo     |''--'|| 
(   )\_______/      ||
\''\/       \      ||
'-| ==    \_|     ||
  /         |     ||
 |=   >\  __/     ||
 \   \ |- --|     ||
  \ __| \___/     ||
  _{__} _{__}     ||
 (    )(    )     ||
^^~  '"""  '"""  ~^^^~^^~~~^^^~^^^~^^^~^^~^`
});

router.get("/planets", (ctx) =>{
    ctx.response.body=planets.getAllPlanets();
});

router.get("/launches", (ctx) =>{
    ctx.response.body=launches.getAll();
});

router.get("/launches/:id", (ctx) =>{
    if(ctx.params?.id){
        const launchesList = launches.getOne(Number(ctx.params.id));
        if (launchesList){
            ctx.response.body=launches.getOne(Number(ctx.params.id));
        } else{
            ctx.throw(400, "Launch with that ID doesnt Exist");
        }
    }
});

router.delete("/launches/:id", (ctx) =>{
    if(ctx.params?.id){
        const result=launches.removeOne(Number(ctx.params.id));
        ctx.response.body={ success: result};

        /*
        const launchesList = launches.getOne(Number(ctx.params.id));
        if (launchesList){
            ctx.response.body=launches.getOne(Number(ctx.params.id));
        } else{
            ctx.throw(400, "Launch with that ID doesnt Exist");
        }
        */
    }
});

router.post("/launches", async (ctx)=>{
    const body = await ctx.request.body(); //oak automatically parses to JSON

    launches.addOne(body.value);

    ctx.response.body = {success: true};
    ctx.response.status = 201;
}) ;
export default router;