require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

// Import models
const User = require('../models/User');
const Region = require('../models/Region');
const Schedule = require('../models/Schedule');
const Usage = require('../models/Usage');
const Complaint = require('../models/Complaint');

const seedDatabase = async () => {
    try {
        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Region.deleteMany({});
        await Schedule.deleteMany({});
        await Usage.deleteMany({});
        await Complaint.deleteMany({});

        // Create regions
        console.log('Creating regions...');
        const regions = await Region.create([
            {
                name: 'North Region',
                description: 'Northern agricultural zone',
                powerStatus: 'on',
                totalCapacity: 5000,
                currentLoad: 3200
            },
            {
                name: 'South Region',
                description: 'Southern agricultural zone',
                powerStatus: 'on',
                totalCapacity: 4500,
                currentLoad: 2800
            },
            {
                name: 'East Region',
                description: 'Eastern agricultural zone',
                powerStatus: 'off',
                totalCapacity: 3500,
                currentLoad: 1500
            },
            {
                name: 'West Region',
                description: 'Western agricultural zone',
                powerStatus: 'on',
                totalCapacity: 4000,
                currentLoad: 2500
            }
        ]);

        console.log(`Created ${regions.length} regions`);

        // Create admin user
        console.log('Creating admin user...');
        const admin = await User.create({
            name: 'Sharook',
            email: 'sharook@agripower.com',
            password: 'admin123',
            role: 'admin',
            phone: '+91-9876543210',
            address: 'AgriPower Head Office'
        });

        console.log('Admin created:', admin.email);

        // Create farmers
        console.log('Creating farmers...');
        const farmers = await User.create([
            {
                name: 'Ahmad Khan',
                email: 'ahmad@example.com',
                password: 'farmer123',
                role: 'farmer',
                region: regions[0]._id,
                phone: '+91-9876543211',
                address: 'Village Rampur, North Region'
            },
            {
                name: 'Bilal Sheikh',
                email: 'bilal@example.com',
                password: 'farmer123',
                role: 'farmer',
                region: regions[0]._id,
                phone: '+91-9876543212',
                address: 'Village Kampur, North Region'
            },
            {
                name: 'Faizan Ali',
                email: 'faizan@example.com',
                password: 'farmer123',
                role: 'farmer',
                region: regions[1]._id,
                phone: '+91-9876543213',
                address: 'Village Sitapur, South Region'
            },
            {
                name: 'Imran Qureshi',
                email: 'imran@example.com',
                password: 'farmer123',
                role: 'farmer',
                region: regions[1]._id,
                phone: '+91-9876543214',
                address: 'Village Ramgarh, South Region'
            },
            {
                name: 'Junaid Mir',
                email: 'junaid@example.com',
                password: 'farmer123',
                role: 'farmer',
                region: regions[2]._id,
                phone: '+91-9876543215',
                address: 'Village Patna, East Region'
            },
            {
                name: 'Kashif Ansari',
                email: 'kashif@example.com',
                password: 'farmer123',
                role: 'farmer',
                region: regions[3]._id,
                phone: '+91-9876543216',
                address: 'Village Jaipur, West Region'
            }
        ]);

        console.log(`Created ${farmers.length} farmers`);

        // Create schedules
        console.log('Creating schedules...');
        const schedules = await Schedule.create([
            // Region-wise schedules
            {
                type: 'region-wise',
                region: regions[0]._id,
                startTime: '06:00',
                endTime: '18:00',
                daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                powerStatus: 'on',
                ratePerUnit: 5.5,
                description: 'Daytime power supply for North Region'
            },
            {
                type: 'region-wise',
                region: regions[1]._id,
                startTime: '05:00',
                endTime: '20:00',
                daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                powerStatus: 'on',
                ratePerUnit: 5.0,
                description: 'Extended power supply for South Region'
            },
            {
                type: 'region-wise',
                region: regions[2]._id,
                startTime: '08:00',
                endTime: '16:00',
                daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
                powerStatus: 'on',
                ratePerUnit: 6.0,
                description: 'Alternate day power supply for East Region'
            },
            // Customer-specific schedules
            {
                type: 'customer-specific',
                customer: farmers[0]._id,
                startTime: '04:00',
                endTime: '08:00',
                daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                powerStatus: 'on',
                ratePerUnit: 4.5,
                description: 'Early morning irrigation schedule'
            },
            {
                type: 'customer-specific',
                customer: farmers[2]._id,
                startTime: '18:00',
                endTime: '22:00',
                daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                powerStatus: 'on',
                ratePerUnit: 7.0,
                description: 'Evening power supply for processing'
            }
        ]);

        console.log(`Created ${schedules.length} schedules`);

        // Create usage records
        console.log('Creating usage records...');
        const currentYear = new Date().getFullYear();
        const usageRecords = [];

        for (let i = 0; i < farmers.length; i++) {
            for (let month = 1; month <= 12; month++) {
                const unitsConsumed = Math.floor(Math.random() * 500) + 200;
                const ratePerUnit = 5.0 + Math.random() * 2;

                usageRecords.push({
                    customer: farmers[i]._id,
                    region: farmers[i].region,
                    month,
                    year: currentYear,
                    unitsConsumed,
                    ratePerUnit: parseFloat(ratePerUnit.toFixed(2)),
                    isPaid: month < new Date().getMonth() + 1
                });
            }
        }

        await Usage.create(usageRecords);
        console.log(`Created ${usageRecords.length} usage records`);

        // Create complaints
        console.log('Creating complaints...');
        const complaints = await Complaint.create([
            {
                customer: farmers[0]._id,
                subject: 'Power outage in my area',
                description: 'There has been no power supply for the last 3 hours in our village.',
                status: 'pending',
                priority: 'high'
            },
            {
                customer: farmers[1]._id,
                subject: 'Billing discrepancy',
                description: 'My bill shows higher units than actual consumption.',
                status: 'in-progress',
                priority: 'medium'
            },
            {
                customer: farmers[2]._id,
                subject: 'Request for schedule change',
                description: 'I need power supply in the morning instead of evening.',
                status: 'resolved',
                priority: 'low',
                resolvedBy: admin._id,
                resolvedAt: new Date(),
                adminNotes: 'Schedule updated as requested'
            },
            {
                customer: farmers[3]._id,
                subject: 'Voltage fluctuation',
                description: 'Experiencing frequent voltage fluctuations damaging equipment.',
                status: 'pending',
                priority: 'high'
            },
            {
                customer: farmers[4]._id,
                subject: 'New connection request',
                description: 'Need additional connection for new irrigation pump.',
                status: 'in-progress',
                priority: 'medium'
            }
        ]);

        console.log(`Created ${complaints.length} complaints`);

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('Admin:');
        console.log('  Email: sharook@agripower.com');
        console.log('  Password: admin123');
        console.log('\nFarmers:');
        console.log('  Email: ahmad@example.com, bilal@example.com, faizan@example.com, imran@example.com, junaid@example.com, kashif@example.com');
        console.log('  Password: farmer123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
