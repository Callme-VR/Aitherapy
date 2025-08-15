import { format } from "path";
import winston=require ("winston");

const Logger=winston.createLogger({
    level:"info",
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename:"combined.log"})
    ]
})

export default Logger; 