# The Rajin Titip (Real-Time Auction Marketplace)

The Rajin Titip is a C2C (Customer-to-Customer) marketplace that allows users to sell and buy goods through a secure, real-time auction system moderated by an admin.
<br><br>
Inspired by @thelazytitip @thelazymonday

---

## 🚀 Tech Stack

| Category      | Technology                                        |
| :------------ | :----------------------------------------------- |
| **Frontend** | React.js, React Router, Axios, Socket.IO Client, Tailwind CSS |
| **Backend** | Node.js, Express.js, Socket.IO                   |
| **Database** | MongoDB (with Mongoose), MongoDB Atlas (Cloud)   |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs                 |

---

## ✨ Key Features

-   **Real-Time Auctions:** Prices, time, and the highest bidder are updated instantly without needing to refresh the page.
-   **Admin Moderation:** All products to be auctioned must go through an admin approval process to maintain quality and security.
-   **Secure Transaction Flow:** Uses an escrow-like system where payment is held until the transaction is completed.
-   **Admin Dashboard:** A dedicated interface for admins to verify transactions, approve products, and manage the platform.
-   **Separated Logins:** A distinct login flow for regular users and admins.

---

## 📦 Module Breakdown

Below is a detailed breakdown of each module within this project.

### Module A: User Management & Authentication
*Goal: To manage all aspects related to user identity, registration, and access.*
-   **User Registration:** A registration form for new users (`username`, `fullName`, `email`, `phoneNumber`, `address`, `password`, `accountNumber`).
-   **Login & Logout:** A secure authentication system based on JWT.
-   **Separated Logins:** Regular users log in at `/login`, while admins log in at `/admin/login`.
-   **Profile Management:** A page for users to edit their personal data.

### Module B: Auction & Bidding System
*Goal: To manage the lifecycle of an auction, from creation to determining the winner.*
-   **Admin Approval Flow:** Items submitted by sellers will have a `pending` status and will not go live until approved by an Admin.
-   **Real-Time Bidding Functionality:** Users can place bids, and all changes are broadcast to all clients instantly using WebSockets.
-   **End of Auction:** Automatic winner determination when the time runs out.
-   **Bid Validation:** Sellers cannot bid on their own products.

### Module C: Transaction & Payment Flow
*Goal: To manage the process from when an auction is won until the payment is complete.*
-   **Payment Initiation:** The winner creates a transaction after the auction ends (status: `Waiting for Payment`).
-   **Upload Proof of Payment:** The buyer uploads proof of transfer (status: `Waiting for Confirmation`).
-   **Admin Verification:** The admin approves (`Processing`) or rejects (`Canceled`) the proof of payment.
-   **Enter Tracking Number:** A feature for the seller to input the shipping tracking number (status: `Sending`).
-   **Transaction Completion:** A feature for the buyer to confirm receipt of the item, triggering the release of funds (status: `Delivered`).

### Module D: Communication & Complaints
*Goal: To provide a means of communication between users and a system for handling disputes.*
-   **Transactional Chat:** A private chat system between the buyer and seller.
-   **Complaint System:** A feature for buyers to file a complaint.

### Module E: History
*Goal: To give users access to their activity history.*
-   **Purchase History:** A page for buyers to track the status of their purchases.
-   **My Items for Sale:** A dedicated page for sellers to track the status of items they have listed (Pending Approval, Auctioning, Sold, Rejected).
-   **Complaint History:** An archive of all filed complaints.

### Module F: Admin Panel
*Goal: To provide an interface for admins to manage the entire platform.*
-   **Dedicated Admin Login & Protected Routes:** A separate and secure login system and routing.
-   **Dashboard Navigation:** A navigation menu to switch between admin features.
-   **Transaction Verification Page:** A dashboard to `Approve/Reject` proofs of payment.
-   **Product Approval Page:** A dashboard to `Approve/Reject` new product listings.
-   **Active Product Management Page:** A dashboard to view and remove currently active listings.
-   **User Management:** A feature to view the user list and apply sanctions.

### Module G: Machine Learning Service (Flask)
*Goal: To integrate smart features to enhance the user experience.*
-   **Recommendation Engine:** An API to recommend products to users.
-   **Price Prediction:** An API to provide an estimated final auction price.

---

## 🔧 Running the Project Locally

To run this project on your computer, follow these steps.

### Prerequisites
-   Node.js & npm installed.
-   MongoDB Connection String (from MongoDB Atlas or a local installation).

### Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` folder and fill it with the following variables:
    ```env
    NODE_ENV=development
    PORT=5000
    MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
    JWT_SECRET=<YOUR_JWT_SECRET>
    ```
4.  Run the backend server:
    ```bash
    npm run dev
    ```
    The server will be running at `http://localhost:5000`.

### Frontend Setup
1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the React application:
    ```bash
    npm start
    ```
    The application will open at `http://localhost:3000`.
