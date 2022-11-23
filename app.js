const PORT = process.env.PORT || 3000;
const Express = require('express');
const fs = require('fs');
const Cors = require('cors');
const path = require('path');
require("dotenv").config();

// Customer Data Storage File path
let customerJSON = "";
if (process.env.NODE_ENV !== "production") {
    customerJSON = path.join(__dirname, `customers.json`);
} else {
    customerJSON = './tmp/customers.json';
}

// Initiate Express
const app = Express();

// Initiate and use middlewares here
app.use(Express.urlencoded());
app.use(Express.json());

// Activate Cors
app.use(Cors({ origin: ["http://localhost:3000", "https://rubanero14.github.io"] }));

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
            res.status(200).redirect('/customers');
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
    console.log(customer);
    getAllCustomers((err, customers) => {
        try {
            customers = JSON.parse(customers);
            const filteredCustomer = customers.find(c => c.id === customer.id);
            const indexOfEditCustomer = customers.indexOf(filteredCustomer);
            console.log('customer id: ', customers[indexOfEditCustomer])
            customers[indexOfEditCustomer] = customer;
            customers = JSON.stringify(customers);
            fs.writeFile(customerJSON, customers, (err) => {
                if(err) {
                    res.status(503).send(err);
                } else {
                    res.status(200).redirect('/customers');;
                }
            });
        } catch {
            console.log("error fired")
            res.status(503).send(err);
        }
    });
})

// POST: endpoint for delete request
app.post('/deleteUser', async (req, res, next) => {
   const id = Object.keys(req.body)[0];
   console.log(id)
   getAllCustomers((err, customers) => {
        try {
            const customerData = JSON.parse(customers);
            customers = customerData.filter(customer => customer.id !== id);
            fs.writeFile(customerJSON, JSON.stringify(customers), (err) => {
                if(err) {
                    res.status(503).send(err);
                } else {
                    res.status(200).redirect('/customers');;
                }
            });
        } catch {
            res.status(503).send(err);
        }
    });
})

// Initiate Server
app.listen(PORT, () => { console.log(`Server is online on PORT: http://localhost:${PORT}`)})