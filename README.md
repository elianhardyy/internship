# Facade Project Pattern

 facade pattern ini menyembunyikan komplexitas dari suatu subsitem ke dalam satu class facade. Dimana class tersebut nanti akan diakses oleh client. Sehingga client dimudahkan untuk menggunakan sistem yang dibuat. http://www.tutorialspoint.com/design_pattern/facade_pattern.htm



## How To Install
1. Clone github : `git clone https://github.com/elianhardyy/internship.git`
2. Install dependencies : `npm install`
3. Run server : `npm run dev`

Database telah di hosting ke AWS <br>
Dokumentasi endpoint tersedia di Postman: [API Documentation](https://documenter.getpostman.com/view/18886846/2sAXxJiapN)
## User Model

```ts
export interface IUser{
    username:string,
    email:string,
    password:string
}

export class User extends Model implements IUser{
    public username!:string;
    public email!:string;
    public password!:string;
}
```
## User Service

**AuthService**

```ts
class AuthService{
    public async register(user : IUser) : Promise<User> {}
    public async login(req:Request, res:Response) : Promise<string> {}
}
```

**UserService**

```ts
class UserService{
    public async dashboard(req:Request): Promise<User|null> {}
    public async profile(id:string): Promise<User|null>{}
    public async getAllUsers(): Promise<User[]> {}
    public async editProfile(req:Request, id:string): Promise<[affectedCount:number]>{}
    public async destroy(id:string): Promise<number>{}
}
```

## Middleware
**Middleware JWT Authentication**
```ts
class JWTAuthentication{
    public async verifyToken(req:Request, res:Response, next:NextFunction): Promise<Response|void>{}
}

```

**Middleware Register and Login Validation**
```ts
const userRegister
const userLogin
const editUser
function validate(req:Request, res:Response, next:NextFunction): Response<any,Record<string,any>> | undefined{}
```
## Controller
**UserController**
```ts
class UserController{
    //AuthService
    public async create(req:Request, res:Response): Promise<Response>{
        const service = new AuthService();
        service.register()
    }
    public async login(req:Request, res:Response): Promise<Response>{
        const service = new AuthService();
        service.login()
    }

    //UserService
    public async index(req:Request, res:Response): Promise<Response>{
        const service = new UserService();
        service.dashboard()
    }
    public async detail(req:Request, res:Response): Promise<Response>{
        const service = new UserService();
        service.profile()
    }

    .....
}

```

## User Route
```ts
//auth
user.post('/register',userRegister,validate,UserController.create);
user.post('/login',userLogin,validate,UserController.login);
//user
user.get('/dashboard',JwtAuthentication.verifyToken,UserController.index)
user.get("/profile/:id",JwtAuthentication.verifyToken,UserController.detail)
user.get("/all",JwtAuthentication.verifyToken,UserController.users)
user.put("/update/:id",editUser,JwtAuthentication.verifyToken,UserController.update);
user.delete("/delete/:id",JwtAuthentication.verifyToken,UserController.destroy)
```

## Router
```ts
const router = express();

//user
router.use("/user",user)
//api.user("/product",product) //!e.g
//api.user("/category",category) //!e.g
```

## Server
```ts
export const server = () =>{
    const app = express()

    User.sync()

    app.use(express.urlencoded({extended:true})),
    app.use(express.json());
    app.use("/api/v1",router)

    return app;
} 
```

<p>so the route is <b>http://localhost:5000/{server}/{router}/{user route}</b></p>
<p>for instance <b>http://localhost:5000/api/v1/user/register</b></p>

## Endpoint

```ts
const app = server();
const port = 5000;
app.listen(port,()=>{console.log(`http://localhost:${port}`)});
```
