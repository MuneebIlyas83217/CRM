import express from "express";
import { addCustomer, getAllCustomers, payment_mode, tax, Invoice, getAllPayments, getAllTaxes, getAllInvoices } from "../controller/customer.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add-customer", verifyToken, authorizeRoles('admin', 'manager'), addCustomer);
router.get("/get-customer", verifyToken, authorizeRoles('admin', 'manager'), getAllCustomers);
router.post("/add-payment-mode", verifyToken, authorizeRoles('admin', 'manager', 'accountant', 'customer'), payment_mode);
router.get("/get-payment-modes", verifyToken, authorizeRoles('admin', 'manager', 'accountant', 'customer'), getAllPayments);
router.post("/add-tax", verifyToken, authorizeRoles('admin', 'manager', 'accountant', 'customer'), tax);
router.get("/get-taxes", verifyToken, authorizeRoles('admin', 'manager', 'accountant', 'customer'), getAllTaxes);
router.post("/add-invoice", verifyToken, authorizeRoles('admin', 'manager', 'accountant', 'customer'), Invoice);
router.get("/get-invoices", verifyToken, authorizeRoles('admin', 'manager', 'accountant', 'customer'), getAllInvoices);

export default router;