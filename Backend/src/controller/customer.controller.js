import Customer from "../model/Customer.js";
import Payment from "../model/Payment.js";
import Tax from "../model/Tax.js";
import InvoiceModel from "../model/Invoice.js";

export const addCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, country } = req.body;
        console.log(name, email, phone, address, country);
        if (!name || !email || !phone || !address || !country) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Customer already exists" });
        }

        const newCustomer = new Customer({ name, email, phone, address, country });
        await newCustomer.save();
        return res.status(201).json({ message: "Customer added successfully", newCustomer });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        return res.status(200).json({ customers });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const payment_mode = async (req, res) => {
    try {
        const { payment_mode: modeName, description, enabled, default_Mode } = req.body;
        console.log(modeName, description, enabled, default_Mode);
        if (!modeName || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingPayment = await Payment.findOne({ payment_mode: modeName });
        if (existingPayment) {
            return res.status(400).json({ message: "Payment mode already exists" });
        }

        const newPayment = new Payment({ payment_mode: modeName, description, enabled, default_Mode });
        await newPayment.save();
        return res.status(201).json({ message: "Payment mode added successfully", newPayment });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const tax = async (req, res) => {
    try {
        const { name, value, enabled, default: default_mode } = req.body;
        console.log(name, value, enabled, default_mode);
        if (!name || !value) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingTax = await Tax.findOne({ name });
        if (existingTax) {
            return res.status(400).json({ message: "Tax already exists" });
        }

        const newTax = new Tax({ name, value, enabled, default: default_mode });
        await newTax.save();
        return res.status(201).json({ message: "Tax added successfully", newTax });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const Invoice = async (req, res) => {
    try {
        const { client, Number, Year, status, Date, expire_date, note, items, description, price, Quentity, total } = req.body;
        console.log(client, Number, Year, status, Date, expire_date, note, items, description, price, Quentity, total);
        if (!client || !Number || !Year || !status || !Date || !expire_date || !price || !Quentity || !total) {
            return res.status(400).json({ message: "All required fields are required" });
        }

        const existingInvoice = await InvoiceModel.findOne({ Number });
        if (existingInvoice) {
            return res.status(400).json({ message: "Invoice already exists" });
        }

        const newInvoice = new InvoiceModel({ client, Number, Year, status, Date, expire_date, note, items, description, price, Quentity, total });
        await newInvoice.save();
        return res.status(201).json({ message: "Invoice added successfully", newInvoice });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        return res.status(200).json({ payments });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllTaxes = async (req, res) => {
    try {
        const taxes = await Tax.find();
        return res.status(200).json({ taxes });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await InvoiceModel.find();
        return res.status(200).json({ invoices });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}