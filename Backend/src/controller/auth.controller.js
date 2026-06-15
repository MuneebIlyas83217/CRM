import Client from "../model/Client.js";
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-12345';

const resend = new Resend(process.env.RESEND_API_KEY);
export const register = async (req, res) => {
    const { name, email, phone, address, password, role } = req.body;

    // 1. Validate input
    if (!name || !email || !phone || !address || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if user already exists
    const existingUser = await Client.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP for email verification
    const OTP = Math.floor(1000 + Math.random() * 9000);

    // 3. Create new user
    const user = await Client.create({
        name,
        email,
        phone,
        address,
        password,
        role: role || 'admin',
        otp: OTP
    });

    // Send verification email
    try {
        const { data, error: emailError } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email, // Send to the user's email
            subject: 'Verify your Email Address',
            html: `<strong>Your OTP for email verification is: ${OTP}</strong>`
        });

        if (emailError) {
            console.error("Resend error:", emailError);
            console.log(`[SANDBOX] Failed to send email to ${email}. Verification OTP is: ${OTP}`);
        }
    } catch (err) {
        console.error("Resend sending threw exception:", err);
        console.log(`[SANDBOX] Threw exception sending email to ${email}. Verification OTP is: ${OTP}`);
    }

    // 4. Generate JWT
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
    );

    // 5. Return response
    res.status(201).json({
        message: "User created successfully. Verification OTP generated.",
        user,
        token
    });
};
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await Client.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: "Login successful", user, token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }



}
export const update = async (req, res) => {

    try {
        const { id, name, email, phone, address } = req.body;

        const user = await Client.findByIdAndUpdate(id, {
            name,
            email,
            phone,
            address
        }, { new: true });

        res.status(200).json({ message: "User updated successfully", user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
export const deleteClient = async (req, res) => {

    try {
        const { id } = req.body;

        const user = await Client.findByIdAndDelete(id);

        res.status(200).json({ message: "User deleted successfully", user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
export const forgetPassword = async (req, res) => {

    try {
        const { email } = req.body;

        const user = await Client.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const OTP = Math.floor(1000 + Math.random() * 9000);
        user.otp = OTP;
        await user.save();

        const { data, error: emailError } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email, // Send to the user's email
            subject: 'Your Password Reset OTP',
            html: `<strong>Your OTP for password reset is: ${OTP}</strong>`
        });

        if (emailError) {
            console.error("Resend error:", emailError);
            return res.status(500).json({ message: "Failed to send OTP email" });
        }

        res.status(200).json({ message: "OTP sent successfully", data });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
export const otpVerification = async (req, res) => {

    try {
        const { email, otp } = req.body;

        const user = await Client.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.otp !== otp) {
            return res.status(401).json({ message: "Invalid OTP" });
        }

        res.status(200).json({ message: "User found successfully", user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
export const resetPassword = async (req, res) => {

    try {
        const { newPassword } = req.body;



        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully", user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const getAllUsers = async (req, res) => {
    try {
        // Exclude passwords from the returned data
        const users = await Client.find({}, '-password');
        res.status(200).json({ message: "Users fetched successfully", users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

