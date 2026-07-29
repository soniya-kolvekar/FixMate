import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Data / Mock Database Storage (Tailored to India)
const servicesCatalog = [
  { id: 'plumbing', name: 'Plumbing', price: 399, desc: 'Pipe repair, leak fixing, tap installation' },
  { id: 'electrical', name: 'Electrical', price: 499, desc: 'Wiring, circuit breaker, lighting fixtures' },
  { id: 'ac_service', name: 'AC Service', price: 699, desc: 'Air conditioning cleaning & gas maintenance' },
  { id: 'carpentry', name: 'Carpentry', price: 599, desc: 'Furniture assembly & custom woodwork' },
  { id: 'painting', name: 'Painting', price: 1499, desc: 'Interior & exterior home painting' },
  { id: 'cleaning', name: 'Cleaning', price: 899, desc: 'Deep sanitation & carpet cleaning' },
  { id: 'appliances', name: 'Appliances', price: 499, desc: 'Refrigerator, microwave & washer repairs' },
  { id: 'pest_control', name: 'Pest Control', price: 999, desc: 'Eco-friendly pest inspection & removal' }
];

const mockBookings = [];
const mockEmergencies = [];
const mockDispatches = [
  { 
    id: 'DISP-4820', 
    title: 'Main Pipe Burst & Floor Flooding', 
    time: '4 mins ago', 
    address: '104 Indiranagar 10th Main, Bengaluru', 
    priority: 'Priority Level 10', 
    category: 'PLUMBING', 
    type: 'RESIDENTIAL', 
    icon: '💧', 
    colorClass: 'bg-rose-50 border-rose-100 hover:border-rose-300', 
    iconBg: 'bg-rose-100 text-rose-600',
    recommendedTech: 'Rajesh Kumar',
    techSpecialty: 'Plumbing',
    distance: '1.2 km away',
    price: '1499.00',
    customerName: 'Priya Sharma',
    targetDispatcher: 'dispatcher@fixmate.com'
  }
];

const portalDashboards = {
  customer: {
    title: 'Customer Dashboard',
    role: 'Customer',
    activeBooking: { id: 'FM-9841', service: 'Plumbing Repair', status: 'Technician En Route', eta: '14 mins' },
    history: [
      { id: 'FM-7712', service: 'AC Maintenance', date: '2026-06-15', cost: '₹699.00', status: 'Completed' },
      { id: 'FM-6029', service: 'Electrical Fix', date: '2026-05-02', cost: '₹499.00', status: 'Completed' }
    ]
  },
  technician: {
    title: 'Technician Job Hub',
    role: 'Technician',
    technicianName: 'Rajesh Kumar (Master Plumber)',
    assignedJobs: [
      { id: 'JOB-301', customer: 'Priya Sharma', service: 'Sink Overflow Repair', address: '104 Indiranagar 10th Main, Bengaluru', time: '10:30 AM', price: '₹499.00' },
      { id: 'JOB-302', customer: 'Aarav Mehta', service: 'Geyser Pressure Check', address: '742 Bandra West, Mumbai', time: '02:00 PM', price: '₹699.00' }
    ]
  },
  dispatcher: {
    title: 'Dispatcher Routing Center',
    role: 'Dispatcher',
    metrics: { activeTechnicians: 18, pendingDispatches: 2, avgResponseMinutes: 16 },
    dispatcherEmail: 'dispatcher@fixmate.com',
    routes: [
      { zone: 'Indiranagar & HSR, Bengaluru', techCount: 6, status: 'Optimal' },
      { zone: 'Bandra & Juhu, Mumbai', techCount: 8, status: 'High Demand' },
      { zone: 'Connaught Place, Delhi', techCount: 4, status: 'Normal' }
    ]
  },
  admin: {
    title: 'Admin Command Center',
    role: 'Admin',
    analytics: { totalUsers: 14250, completedJobs: 15480, satisfactionRate: '98.6%', monthlyRevenue: '₹21,04,000' },
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

// Dispatches API (Get dispatches / delay & cancellation broadcasts)
app.get('/api/dispatches', (req, res) => {
  res.json({ success: true, data: mockDispatches });
});

// Create new urgent dispatch / delay / mid-cancellation alert
app.post('/api/dispatches', (req, res) => {
  const item = req.body;
  if (!item || !item.id) {
    return res.status(400).json({ success: false, error: 'Invalid dispatch payload' });
  }

  // Assign target dispatcher if missing
  if (!item.targetDispatcher) {
    item.targetDispatcher = 'dispatcher@fixmate.com';
  }

  // Push to top of list
  const existsIndex = mockDispatches.findIndex(d => d.id === item.id);
  if (existsIndex !== -1) {
    mockDispatches[existsIndex] = { ...mockDispatches[existsIndex], ...item };
  } else {
    mockDispatches.unshift(item);
  }

  res.json({ success: true, message: 'Urgent dispatch alert recorded', data: item });
});

// Delete / Resolve dispatch
app.delete('/api/dispatches/:id', (req, res) => {
  const id = req.params.id;
  const index = mockDispatches.findIndex(d => d.id === id);
  if (index !== -1) {
    mockDispatches.splice(index, 1);
  }
  res.json({ success: true, message: 'Dispatch resolved / removed' });
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
    customerEmail: customerEmail || 'guest@fixmate.in',
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
    assignedTechnician: 'Officer Rajesh Kumar (Emergency Unit #4)',
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
  console.log(`FixMate Node.js Backend running on http://localhost:${PORT}`);
});
