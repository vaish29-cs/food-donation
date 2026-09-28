import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const JWT_SECRET = process.env.JWT_SECRET || 'foodshare-secret-2026'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminSpecialPass123'
const REMOVED_FOOD_GRACE_MINUTES = Math.max(1, Number(process.env.REMOVED_FOOD_GRACE_MINUTES || 5))

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json())

const dbName = process.env.DB_NAME || 'foodshare_db'
let pool

async function ensureColumn(conn, tableName, columnName, definition) {
  const [columns] = await conn.query(`
    SELECT COUNT(*) AS count
    FROM information_schema.columns
    WHERE table_schema = ? AND table_name = ? AND column_name = ?
  `, [dbName, tableName, columnName])
  if (columns[0].count === 0) {
    await conn.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`)
  }
}

async function ensureIndex(conn, tableName, indexName, columns) {
  const [indexes] = await conn.query(`
    SELECT COUNT(*) AS count
    FROM information_schema.statistics
    WHERE table_schema = ? AND table_name = ? AND index_name = ?
  `, [dbName, tableName, indexName])
  if (indexes[0].count === 0) {
    await conn.query(`CREATE INDEX ${indexName} ON ${tableName} (${columns})`)
  }
}

async function initDatabase() {
  const initConnection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  })

  try {
    await initConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``)
  } finally {
    await initConnection.end()
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })

  const conn = await pool.getConnection()
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        email VARCHAR(191) NOT NULL UNIQUE,
        phone VARCHAR(50) NOT NULL,
        password VARCHAR(191) NOT NULL,
        userType ENUM('donor','recipient','both','admin') NOT NULL DEFAULT 'recipient',
        deletedAt DATETIME NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `)
    await ensureColumn(conn, 'users', 'deletedAt', 'DATETIME NULL')
    await conn.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donorId INT NULL,
        donorName VARCHAR(191) NOT NULL,
        donorEmail VARCHAR(191) NOT NULL,
        donorPhone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        foodName VARCHAR(191) NOT NULL,
        foodCategory VARCHAR(100),
        foodQuantity VARCHAR(100) NOT NULL,
        expiryTime DATETIME NOT NULL,
        description TEXT,
        image VARCHAR(255),
        foodItems JSON NULL,
        removedAt DATETIME NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `)
    await ensureColumn(conn, 'donations', 'donorId', 'INT NULL')
    await ensureColumn(conn, 'donations', 'foodItems', 'JSON NULL')
    await ensureColumn(conn, 'donations', 'removedAt', 'DATETIME NULL')
    await conn.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donationId INT NULL,
        donorId INT NULL,
        receiverId INT NULL,
        donorEmail VARCHAR(191) NOT NULL,
        donorName VARCHAR(191) NOT NULL,
        receiverEmail VARCHAR(191) NOT NULL,
        receiverName VARCHAR(191) NOT NULL,
        foodName VARCHAR(191),
        foodQuantity VARCHAR(100),
        message TEXT,
        pickupLocation TEXT,
        status ENUM('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
        requestDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `)
    await ensureColumn(conn, 'requests', 'donationId', 'INT NULL')
    await ensureColumn(conn, 'requests', 'donorId', 'INT NULL')
    await ensureColumn(conn, 'requests', 'receiverId', 'INT NULL')
    await ensureColumn(conn, 'requests', 'requiredQuantity', 'VARCHAR(100) NULL')
    await ensureColumn(conn, 'requests', 'numberOfPeople', 'INT NULL')
    await ensureColumn(conn, 'requests', 'purpose', 'VARCHAR(191) NULL')
    await ensureColumn(conn, 'requests', 'preferredPickupDate', 'DATE NULL')
    await conn.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        email VARCHAR(191) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('Unread','Read') NOT NULL DEFAULT 'Unread',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `)
    await ensureIndex(conn, 'donations', 'idx_donations_donor_id', 'donorId')
    await ensureIndex(conn, 'donations', 'idx_donations_expiry_removed', 'expiryTime, removedAt')
    await ensureIndex(conn, 'requests', 'idx_requests_donation_id', 'donationId')
    await ensureIndex(conn, 'requests', 'idx_requests_donor_id', 'donorId')
    await ensureIndex(conn, 'requests', 'idx_requests_receiver_id', 'receiverId')
    await ensureIndex(conn, 'requests', 'idx_requests_status', 'status')
  } finally {
    conn.release()
  }
}

function createJwt(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, phone: user.phone || '', userType: user.userType },
    JWT_SECRET,
    { expiresIn: '4h' }
  )
}

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) {
    return res.status(401).json({ message: 'Missing authentication token' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password, userType } = req.body
  if (!name || !email || !phone || !password || !userType) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const conn = await pool.getConnection()
  try {
    const [existing] = await conn.query('SELECT id FROM users WHERE email = ? AND deletedAt IS NULL', [email])
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const [result] = await conn.query(
      'INSERT INTO users (name, email, phone, password, userType) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, userType]
    )

    const user = { id: result.insertId, name, email, phone, userType }
    const token = createJwt(user)
    return res.status(201).json({ user, token })
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed' })
  } finally {
    conn.release()
  }
})

app.post('/api/auth/admin-register', async (req, res) => {
  const { name, email, phone, password } = req.body
  if (!name || !email || !phone || password !== ADMIN_PASSWORD) {
    return res.status(400).json({ message: 'Use the administrator password to create an admin account' })
  }
  const conn = await pool.getConnection()
  try {
    const [existing] = await conn.query('SELECT id FROM users WHERE email = ? AND deletedAt IS NULL', [email])
    if (existing.length > 0) return res.status(409).json({ message: 'Email already registered' })
    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await conn.query(
      'INSERT INTO users (name, email, phone, password, userType) VALUES (?, ?, ?, ?, \'admin\')',
      [name, email, phone, hashedPassword]
    )
    const user = { id: result.insertId, name, email, phone, userType: 'admin' }
    return res.status(201).json({ user, token: createJwt(user) })
  } catch (error) {
    return res.status(500).json({ message: 'Admin registration failed' })
  } finally {
    conn.release()
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password, userType } = req.body
  if (!email || !password || !userType) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const conn = await pool.getConnection()
  try {
    const allowedTypes = userType === 'donor' || userType === 'recipient' ? [userType, 'both'] : [userType]
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ? AND userType IN (?) AND deletedAt IS NULL', [email, allowedTypes])
    const user = rows[0]
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType
    }
    const token = createJwt(payload)
    return res.json({ user: payload, token })
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' })
  } finally {
    conn.release()
  }
})

app.post('/api/contact-messages', async (req, res) => {
  const { name, email, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' })
  }
  const conn = await pool.getConnection()
  try {
    await conn.query('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)', [name, email, message])
    return res.status(201).json({ message: 'Message sent' })
  } catch (error) {
    return res.status(500).json({ message: 'Could not save contact message' })
  } finally {
    conn.release()
  }
})

app.post('/api/donations', authMiddleware, async (req, res) => {
  const { address, foodItems, expiryTime, description, image } = req.body
  if (!address || !Array.isArray(foodItems) || foodItems.length === 0 || !expiryTime) {
    return res.status(400).json({ message: 'Missing donation fields' })
  }
  const expiryDate = new Date(expiryTime)
  if (Number.isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
    return res.status(400).json({ message: 'Expiry date and time must be in the future' })
  }
  const validFoodItems = foodItems.every((item) => item.name && item.category && item.quantity)
  if (!validFoodItems) {
    return res.status(400).json({ message: 'Each food item needs a name, category, and quantity' })
  }
  const firstItem = foodItems[0]

  const conn = await pool.getConnection()
  try {
    await conn.query(
      `INSERT INTO donations (donorId, donorName, donorEmail, donorPhone, address, foodName, foodCategory, foodQuantity, expiryTime, description, image, foodItems)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.email, req.user.phone || '', address, firstItem.name, firstItem.category, firstItem.quantity, expiryTime, description || '', image || '', JSON.stringify(foodItems)]
    )
    return res.status(201).json({ message: 'Donation created' })
  } catch (error) {
    return res.status(500).json({ message: 'Could not create donation' })
  } finally {
    conn.release()
  }
})

