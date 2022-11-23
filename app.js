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

// GET: endpoint for get all customers list request
app.get('/customers', async (req, res, next) => {
   getAllCustomers((err, customers) => {
        try {
            res.status(200).send(JSON.parse(customers));
        } catch {
            res.status(503).send(err);
        } 
    })
})

// POST: endpoint for create new customer request
app.post('/customers', async (req, res, next) => {
    const customer = req.body;

    getAllCustomers((err, customers) => {
        try {
            customers = JSON.parse(customers);
            customers[customers.length] = customer;
            customers = JSON.stringify(customers);
            fs.writeFile(customerJSON, customers, (err) => {
                console.log(err);
            });
            res.status(200).send("Registration successful");
        } catch {
            res.status(503).send("Registration unsuccessful");
        }
    });
})

// GET: endpoint for customer details based on id request
app.get('/customers/:id', async (req, res, next) => {
    const id = req.params.id;
    getAllCustomers((err, customers) => {
        try {
            const customerData = JSON.parse(customers);
            const filteredCustomer = customerData.find(customer => customer.id === id);
            res.status(200).send(filteredCustomer);
        } catch {
            res.status(503).send(err);
        } 
    });
})

// POST: endpoint for update customer details based on id
app.post('/customers/edit/:id', async (req, res, next) => {
    const customer = req.body;

    getAllCustomers((err, customers) => {
        try {
            customers = JSON.parse(customers);
            const targetCustomer = customers.map(customer => customer.id).indexOf(id);
            console.log(targetCustomer)
            customers[4] = customer;
            customers = JSON.stringify(customers);
            fs.writeFile(customerJSON, customers, (err) => {
                if(err) {
                    res.status(503).send(err);
                } else {
                    res.status(200).send(`Update for ID:${customer.id} successful!`);
                }
            });

        } catch {
            res.status(503).send(err);
        }
    });
})

// POST: endpoint for delete request
app.post('/deleteUser', async (req, res, next) => {
   const id = req.body.id;
   getAllCustomers((err, customers) => {
        try {
            const customerData = JSON.parse(customers);
            customers = customerData.filter(customer => customer.id !== id);
            fs.writeFile(customerJSON, JSON.stringify(customers), (err) => {
                if(err) {
                    res.status(503).send(err);
                } else {
                    res.status(200).send(`Delete for ID:${id} successful!`);
                }
            });
        } catch {
            res.status(503).send(err);
        }
    });
})

// Testing playground before building frontend 
// GET: endpoint for home
app.get('/', async (req, res, next) => {
    // Your code here
    res.send(`
        <h1>Delete Customer</h1>
        <form action="/deleteUser" method="POST">
            <input type="hidden" name="id" value="cid1669145029641" />
            <button type="submit">Delete User</button>
        </form>
    `);
})

app.get('/update/:id', async (req, res, next) => {
    const id = req.params.id;
    getAllCustomers((err, customers) => {
        try {
            const customerData = JSON.parse(customers);
            const filteredCustomer = customerData.find(customer => customer.id === id);
            res.send(`
                <h1>Edit Customer</h1>
                <form action="/customers/edit/${filteredCustomer.id}" method="POST">
                    <label for="age">Customer First Name</label>
                    <input type="text" value="${filteredCustomer.firstName}" placeholder="Enter customer First Name.." name="firstName" id="firstName" />
                    <br/><br/>
                    <label for="age">Customer Last Name</label>
                    <input type="text" value="${filteredCustomer.lasName}" placeholder="Enter customer Last Name.." name="lastName" id="lastName" />
                    <br/><br/>
                    <label for="age">Customer Age</label>
                    <input type="number" value="${filteredCustomer.age}" placeholder="Enter customer Age.." name="age" id="age" />
                    <br/><br/>
                    <input type="submit"/>
                </form>
            `)
        } catch {
            console.log(err);
        } 
    });
})

// Initiate Server
app.listen(PORT, () => { console.log(`Server is online on PORT: http://localhost:${PORT}`)})