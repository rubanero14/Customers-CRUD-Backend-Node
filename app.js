const PORT = process.env.PORT || 3000;
const Express = require('express');
const fs = require('fs');
const Cors = require('cors');

// Customer Data Storage File path
const customerJSON = './customers.json';

// Initiate Express
const app = Express();

// Initiate and use middlewares here
app.use(Express.urlencoded());
app.use(Express.json());

// Activate Cors
app.use(
   Cors({
       origin: '*',
   })
)
const getAllCustomers = (cb) => {
    fs.readFile(customerJSON, 'utf8', cb);
};

// GET: endpoint for get request
app.get('/customers', async (req, res, next) => {
   getAllCustomers((err, customers) => {
        try {
            res.send(JSON.parse(customers));
        } catch {
            console.log(err);
        } 
    })
})

// PUT: endpoint for put request
app.post('/customers', async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const age = req.body.age;
    const customer = {
        id: `cid${Date.now()}`, 
        firstName: firstName, 
        lastName: lastName, 
        age: age
    };

    getAllCustomers((err, customers) => {
        try {
            customers = JSON.parse(customers);
            customers[customers.length] = customer;
            customers = JSON.stringify(customers);
            console.log("customers", customers)
            fs.writeFile(customerJSON, customers, (err) => {
                console.log(err);
            });
            res.redirect("/customers");
        } catch {
            console.log(err);
        }
    });
})

app.get('/customers/:id', async (req, res, next) => {
    const id = req.params.id;
    getAllCustomers((err, customers) => {
        try {
            const customerData = JSON.parse(customers);
            const filteredCustomer = customerData.find(customer => customer.id === id);
            res.send(filteredCustomer);
        } catch {
            console.log(err);
        } 
    });
 })

// DELETE: endpoint for delete request
app.post('/deleteUser', async (req, res, next) => {
   const id = req.body.id;
   getAllCustomers((err, customers) => {
        try {
            const customerData = JSON.parse(customers);
            customers = customerData.filter(customer => customer.id !== id);
            fs.writeFile(customerJSON, JSON.stringify(customers), (err) => {
                console.log(err);
            });
            res.redirect('/customers')
        } catch {
            console.log(err);
        }
    });
})


// GET: endpoint for home
app.get('/', async (req, res, next) => {
    // Your code here
    res.send(`
        <h1>Add New Customer</h1>
        <form action="/customers" method="POST">
            <label for="age">Customer First Name</label>
            <input type="text" placeholder="Enter customer First Name.." name="firstName" id="firstName" />
            <br/><br/>
            <label for="age">Customer Last Name</label>
            <input type="text" placeholder="Enter customer Last Name.." name="lastName" id="lastName" />
            <br/><br/>
            <label for="age">Customer Age</label>
            <input type="number" placeholder="Enter customer Age.." name="age" id="age" />
            <br/><br/>
            <input type="submit"/>
        </form>
        <h1>Delete Customer</h1>
        <form action="/deleteUser" method="POST">
            <input type="hidden" name="id" value="cid1669145029641" />
            <button type="submit">Delete User</button>
        </form>
    `);
})

// Initiate Server
app.listen(PORT, () => { console.log(`Server is online on PORT: http://localhost:${PORT}`)})