app.get('/api/donations', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(`
      SELECT *, CASE WHEN removedAt IS NULL THEN 'Available' ELSE 'Removed' END AS availabilityStatus
      FROM donations
      WHERE expiryTime > NOW()
        AND (removedAt IS NULL OR removedAt > DATE_SUB(NOW(), INTERVAL ${REMOVED_FOOD_GRACE_MINUTES} MINUTE))
      ORDER BY createdAt DESC
    `)
    return res.json(rows)
  } catch (error) {
    return res.status(500).json({ message: 'Could not load available food' })
  } finally {
    conn.release()
  }
})

app.get('/api/donations/mine', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query('SELECT * FROM donations WHERE donorId = ? OR (donorId IS NULL AND donorEmail = ?) ORDER BY createdAt DESC', [req.user.id, req.user.email])
    return res.json(rows)
  } catch (error) {
    return res.status(500).json({ message: 'Could not load your donations' })
  } finally {
    conn.release()
  }
})

app.get('/api/requests', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const requestedView = req.query.view
    const donorView = requestedView === 'donor' || (!requestedView && req.user.userType === 'donor')
    const query = donorView
      ? 'SELECT * FROM requests WHERE donorId = ? OR (donorId IS NULL AND donorEmail = ?) ORDER BY requestDate DESC'
      : 'SELECT * FROM requests WHERE receiverId = ? OR (receiverId IS NULL AND receiverEmail = ?) ORDER BY requestDate DESC'
    const [rows] = await conn.query(query, [req.user.id, req.user.email])
    return res.json(rows)
  } catch (error) {
    return res.status(500).json({ message: 'Could not load requests' })
  } finally {
    conn.release()
  }
})

