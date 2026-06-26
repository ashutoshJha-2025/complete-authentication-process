import "./src/config/env.js"
import { app } from "./src/app.js";
import { connectDB } from "./src/db/db.js";
import { checkRedisConnection } from "./src/services/redis.service.js";
import { checkEmailConnection } from "./src/services/email.service.js";

connectDB()
checkRedisConnection()
checkEmailConnection()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at port: ${process.env.PORT || 8000}`)
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err)
    })