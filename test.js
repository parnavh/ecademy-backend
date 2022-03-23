
import { readdirSync, lstatSync } from "fs";

const dir_items = readdirSync('./api')
dir_items.forEach((item) => {
    if (!lstatSync(`./api/${item}`).isDirectory()) return;

    const files = readdirSync(`./api/${item}/`)
    
    files.forEach(async file => {
        const content = await import(`./api/${item}/${file}`)

        Object.getOwnPropertyNames(content).forEach(func => {
            const function_loaded = Object.getOwnPropertyDescriptor(content, func).value
            console.log(func, function_loaded);
        })
    })
})