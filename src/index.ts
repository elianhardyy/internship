import { server } from "./utils/server";

const app = server();

const port = 5000;
app.listen(port,()=>{console.log(`http://localhost:${port}`)});
