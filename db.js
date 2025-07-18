// Passion Hills Table Tennis Club Database
// All data stored as JavaScript arrays and objects

const TTClubDatabase = {
    // Club Members
    members: [
        {
            id: 1,
            name: 'PRAVEEN',
            villaNo: '16',
            status: 'FOUNDING MEMBER',
            membershipFee: 3000,
            annualFee2023: 500,
            annualFee2024: 500,
            annualFee2025: 0,
            totalPaid: 4000,
            joinDate: '2023-01-01',
            isActive: true
        },
        {
            id: 2,
            name: 'JOSEPH',
            villaNo: '20',
            status: 'FOUNDING MEMBER',
            membershipFee: 3000,
            annualFee2023: 500,
            annualFee2024: 500,
            annualFee2025: 0,
            totalPaid: 4000,
            joinDate: '2023-01-01',
            isActive: true
        },
        {
            id: 3,
            name: 'JOSEPH MARCUS (BENNY)',
            villaNo: '22',
            status: 'FOUNDING MEMBER',
            membershipFee: 3000,
            annualFee2023: 500,
            annualFee2024: 500,
            annualFee2025: 0,
            totalPaid: 4000,
            joinDate: '2023-01-01',
            isActive: true
        },
        {
            id: 4,
            name: 'JAIMON/ZACHAIRAH',
            villaNo: '11/6',
            status: 'FOUNDING MEMBER (Inactive)',
            membershipFee: 3000,
            annualFee2023: 0,
            annualFee2024: 0,
            annualFee2025: 0,
            totalPaid: 3000,
            joinDate: '2023-01-01',
            isActive: false
        },
        {
            id: 5,
            name: 'BINU',
            villaNo: '23',
            status: 'FOUNDING MEMBER',
            membershipFee: 3000,
            annualFee2023: 500,
            annualFee2024: 500,
            annualFee2025: 500,
            totalPaid: 4500,
            joinDate: '2023-01-01',
            isActive: true
        },
        {
            id: 6,
            name: 'RENITH',
            villaNo: '25',
            status: 'FOUNDING MEMBER',
            membershipFee: 3000,
            annualFee2023: 500,
            annualFee2024: 500,
            annualFee2025: 500,
            totalPaid: 4500,
            joinDate: '2023-01-01',
            isActive: true
        },
        {
            id: 7,
            name: 'AJITH',
            villaNo: '27',
            status: 'FOUNDING MEMBER',
            membershipFee: 3000,
            annualFee2023: 500,
            annualFee2024: 500,
            annualFee2025: 0,
            totalPaid: 4000,
            joinDate: '2023-01-01',
            isActive: true
        },
        {
            id: 8,
            name: 'JACOB',
            villaNo: '04',
            status: 'FOUNDING MEMBER (Inactive)',
            membershipFee: 3000,
            annualFee2023: 0,
            annualFee2024: 0,
            annualFee2025: 0,
            totalPaid: 3000,
            joinDate: '2023-01-01',
            isActive: false
        },
        {
            id: 9,
            name: 'VARUN',
            villaNo: '26',
            status: 'NEW MEMBER',
            membershipFee: 3000,
            annualFee2023: 500,
            annualFee2024: 500,
            annualFee2025: 500,
            totalPaid: 4500,
            joinDate: '2023-06-01',
            isActive: true
        },
        {
            id: 10,
            name: 'MATHEWS',
            villaNo: '05',
            status: 'NEW MEMBER',
            membershipFee: 3000,
            annualFee2023: 0,
            annualFee2024: 500,
            annualFee2025: 500,
            totalPaid: 4000,
            joinDate: '2023-08-01',
            isActive: true
        },
        {
            id: 11,
            name: 'JAISON',
            villaNo: '02',
            status: 'NEW MEMBER',
            membershipFee: 3000,
            annualFee2023: 0,
            annualFee2024: 500,
            annualFee2025: 500,
            totalPaid: 4000,
            joinDate: '2023-09-01',
            isActive: true
        },
        {
            id: 12,
            name: 'ANSON',
            villaNo: '02',
            status: 'NEW MEMBER',
            membershipFee: 3000,
            annualFee2023: 0,
            annualFee2024: 500,
            annualFee2025: 500,
            totalPaid: 4000,
            joinDate: '2023-10-01',
            isActive: true
        },
        {
            id: 13,
            name: 'ALEX',
            villaNo: '10',
            status: 'APPROVED FOR MEMBERSHIP',
            membershipFee: 0,
            annualFee2023: 0,
            annualFee2024: 0,
            annualFee2025: 500,
            totalPaid: 500,
            joinDate: '2024-01-01',
            isActive: true,
            pendingAmount: 3000
        },
        {
            id: 14,
            name: 'JOHN',
            villaNo: '10',
            status: 'APPROVED FOR MEMBERSHIP',
            membershipFee: 0,
            annualFee2023: 0,
            annualFee2024: 0,
            annualFee2025: 500,
            totalPaid: 500,
            joinDate: '2024-01-01',
            isActive: true,
            pendingAmount: 3000
        }
    ],

    // Transactions (cleared as requested)
    transactions: [],

    // Invoices
    invoices: [],

    // Expenses
    expenses: [],

    // Individual and External Contributions
    contributions: [],

    // Pending Fees (manually added)
    pendingFees: [],

    // Activity Log
    activities: [
        {
            id: Date.now(),
            type: 'System',
            description: 'Database initialized with member data',
            timestamp: new Date().toISOString()
        }
    ],

    // Fee Years Configuration
    feeYears: [
        {
            year: 2023,
            amount: 500,
            description: 'Annual Fee 2023',
            isActive: true
        },
        {
            year: 2024,
            amount: 500,
            description: 'Annual Fee 2024',
            isActive: true
        },
        {
            year: 2025,
            amount: 500,
            description: 'Annual Fee 2025',
            isActive: true
        }
    ],

    // User Management System
    users: [
        {
            id: 1,
            username: 'varun',
            name: 'Varun',
            role: 'super_admin',
            email: 'varun@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 2,
            username: 'praveen',
            name: 'Praveen',
            role: 'admin',
            email: 'praveen@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 3,
            username: 'binu',
            name: 'Binu',
            role: 'admin',
            email: 'binu@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 4,
            username: 'joseph',
            name: 'Joseph',
            role: 'user',
            email: 'joseph@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 5,
            username: 'benny',
            name: 'Benny',
            role: 'user',
            email: 'benny@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 6,
            username: 'jaimon',
            name: 'Jaimon',
            role: 'user',
            email: 'jaimon@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 7,
            username: 'zachariah',
            name: 'Zachariah',
            role: 'user',
            email: 'zachariah@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 8,
            username: 'renith',
            name: 'Renith',
            role: 'user',
            email: 'renith@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 9,
            username: 'ajith',
            name: 'Ajith',
            role: 'user',
            email: 'ajith@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 10,
            username: 'jacob',
            name: 'Jacob',
            role: 'user',
            email: 'jacob@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 11,
            username: 'matthews',
            name: 'Matthews',
            role: 'user',
            email: 'matthews@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 12,
            username: 'jaison',
            name: 'Jaison',
            role: 'user',
            email: 'jaison@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 13,
            username: 'anson',
            name: 'Anson',
            role: 'user',
            email: 'anson@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 14,
            username: 'alex',
            name: 'Alex',
            role: 'user',
            email: 'alex@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        },
        {
            id: 15,
            username: 'john',
            name: 'John',
            role: 'user',
            email: 'john@passionhills.com',
            isActive: true,
            createdDate: '2024-01-01',
            lastLogin: null
        }
    ],

    // Current logged in user (will be set after login)
    currentUser: null,

    // Events and Notifications
    events: [
        {
            id: 1,
            title: 'Annual Tournament 2025',
            description: 'Annual Table Tennis Championship - Registration open now!',
            date: '2025-02-15',
            time: '09:00',
            type: 'tournament',
            priority: 'high',
            isActive: true,
            createdBy: 'varun',
            createdDate: '2024-12-01'
        },
        {
            id: 2,
            title: 'Monthly Fee Collection',
            description: 'Monthly membership fees are due. Please make your payment.',
            date: '2025-01-31',
            time: '23:59',
            type: 'fee_reminder',
            priority: 'medium',
            isActive: true,
            createdBy: 'praveen',
            createdDate: '2024-12-15'
        },
        {
            id: 3,
            title: 'Club Meeting',
            description: 'Monthly club meeting to discuss upcoming events and improvements.',
            date: '2025-01-25',
            time: '18:00',
            type: 'meeting',
            priority: 'medium',
            isActive: true,
            createdBy: 'binu',
            createdDate: '2024-12-20'
        },
        {
            id: 4,
            title: 'Equipment Maintenance',
            description: 'Scheduled maintenance of table tennis equipment and facilities.',
            date: '2025-01-20',
            time: '10:00',
            type: 'maintenance',
            priority: 'low',
            isActive: true,
            createdBy: 'varun',
            createdDate: '2024-12-10'
        },
        {
            id: 5,
            title: 'New Member Orientation',
            description: 'Welcome session for new members joining the club.',
            date: '2025-01-28',
            time: '16:00',
            type: 'orientation',
            priority: 'medium',
            isActive: true,
            createdBy: 'praveen',
            createdDate: '2024-12-18'
        }
    ],

    // Club Settings
    settings: {
        clubName: 'Passion Hills Table Tennis Club',
        defaultMembershipFee: 3000,
        defaultAnnualFee: 500,
        currentYear: 2025
    }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TTClubDatabase;
} else if (typeof window !== 'undefined') {
    window.TTClubDatabase = TTClubDatabase;
}
