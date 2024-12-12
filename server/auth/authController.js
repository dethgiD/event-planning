const { createUser, findUserByEmail, validatePassword, generateToken, renewAccessToken, generateRefreshToken } = require('./authService');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await findUserByEmail(email);
        if (userExists) return res.status(400).json({ error: "User already exists" });

        const user = await createUser({ name, email, password, role: "USER" });
        res.status(201).json({ message: "User registered successfully", user: { id: user.id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "Failed to register user" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isPasswordValid = await validatePassword(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        res.json({ message: "Login successful", token, refreshToken });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Login failed" });
    }
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body; // Expecting refreshToken in the request body

    if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token is required" });
    }

    try {
        const newAccessToken = await renewAccessToken(refreshToken);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
};

module.exports = { register, login, refreshToken };
