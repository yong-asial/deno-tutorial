import { serve } from 'https://deno.land/std@v0.42.0/http/server.ts';
import { parse } from 'https://deno.land/std/flags/mod.ts';
import { config } from './config.ts';

const args = parse(Deno.args, {
    default: {
        port: config.port
    }
});

// Get Port
const port = parseInt(args.port, 10); // port


// Get handler from args
let handlerName = config.handler; // default handler file
let handler;
if (args && args._ && args._[0]) {
    handlerName = args._[0].toString(); // handler
}
// Reading handler file
try {
    const handlerPath = await Deno.realPath(handlerName);
    handler = await import(handlerPath)        
} catch (error) {
    console.error(`Try to load ${handlerName}`);
    console.error(error);
    Deno.exit(1);
}

// Start Server
const s = serve({ port: port });
console.log(`Server is listening to ${port} with ${handlerName}`);
for await (const req of s) {
    req.respond({
        body: handler.default(req)
    })
}