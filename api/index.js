import { Router } from "express";
import { readdirSync, lstatSync } from "fs";

const router = Router()

const dir_items = readdirSync('./api')
dir_items.forEach((item) => {
    if (!lstatSync(`./api/${item}`).isDirectory()) return;

    const files = readdirSync(`./api/${item}/`)
    
    files.forEach(async file => {
        const content = await import(`./${item}/${file}`)

        Object.getOwnPropertyNames(content).forEach(func => {
            const function_loaded = Object.getOwnPropertyDescriptor(content, func).value
            let val = file.substring(0, file.length - 3)
            if (val == 'index') val = ''
            console.log(`router.${func}('/${val}', function_loaded)`);
            eval(`router.${func}('/${item}/${val}', function_loaded)`)
        })
    })
})

export default router