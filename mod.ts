import {log,Application, send} from "./deps.ts";
//import * as log from "https://deno.land/std/log/mod.ts";
//import { Application, send } from "https://deno.land/x/oak@v5.3.1/mod.ts";

import api from "./api.ts";

const app = new Application();
const PORT = 8000;

await log.setup({
    handlers:{
        console: new log.handlers.ConsoleHandler("INFO"), //logs everythign above INFO... info, error , warningn / critcal
    },
    loggers: {
        default:{
            level: "INFO",
            handlers: ["console"],
        },
    },
});
app.addEventListener("error",(event) =>{
    //errors from Oak
    log.error(event.error);
});

app.use(async(ctx,next)=> {
    //catch error anywhere in the middleware below
    try{
        await next();
    } catch(err) {
        log.error(err);
        ctx.response.body="Internal Server Error";
        throw err;
    }
});

app.use(async (ctx, next) =>{
    await next();
    const time = ctx.response.headers.get("X-Response-Time");
    log.info(`${ctx.request.method} ${ctx.request.url}: ${time}`);
})

app.use(async (ctx, next)=>{    
    const start = Date.now();
    await next();
    const delta = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(api.routes());

app.use(async (ctx) =>{
    const filePath=ctx.request.url.pathname;
    const fileWhiteList=[
        "/index.html",
        "/javascripts/script.js",
        "/stylesheets/style.css",
        "/images/favicon.png",
        "/videos/spaceVideo.mp4",
    ];
    if (fileWhiteList.includes(filePath)){
        await send(ctx,filePath,{
            root: `${Deno.cwd()}/public`,
        });
    }
    
});



if (import.meta.main){
    log.info(`Starting server on port ${PORT}....`);
    await app.listen({
        port: PORT,
    });
    
}


/*
Frameworks with Deno
    Drash - REST (CRUD)
    Deno Express = similar to Express
    pogo - react / JSX support
    servest
    (*** winner) oak - similar to Express

middleware - what happens between request and response   
    no next makes it the end point


deno run --allow-read --allow-net mod.ts
deno run --allow-read --allow-net --lock-write --lock=lock.json mod.ts
--lock file makes sure that the dependencies havent been tampered with using a sha hash
    */