app.post('/api/requests', authMiddleware, async (req, res) => {
  const { donationId, foodName, foodQuantity, requiredQuantity, numberOfPeople, purpose, preferredPickupDate, message, pickupLocation } = req.body
  if (!donationId || !foodName || !requiredQuantity || !purpose || !preferredPickupDate || !pickupLocation || !Number.isInteger(Number(numberOfPeople)) || Number(numberOfPeople) < 1) {
    return res.status(400).json({ message: 'Missing request fields' })
  }

  const conn = await pool.getConnection()
  try {
    const [donations] = await conn.query('SELECT id, donorId, donorEmail, donorName, removedAt, expiryTime FROM donations WHERE id = ?', [donationId])
    if (!donations[0] || donations[0].removedAt || new Date(donations[0].expiryTime) <= new Date()) {
      return res.status(409).json({ message: 'This food is no longer available' })
    }
    const donation = donations[0]
    await conn.query(
      `INSERT INTO requests (donationId, donorId, receiverId, donorEmail, donorName, receiverEmail, receiverName, foodName, foodQuantity, requiredQuantity, numberOfPeople, purpose, preferredPickupDate, message, pickupLocation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [donationId, donation.donorId, req.user.id, donation.donorEmail, donation.donorName, req.user.email, req.user.name, foodName, foodQuantity || '', requiredQuantity, Number(numberOfPeople), purpose, preferredPickupDate, message || '', pickupLocation]
    )
    return res.status(201).json({ message: 'Request sent' })
  } catch (error) {
    return res.status(500).json({ message: 'Could not save request' })
  } finally {
    conn.release()
  }
})

app.patch('/api/requests/:id', authMiddleware, async (req, res) => {
  const { status } = req.body
  const allowedStatuses = ['Accepted', 'Rejected']
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid request status' })
  }

  const conn = await pool.getConnection()
  try {
    const [result] = await conn.query(
      'UPDATE requests SET status = ? WHERE id = ? AND (donorId = ? OR (donorId IS NULL AND donorEmail = ?))',
      [status, req.params.id, req.user.id, req.user.email]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Request not found' })
    }
    if (status === 'Accepted') {
      await conn.query(
        'UPDATE donations d JOIN requests r ON r.donationId = d.id SET d.removedAt = NOW() WHERE r.id = ?',
        [req.params.id]
      )
    }
    return res.json({ message: `Request ${status.toLowerCase()}` })
  } catch (error) {
    return res.status(500).json({ message: 'Could not update request status' })
  } finally {
    conn.release()
  }
})

// Admin routes - require admin userType
async function adminOnly(req, res, next) {
  if (!req.user || req.user.userType !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - admin only' })
  }
  next()
}

app.get('/api/admin/users', authMiddleware, adminOnly, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query('SELECT id, name, email, phone, userType, createdAt FROM users WHERE deletedAt IS NULL ORDER BY createdAt DESC')
    return res.json(rows)
  } catch (error) {
    return res.status(500).json({ message: 'Could not load users' })
  } finally {
    conn.release()
  }
})

app.get('/api/admin/messages', authMiddleware, adminOnly, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query('SELECT * FROM contact_messages ORDER BY createdAt DESC')
    return res.json(rows)
  } catch (error) {
    return res.status(500).json({ message: 'Could not load contact messages' })
  } finally {
    conn.release()
  }
})

app.get('/api/admin/users/:id', authMiddleware, adminOnly, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const [users] = await conn.query('SELECT id, name, email, phone, userType, createdAt FROM users WHERE id = ? AND deletedAt IS NULL', [req.params.id])
    if (!users[0]) return res.status(404).json({ message: 'User not found' })
    const [donations] = await conn.query('SELECT * FROM donations WHERE donorEmail = ? ORDER BY createdAt DESC', [users[0].email])
    const [received] = await conn.query('SELECT * FROM requests WHERE receiverEmail = ? ORDER BY requestDate DESC', [users[0].email])
    const [sent] = await conn.query('SELECT * FROM requests WHERE donorEmail = ? ORDER BY requestDate DESC', [users[0].email])
    return res.json({ user: users[0], donations, received, sent })
  } catch (error) {
    return res.status(500).json({ message: 'Could not load user details' })
  } finally {
    conn.release()
  }
})

app.patch('/api/admin/users/:id/remove', authMiddleware, adminOnly, async (req, res) => {
  if (String(req.user.id) === String(req.params.id)) {
    return res.status(400).json({ message: 'You cannot remove your own admin account' })
  }
  const conn = await pool.getConnection()
  try {
    await conn.query('UPDATE users SET deletedAt = NOW() WHERE id = ? AND deletedAt IS NULL', [req.params.id])
    return res.json({ message: 'User removed' })
  } catch (error) {
    return res.status(500).json({ message: 'Could not remove user' })
  } finally {
    conn.release()
  }
})

app.patch('/api/admin/users/:id', authMiddleware, adminOnly, async (req, res) => {
  const userId = req.params.id
  const { userType } = req.body
  const allowed = ['donor', 'recipient', 'both', 'admin']
  if (!allowed.includes(userType)) {
    return res.status(400).json({ message: 'Invalid userType' })
  }
  const conn = await pool.getConnection()
  try {
    await conn.query('UPDATE users SET userType = ? WHERE id = ?', [userType, userId])
    return res.json({ message: 'User updated' })
  } catch (error) {
    return res.status(500).json({ message: 'Could not update user' })
  } finally {
    conn.release()
  }
})

app.delete('/api/admin/users/:id', authMiddleware, adminOnly, async (req, res) => {
  const userId = req.params.id
  if (String(req.user.id) === String(userId)) {
    return res.status(400).json({ message: 'You cannot permanently delete your own admin account' })
  }
  const conn = await pool.getConnection()
  try {
    await conn.query('DELETE FROM users WHERE id = ?', [userId])
    return res.json({ message: 'User deleted' })
  } catch (error) {
    return res.status(500).json({ message: 'Could not delete user' })
  } finally {
    conn.release()
  }
})

app.listen(PORT, async () => {
  try {
    await initDatabase()
    console.log(`MySQL-backed API listening on http://localhost:${PORT}`)
  } catch (error) {
    console.error('Unable to initialize database', error)
    process.exit(1)
  }
})
