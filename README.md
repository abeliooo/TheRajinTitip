# The Rajin Titip (Real-Time Auction Marketplace)

The Rajin Titip is a C2C (Customer-to-Customer) marketplace that allows users to sell and buy goods through a secure, real-time auction system moderated by an admin.
<br><br>
Inspired by @thelazytitip @thelazymonday

---

## 🚀 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React.js, React Router, Axios, Socket.IO Client, Tailwind CSS |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | MongoDB (with Mongoose), MongoDB Atlas (Cloud) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |

---

## ✨ Key Features

-   **Real-Time Auctions:** Prices, time, and the highest bidder are updated instantly across all clients using WebSockets.
-   **Admin Moderation:** All products must go through an admin approval process to maintain quality and security.
-   **Secure Transaction Flow:** Implements an escrow-like system where payment is held by the platform and only released to the seller after the buyer confirms receipt of the item or a dispute is resolved.
-   **Real-Time Communication:** A built-in, private chat system for buyers and sellers to coordinate during transactions, with a centralized chat screen to manage all conversations.
-   **Dispute Resolution:** A formal complaint system where buyers can submit evidence (including video) for review. Admins act as mediators to resolve disputes fairly.
-   **Comprehensive Admin Dashboard:** A dedicated interface for admins to verify payments, approve products, resolve complaints, and manage users.
-   **Separated Logins:** A distinct and secure login flow for regular users and administrators.

---

## 📦 Module Breakdown

### Module A: User Management & Authentication
*Goal: To manage all aspects related to user identity, registration, and access.*
-   **User Registration:** A form for new users to create an account (`username`, `fullName`, `email`, `phoneNumber`, `address`, `password`, `accountNumber`).
-   **Login & Logout:** A secure authentication system based on JWT.
-   **Separated Logins:** Regular users log in at `/login`, while admins log in at `/admin/login`.
-   **Profile Management:** A page for users to edit their personal data, requiring current password confirmation for changes.

### Module B: Auction & Bidding System
*Goal: To manage the lifecycle of an auction, from creation to determining the winner.*
-   **Admin Approval Flow:** Items submitted by sellers are held with a `pending` status and will not go live until approved by an admin.
-   **Real-Time Bidding:** Users can place bids, and all changes (price, bidder) are broadcast to all clients instantly using WebSockets.
-   **End of Auction:** The system automatically determines the winner when the auction timer runs out.
-   **Bid Validation:** Sellers are prevented from bidding on their own products.

### Module C: Transaction & Payment Flow
*Goal: To manage the process from when an auction is won until the payment is complete and funds are released.*
-   **Payment Initiation:** The auction winner creates a transaction, which starts in a `Waiting for Payment` status.
-   **Upload Proof of Payment:** The buyer uploads a file (e.g., a screenshot) as proof of transfer.
-   **Admin Verification:** An admin reviews the proof and either approves the payment (`Processing`) or rejects it (`Canceled`).
-   **Shipping:** The seller enters a shipping tracking number, changing the status to `Sending`.
-   **Transaction Completion:** The buyer confirms receipt of the item. If there are no complaints, the transaction is marked `Completed`, and funds are released to the seller.

### Module D: Communication & Complaints
*Goal: To provide a means of communication and a system for handling disputes.*
-   **Transactional Chat:** A private, real-time chat between the buyer and seller for each transaction, accessible from the transaction detail page.
-   **Centralized Chat Center:** A dedicated `/chat` page, accessible from the main header, that lists all of a user's conversations in one place.
-   **Complaint System:** A formal process for buyers to file a complaint after an item is delivered. It requires a reason and video evidence. The process puts the transaction `status` to `Complaint`, holding the funds until an admin resolves the dispute.

### Module E: History
*Goal: To give users access to their activity history.*
-   **Purchase History:** A page for buyers to track the status of all their purchases.
-   **My Items for Sale:** A page for sellers to track the status of items they have listed (Pending, Auctioning, Sold, Rejected).
-   **Complaint History:** An archive of all filed complaints.

### Module F: Admin Panel
*Goal: To provide a complete interface for admins to manage the entire platform.*
-   **Dedicated & Protected Routes:** A separate and secure login system and routing for the admin dashboard.
-   **Dashboard Navigation:** A consistent navigation menu to switch between all admin features.
-   **Management Pages:** Dashboards to `Approve/Reject` payments, product listings, manage active products, resolve user complaints, and view all registered users.
-   **User Management:** A feature to view the user list, separated into admins and regular users.

### Module G: Machine Learning Service (Flask)
*Goal: To integrate smart features to enhance the user experience (Planned).*
-   **Recommendation Engine:** An API to recommend products to users.
-   **Price Prediction:** An API to provide an estimated final auction price.

---

## 🔧 Running the Project Locally

To run this project, follow these steps.

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
