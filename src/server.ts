import express from 'express';
import bodyParser from 'body-parser';
import { connectToMongo } from './config/database';
import { connectToMySQL } from './config/database';
import { UserController } from './adapters/http/userController';
import { VendedorController } from './adapters/http/vendedorController';
import { MongoUserRepository } from './adapters/persistence/mongoUserRepository';
import { MysqlUserRepository } from './adapters/persistence/mysqlUserRepository';
import { MongoVendedorRepository } from './adapters/persistence/mongoVendedorRepository';
import { MysqlVendedorRepository } from './adapters/persistence/mysqlVendedorRepository';
import { UserService } from './application/userService';
import { VendedorService } from './application/vendedorService';


const app = express();
app.use(bodyParser.json());

async function startServer() {
    // Conectar a MongoDB
    await connectToMongo();
    const mongoUserRepository = new MongoUserRepository();
    const mongoUserService = new UserService(mongoUserRepository);
    const mongoUserController = new UserController(mongoUserService);

    const mongoVendedorRepository = new MongoVendedorRepository();
    const mongoVendedorService = new VendedorService(mongoVendedorRepository);
    const mongoVendedorController = new VendedorController(mongoVendedorService);

    // Conectar a MySQL
    const mysqlConnection = await connectToMySQL();
    const mysqlUserRepository = new MysqlUserRepository(mysqlConnection);
    const mysqlUserService = new UserService(mysqlUserRepository);
    const mysqlUserController = new UserController(mysqlUserService);

    const mysqlVendedorRepository = new MysqlVendedorRepository(mysqlConnection);
    const mysqlVendedorService = new VendedorService(mysqlVendedorRepository);
    const mysqlVendedorController = new VendedorController(mysqlVendedorService);

    // Rutas para Usuarios (MongoDB y MySQL)
    app.post('/users/mongo', (req, res) => mongoUserController.createUser(req, res));
    app.get('/users/mongo/:id', (req, res) => mongoUserController.getUser(req, res));
    app.put('/users/mongo/:id', (req, res) => mongoUserController.updateUser(req, res));
    app.delete('/users/mongo/:id', (req, res) => mongoUserController.deleteUser(req, res));

    app.post('/users/mysql', (req, res) => mysqlUserController.createUser(req, res));
    app.get('/users/mysql/:id', (req, res) => mysqlUserController.getUser(req, res));
    app.put('/users/mysql/:id', (req, res) => mysqlUserController.updateUser(req, res));
    app.delete('/users/mysql/:id', (req, res) => mysqlUserController.deleteUser(req, res));

    // Rutas para Vendedores (MongoDB y MySQL)
    app.post('/vendedores/mongo', (req, res) => mongoVendedorController.createVendedor(req, res));
    app.get('/vendedores/mongo/:id', (req, res) => mongoVendedorController.getVendedor(req, res));
    app.put('/vendedores/mongo/:id', (req, res) => mongoVendedorController.updateVendedor(req, res));
    app.delete('/vendedores/mongo/:id', (req, res) => mongoVendedorController.deleteVendedor(req, res));

    app.post('/vendedores/mysql', (req, res) => mysqlVendedorController.createVendedor(req, res));
    app.get('/vendedores/mysql/:id', (req, res) => mysqlVendedorController.getVendedor(req, res));
    app.put('/vendedores/mysql/:id', (req, res) => mysqlVendedorController.updateVendedor(req, res));
    app.delete('/vendedores/mysql/:id', (req, res) => mysqlVendedorController.deleteVendedor(req, res));

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

startServer().catch(err => console.error(err));