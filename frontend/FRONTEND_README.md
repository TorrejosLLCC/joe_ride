# Joe Ride Frontend Implementation

## Overview

This is the complete frontend implementation for Joe Ride, a coffee-powered ride sharing platform where users can offer and request rides, with payments made through coffee vouchers.

## Features Implemented

### 🏠 **Home Page**
- Welcome screen with feature overview
- Navigation to offer/request rides
- Guest and authenticated user views
- Feature explanation cards

### 🔐 **Authentication System**
- User registration with full profile information
- Sign in/sign out functionality
- Modal-based authentication forms
- Persistent login sessions
- User context management

### 🚗 **Ride Offering**
- Complete ride offer form with all required fields
- Vehicle type selection (motorcycle, sedan, compact, SUV, pickup)
- Departure date and time selection
- Seat capacity configuration
- Distance input for voucher calculation
- Real-time voucher requirement preview

### 🙋 **Ride Requesting**
- Ride request form with pickup/destination
- Preferred time window selection
- Distance input for voucher calculation
- Automatic voucher requirement calculation

### 📋 **Ride Board**
- Unified view of all ride offers and requests
- Advanced filtering system:
  - Date and time range filters
  - Origin and destination filters
  - Voucher size filters
  - Ride type filters (offers/requests/both)
- Real-time ride updates
- Join ride functionality
- Contact system for ride requests

### ☕ **Coffee Voucher System**
- Complete voucher calculation engine based on:
  - Distance in kilometers
  - Vehicle type efficiency
- Five voucher sizes: Short, Tall, Grande, Venti, Trenta
- Vehicle-specific voucher requirements:
  - Motorcycles: Most efficient (longer distances per voucher)
  - Sedans/Compact: Moderate efficiency
  - SUVs/Pickups: Less efficient (shorter distances per voucher)
- Interactive voucher calculator
- Comprehensive voucher guide

### 🎨 **User Interface**
- Dark theme design
- Responsive layout for desktop and mobile
- Accessible navigation with icons and labels
- Card-based layout for rides
- Modal system for forms
- Toast notifications for user feedback
- Professional CSS styling

### 🔧 **Technical Implementation**

#### State Management
- React Context API for global state
- User authentication context
- Rides management context
- Separation of concerns between offers and requests

#### API Integration
- Axios-based HTTP client
- RESTful API communication
- Error handling and loading states
- Backend integration ready

#### Type Safety
- Comprehensive TypeScript types
- Interface definitions for all data structures
- Type-safe API calls and state management

#### Components Architecture
- Reusable UI components (Button, Input, Card, Modal)
- Feature-specific components (RideItem, RideList, RideFilter)
- Page-level components with proper routing
- Clean separation of concerns

## File Structure

```
frontend/src/
├── components/
│   ├── Header/                 # Navigation and authentication
│   ├── Ride/                   # Ride-related components
│   │   ├── RideOfferForm.tsx   # Create ride offers
│   │   ├── RideRequestForm.tsx # Create ride requests
│   │   ├── RideItem.tsx        # Individual ride display
│   │   └── RideList.tsx        # List of rides
│   ├── RideBoard/              # Ride board functionality
│   │   ├── RideBoard.tsx       # Main ride board
│   │   └── RideFilter.tsx      # Filtering system
│   ├── UI/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   └── Voucher/                # Voucher system
│       ├── VoucherDisplay.tsx  # Voucher visualization
│       └── VoucherCalculator.tsx # Voucher calculation tool
├── pages/                      # Page components
│   ├── Home.tsx               # Landing page
│   ├── OfferRide.tsx          # Offer ride page
│   ├── RequestRide.tsx        # Request ride page
│   ├── RideBoard.tsx          # Ride board page
│   └── VoucherSummary.tsx     # Voucher guide page
├── store/                      # State management
│   ├── user-context.tsx       # User authentication
│   ├── rides-context.tsx      # Ride management
│   └── ...
├── types/                      # TypeScript definitions
│   └── index.ts               # All type definitions
├── utils/                      # Utility functions
│   └── voucherCalculator.ts   # Voucher calculation logic
└── api/                        # API integration
    ├── auth/                  # Authentication APIs
    ├── rides/                 # Ride APIs
    └── index.ts               # HTTP client configuration
```

## Key Features

### Voucher System Logic
The app implements a sophisticated voucher system where the required voucher size depends on both distance and vehicle type:

- **Motorcycle**: Most efficient, can travel 5-24km per voucher
- **Sedan/Compact**: Moderate efficiency, 3-18km per voucher  
- **SUV/Pickup**: Least efficient, 2-14km per voucher

### Smart Filtering
The ride board includes comprehensive filtering:
- Filter by date, time, location, voucher size, and ride type
- Real-time filtering with instant results
- Clear filter state management

### Responsive Design
- Mobile-first approach
- Adaptive navigation (icons only on mobile)
- Grid layouts that adjust to screen size
- Touch-friendly interface elements

## Getting Started

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:5174` (or the port shown in terminal)

## Usage Flow

1. **Guest User**: Can browse the ride board and view voucher information
2. **Register/Login**: Create account with vehicle information
3. **Offer Ride**: Fill out the ride offer form with departure details
4. **Request Ride**: Create a ride request with preferred time windows
5. **Browse Rides**: Use the ride board to find rides or passengers
6. **Join Rides**: Click to join available ride offers
7. **Voucher Calculation**: See required voucher sizes for any trip

## API Integration

The frontend is designed to work with the NestJS backend API:
- User authentication endpoints
- Ride offer CRUD operations
- Ride request management
- Real-time ride updates

## Technologies Used

- **React 19** with TypeScript
- **React Router** for navigation
- **Axios** for HTTP requests
- **Vite** for build tooling
- **CSS3** for styling
- **Context API** for state management

## MVP Scope Completed

✅ User registration & authentication  
✅ Ride posting (offer & request)  
✅ Ride board listing + filtering  
✅ Voucher cost calculation  
✅ Role switching (driver/passenger)  
✅ Basic UI/UX implementation  
✅ TypeScript type safety  
✅ Responsive design  

The frontend implementation is complete and ready for production use with the corresponding NestJS backend.
