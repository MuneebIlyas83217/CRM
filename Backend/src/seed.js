import mongoose from "mongoose";
import dotenv from "dotenv";
import Customer from "./model/Customer.js";
import Invoice from "./model/Invoice.js";
import Payment from "./model/Payment.js";
import Tax from "./model/Tax.js";

// Load environment variables
dotenv.config();

const firstNames = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", 
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", 
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", 
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley", 
    "Steven", "Dorothy", "Paul", "Kimberly", "Andrew", "Emily", "Joshua", "Donna", 
    "Kenneth", "Michelle", "Kevin", "Carol", "Brian", "Amanda", "George", "Timothy", 
    "Melissa", "Edward", "Deborah", "Ronald", "Stephanie", "Jason", "Rebecca"
];

const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", 
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", 
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", 
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", 
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", 
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", 
    "Carter", "Roberts"
];

const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", 
    "France", "United Arab Emirates", "Pakistan", "Saudi Arabia", "Singapore"
];

const streets = [
    "Main St", "Oak Ave", "Pine Rd", "Maple Dr", "Cedar Ln", 
    "Elm St", "View Rd", "Park Ln", "Hill St", "Lake Dr"
];

const itemNames = [
    "Enterprise Software License", "Cloud Infrastructure Hosting", "Database Migration Consulting",
    "UI/UX Design Retainer", "Dedicated Developer Hours", "Security Audit & PenTesting",
    "API Integration Services", "Project Management Tool Subscription", "Custom CRM Module Development",
    "Technical Support SLA"
];

const paymentMethods = [
    "Credit Card", "Bank Wire Transfer", "PayPal Business", "Stripe Gateway", "Apple Pay Pay",
    "Google Pay Pay", "Cryptocurrency (BTC/USDT)", "Check Payment", "ACH Transfer", "Direct Debit"
];

const seedDatabase = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MONGODB_URI is not defined in .env file.");
        process.exit(1);
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("Connected to MongoDB successfully.");

        // 1. Clear Existing Data
        console.log("Clearing existing Customer, Invoice, Payment, and Tax records...");
        await Customer.deleteMany({});
        await Invoice.deleteMany({});
        await Payment.deleteMany({});
        await Tax.deleteMany({});
        console.log("Cleared existing records successfully.");

        // 2. Generate 100 Taxes
        console.log("Generating 100 Tax records...");
        const taxesList = [];
        for (let i = 1; i <= 100; i++) {
            taxesList.push({
                name: `VAT ${i}%`,
                value: i,
                enabled: i <= 20, // Enable the first 20 taxes by default
                default: i === 15 // Set 15% as default tax
            });
        }
        await Tax.insertMany(taxesList);
        console.log("Seeded 100 Tax records.");

        // 3. Generate 100 Payment Modes
        console.log("Generating 100 Payment records...");
        const paymentsList = [];
        for (let i = 1; i <= 100; i++) {
            const baseMethod = paymentMethods[(i - 1) % paymentMethods.length];
            paymentsList.push({
                payment_mode: `${baseMethod} - Gateway #${i}`,
                description: `Authorized gateway channel #${i} for processing ${baseMethod} transactions.`,
                enabled: i <= 30, // Enable first 30 payment gateways
                default_Mode: i === 1 // Set the first gateway as default
            });
        }
        await Payment.insertMany(paymentsList);
        console.log("Seeded 100 Payment records.");

        // 4. Generate 100 Customers
        console.log("Generating 100 Customer records...");
        const customersList = [];
        for (let i = 1; i <= 100; i++) {
            const firstName = firstNames[(i - 1) % firstNames.length];
            const lastName = lastNames[(i - 1) % lastNames.length];
            const name = `${firstName} ${lastName}`;
            
            // Guarantee email uniqueness by appending counter
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@example.com`;
            
            // Format phone number
            const phone = `+1 (555) 012-${String(1000 + i).slice(1)}`;
            
            const street = streets[Math.floor(Math.random() * streets.length)];
            const address = `${100 + i} ${street}, Suite ${i}`;
            const country = countries[Math.floor(Math.random() * countries.length)];

            customersList.push({
                name,
                email,
                phone,
                address,
                country
            });
        }
        const seededCustomers = await Customer.insertMany(customersList);
        console.log("Seeded 100 Customer records.");

        // 5. Generate 100 Invoices
        console.log("Generating 100 Invoice records...");
        const invoicesList = [];
        const baseDate = new Date();

        for (let i = 1; i <= 100; i++) {
            // Pick a client name from seeded customers
            const clientName = seededCustomers[(i - 1) % seededCustomers.length].name;
            
            // Random price and quantity
            const price = Math.floor(Math.random() * 450) * 10 + 50; // $50 to $4550 in multiples of 10
            const quantityVal = Math.floor(Math.random() * 5) + 1; // 1 to 5
            const total = price * quantityVal;

            // Dates: random offset in past, expire date 30 days later
            const invoiceDate = new Date(baseDate);
            invoiceDate.setDate(baseDate.getDate() - (100 - i)); // spread dates over the last 100 days
            
            const expireDate = new Date(invoiceDate);
            expireDate.setDate(invoiceDate.getDate() + 30);

            const item = itemNames[(i - 1) % itemNames.length];

            invoicesList.push({
                client: clientName,
                Number: 1000 + i, // sequential unique invoice numbers
                Year: invoiceDate.getFullYear(),
                status: i % 4 === 0 ? "draft" : "final",
                Date: invoiceDate,
                expire_date: expireDate,
                note: `Thank you for choosing our services. Please pay by the due date. Reference ID: INV-${1000 + i}.`,
                items: item,
                description: `Standard provisioning, deployment, and support services for ${item}.`,
                price: price,
                Quentity: String(quantityVal),
                total: total
            });
        }
        await Invoice.insertMany(invoicesList);
        console.log("Seeded 100 Invoice records.");

        console.log("Successfully seeded database with demo data!");

    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        console.log("Closing DB connection...");
        await mongoose.connection.close();
        console.log("Connection closed.");
    }
};

seedDatabase();
