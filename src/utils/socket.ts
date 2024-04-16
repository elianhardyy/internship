import { Express } from "express"
import http from "http";
import { SerialPort, ReadlineParser } from "serialport";
import { Server, Socket } from "socket.io";
import { socketRoute } from "../socket/router";


export const socketInit = (app:Express) => {
    const server = http.createServer(app);
    const io = new Server(server);

    io.on("connection",(socket:Socket)=>{
        console.log("connected");
        socket.on("disconnect",()=>{
            console.log("disconnect")
        })
    })
    //kconsole.log("this is socket")
    //! serial connection
    const port = new SerialPort({
        path:"COM3",
        baudRate:9600
    })
    //! parse data from esp
    const parser = port.pipe(new ReadlineParser({
        delimiter:"\r\n"
    }))
    //! catch data from esp
    parser.on("data",(result)=>{
        console.log(`data dari esp32 ${result}`)
        io.emit("data",{data:result});
    })
    app.post("/espApi",(req,res)=>{
        const data = req.body.data;
        port.write(data,(err)=>{
            if(err){
                console.log('err:',err)
                res.status(500).json({error:"write error"})
            }
            console.log("berhasil",data);
            res.end();
        })
    })
}