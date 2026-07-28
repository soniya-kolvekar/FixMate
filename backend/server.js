import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Data / Mock Database Storage
const servicesCatalog = [
  { id: 'plumbing', name: 'Plumbing', price: 49, icon: '🔧', desc: 'Pipe repair, leak fixing, tap installation' },
  { id: 'electrical', name: 'Electrical', price: 59, icon: '⚡', desc: 'Wiring, circuit breaker, lighting fixtures' },
  { id: 'ac_service', name: 'AC Service', price: 69, icon: '❄️', desc: 'Air conditioning cleaning & duct maintenance' },
  { id: 'carpentry', name: 'Carpentry', price: 79, icon: '🔨', desc: 'Furniture assembly & custom woodwork' },
  { id: 'painting', name: 'Painting', price: 149, icon: '🎨', desc: 'Interior & exterior home painting' },
  { id: 'cleaning', name: 'Cleaning', price: 89, icon: '🧹', desc: 'Deep sanitation & carpet cleaning' },
  { id: 'appliances', name: 'Appliances', price: 59, icon: '⚙️', desc: 'Refrigerator, oven & washer repairs' },
  { id: 'pest_control', name: 'Pest Control', price: 99, icon: '🛡️', desc: 'Eco-friendly pest inspection & removal' }
];

const mockBookings = [];
const mockEmergencies = [];

const portalDashboards = {
  customer: {
    title: 'Customer Dashboard',
    role: 'Customer',
    activeBooking: { id: 'FM-9841', service: 'Plumbing Repair', status: 'Technician En Route', eta: '14 mins' },
    history: [
      { id: 'FM-7712', service: 'AC Maintenance', date: '2026-06-15', cost: '$69.00', status: 'Completed' },
      { id: 'FM-6029', service: 'Electrical Fix', date: '2026-05-02', cost: '$59.00', status: 'Completed' }
    ]
  },
  technician: {
    title: 'Technician Job Hub',
    role: 'Technician',
    technicianName: 'Alex Vance (Master Plumber)',
    assignedJobs: [
      { id: 'JOB-301', customer: 'Sarah Jenkins', service: 'Sink Overflow Repair', address: '742 Evergreen Terr.', time: '10:30 AM', price: '$120.00' },
      { id: 'JOB-302', customer: 'David Kim', service: 'Water Heater Check', address: '104 Maple Ave.', time: '02:00 PM', price: '$95.00' }
    ]
  },
  dispatcher: {
    title: 'Dispatcher Routing Center',
    role: 'Dispatcher',
    metrics: { activeTechnicians: 18, pendingDispatches: 2, avgResponseMinutes: 16 },
    routes: [
      { zone: 'North Metro', techCount: 6, status: 'Optimal' },
      { zone: 'Downtown Sector', techCount: 8, status: 'High Demand' },
      { zone: 'South Suburbs', techCount: 4, status: 'Normal' }
    ]
  },
  admin: {
    title: 'Admin Command Center',
    role: 'Admin',
    analytics: { totalUsers: 14250, completedJobs: 15480, satisfactionRate: '98.6%', monthlyRevenue: '$210,400' },
    pendingApprovals: 4
  }
};

// API Endpoints

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FixMate Node.js Express Backend', timestamp: new Date().toISOString() });
});

// Services Catalog
app.get('/api/services', (req, res) => {
  res.json({ success: true, data: servicesCatalog });
});

// Create Booking
app.post('/api/bookings', (req, res) => {
  const { serviceId, address, dateTime, customerEmail } = req.body;
  if (!serviceId || !address) {
    return res.status(400).json({ success: false, error: 'Service ID and Address are required' });
  }

  const newBooking = {
    id: `FM-${Math.floor(1000 + Math.random() * 9000)}`,
    serviceId,
    address,
    dateTime: dateTime || new Date().toISOString(),
    customerEmail: customerEmail || 'guest@fixmate.io',
    createdAt: new Date().toISOString(),
    status: 'Confirmed'
  };

  mockBookings.push(newBooking);
  res.json({ success: true, message: 'Booking created successfully', booking: newBooking });
});

// Emergency Dispatch Request
app.post('/api/emergency', (req, res) => {
  const { emergencyType, phone, address } = req.body;
  if (!emergencyType || !phone || !address) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  const emergencyAlert = {
    id: `EMG-${Math.floor(100 + Math.random() * 900)}`,
    emergencyType,
    phone,
    address,
    etaMinutes: Math.floor(15 + Math.random() * 20),
    assignedTechnician: 'Officer Mark Davies (Emergency Crew #4)',
    timestamp: new Date().toISOString()
  };

  mockEmergencies.push(emergencyAlert);
  res.json({ success: true, message: 'Emergency team dispatched!', dispatch: emergencyAlert });
});

// Portal Data Endpoint
app.get('/api/portals/:role', (req, res) => {
  const role = req.params.role.toLowerCase();
  const data = portalDashboards[role];
  if (!data) {
    return res.status(404).json({ success: false, error: 'Invalid portal role' });
  }
  res.json({ success: true, portal: data });
});

app.listen(PORT, () => {
  console.log(`🚀 FixMate Node.js Backend running on http://localhost:${PORT}`);
});
