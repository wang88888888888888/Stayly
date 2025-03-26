# Stayly Web Application

## Introduction

Stayly is a web-based platform designed to help newcomers and residents in Vancouver make informed housing decisions. By consolidating user-submitted reviews for specific residential locations, Stayly allows users to evaluate their housing options effectively. Users can input an address to browse reviews shared by current or former residents, providing valuable insights into the residential experience for a specific location.

The platform integrates the **Google Maps API** to pinpoint locations visually, making it easier to explore reviews geographically. With features such as **creating, reading, updating, and deleting (CRUD)** reviews, Stayly ensures users can contribute and manage their content easily. Additional functionalities include user authentication, profile management, and search options for reviews and addresses. This visual, interactive database serves as a reliable resource for individuals seeking residential locations for renting or buying in Vancouver.

---

## Contributors

- **Chenchen (Jane) Feng**
- **Panxin (Claire) Liu**

---

## Final Project Branch Information

The final project **Milestone 3** is available on the branch named **`Working_MilestoneThree`**. Please make sure to switch to this branch to access the latest updates and functionality for the Stayly project.


## Database Diagram

The database is designed with four main entities:

1. **Users**:  
   Stores user details such as email, name, and hashed password.  
   - **Fields**: `id`, `email`, `name`, `password`, `createdAt`, `updatedAt`  
   - **Relationships**:  
     - One-to-many relationship with **Reviews**.  
     - One-to-many relationship with **Sessions**.  

2. **Addresses**:  
   Tracks residential locations with geolocation data.  
   - **Fields**: `id`, `address`, `latitude`, `longitude`, `createdAt`, `updatedAt`  
   - **Relationships**:  
     - One-to-many relationship with **Reviews**.  

3. **Reviews**:  
   Contains user-submitted reviews linked to specific addresses.  
   - **Fields**: `id`, `title`, `content`, `contentHash`, `rating`, `addressId`, `userId`, `createdAt`, `updatedAt`  
   - **Relationships**:  
     - Belongs to **Users**.  
     - Belongs to **Addresses**.  
   - **Notes**:  
     - Unique `contentHash` prevents duplicate reviews.  
     - Indexed for optimized queries by `addressId`, `userId`, and composite `addressId + userId`.  

4. **Sessions**:  
   Manages user authentication sessions with token-based security.  
   - **Fields**: `id`, `token`, `userId`, `expiresAt`, `createdAt`, `updatedAt`  
   - **Relationships**:  
     - Belongs to **Users**.  

This database design ensures a robust structure for managing user accounts, reviews, and address data, while maintaining scalability and efficient query performance.

## Setup Instructions

### api folder setup
1. Database Setup
   1. Ensure you have MySQL installed locally on your machine.
   2. Create a database with the same name as specified in the Prisma schema (`Stayly_Web`).
   3. Use the following command to import the database schema if you have the SQL file stored locally:

      ```bash
      mysql -u root -p Stayly_Web < stayly_web_full.sql

   4. Ways to update the backup local database after users of the website have inputted data
      1) cd into api folder:
      2) run the command in the terminal: mysqldump -u root -p Stayly_Web > stayly_web_full.sql  
        - then the backup file will show up in the api folder
2. Package and dependencies
   1.     
      npm install --save-dev jest supertest @prisma/client
      npx prisma generate

   2. Enable Cookie Parsing
      Install cookie-parser:
      npm install cookie-parser

   3. Other packages to install
      npm install express
      npm install jsonwebtoken
      npx prisma generate
      (npm install bcrypt)
      (npm install bcryptjs)

3. After importing our database named "Stayly_Web", you can use the following test data to see the operations on registered users

         Testing Data
         User 1: {
           "email": "john.doe@example.com",
           "name": "John Doe",
           "password": "securePassword123"
         }
         
         Address 1: 1388 Continental St, Vancouver, BC V6Z 0C9
         Review 1: Modern downtown location. Apartments have laundry and dishwasher in suite. Big windows- we have a view which is nice. Friendly helpful management. They quickly address any issues and helped me super fast when I lost my key once. The staff cleaner keeps it nice and clean. Secure feeling and there is parking available and a share car service and storage locker
         Address 2: 600 Drake St, Vancouver, BC V6B 5W7
         Review 2: This is the best place I've ever lived. Well It was my very first time living by myself, I lived with other people but not by myself. They are very good at managing and communicating, they fix stuff right away. It is located in the very convenient spot and everything is close by.  They have gym, tv room, office, table tennis and some other stuff to play with your friend.
         Address 3:1166 Melville Street
         Review 3: SSSS
         
         
         User 2:{
           "email": "jane.smith@example.com",
           "name": "Jane Smith",
           "password": "passwordJane123"
         }
         Address 1: 600 Drake St, Vancouver, BC V6B 5W7
         Review 1:Location cannot be better. The staff is very friendly and welcoming. Sign for a 6 months lease and continue month to month after. Any issue in the apartment is taken care of pretty quickly and they even have after hours hotline and emergency caretaker onsite.
         
         User 3:{
           "email": "robert.johnson@example.com",
           "name": "Robert Johnson",
           "password": "secureRobert456"
         }
         Address 1: 1200 Hornby St, Vancouver, BC V6Z 1W2
         Review 1: What ever you do. Do not live here. Everything they tell you is a lie. If you like sirens at 4am 2am 12pm 3am 345am then this is the place for you. Oh, did I mention the smell of the garbage in the stairwell?

---

### client folder setup
1. Packages and dependencies:
   1. npm install

## Pages and Endpoints

### Pages

| Page                 | Functionality                                                                                     |
|----------------------|--------------------------------------------------------------------------------------------------|
| **Home Page**         | Browse and search addresses and reviews.                                                        |
| **Login Page**   | Authenticate users to access the platform.                                                      |
| **Register Page** | Register new users to the platform.                                                         |
| **Profile Page**      | Manage user-specific reviews, check posted review, edit or delete reviews.                                    |                                         |
| **Create Review Page** | Form for creating reviews.                                              |

## API Endpoints

The application provides several endpoints, categorized by functionality. Below is the complete list of endpoints, organized by the feature they support:

### Addresses Endpoints (this file includes functions that geocode user's inputted addresses in texts)
| **HTTP Method** | **Endpoint**                  | **Description**                                      |
|------------------|-------------------------------|------------------------------------------------------|
| GET              | `/addresses/search`          | Search addresses by a query string (approximation). |
| POST             | `/addresses`                 | Create a new address or find an existing one.       |
| GET              | `/addresses`                 | Get all addresses.                                  |
| GET              | `/addresses/:id`             | Get details for a specific address by ID.           |
| DELETE           | `/addresses/:id`             | Delete a specific address by ID.                   |

### Reviews Endpoints
| **HTTP Method** | **Endpoint**                     | **Description**                                                |
|------------------|----------------------------------|----------------------------------------------------------------|
| GET              | `/reviews/grouped-by-address`   | Get all reviews grouped by their respective addresses.         |
| GET              | `/reviews/:addressId`           | Get all reviews for a specific address by its ID.              |
| POST             | `/reviews`                     | Create a new review. (Requires authentication)                |
| PUT              | `/reviews/:id`                 | Update a specific review by its ID. (Requires authentication) |
| DELETE           | `/reviews/:id`                 | Delete a specific review by its ID. (Requires authentication) |

### Users Endpoints
| **HTTP Method** | **Endpoint**              | **Description**                                           |
|------------------|---------------------------|-----------------------------------------------------------|
| POST             | `/users/register`        | Register a new user.                                      |
| POST             | `/users/login`           | Login a user and generate an access token.               |
| POST             | `/users/logout`          | Logout the currently logged-in user. (Requires authentication) |
| POST             | `/users/refresh-token`   | Refresh the access token using a refresh token.          |
| GET              | `/users/profile`         | Get the profile of the currently logged-in user. (Requires authentication) |
| GET              | `/users`                 | Get a list of all users.                                  |
| GET              | `/users/:id`             | Get details of a specific user by their ID.              |
| DELETE           | `/users/:id`             | Delete a specific user by their ID.                      |

### Ping Endpoint
| **HTTP Method** | **Endpoint** | **Description**                         |
|------------------|-------------|-----------------------------------------|
| GET              | `/ping`     | Check API responsiveness (test route). |

---

### Notes:
- **Authentication Required**: Endpoints marked with "Requires authentication" require the user to be logged in with a valid token stored in cookies.
- **Token-Based Authentication**: The application uses token cookies for secure authentication, as per the course guidelines.
- **External API Integration**: The application integrates with the Google Maps API for location-based functionalities like geocoding addresses.


---

## Future Improvements

1. **Address Cleanup**: When all reviews for a specific address are deleted, the homepage will automatically remove the address card, ensuring only relevant addresses with reviews are displayed.

2. **Review Limitation per User**: Enforce a one-review-per-user policy for each address to maintain consistency and streamline operational logic. This ensures users provide a single comprehensive review for each address.

These improvements aim to enhance the usability, consistency, and logic of the Stayly platform, creating a more user-friendly and intuitive experience.

---

## Video Demonstration of the website
https://northeastern-my.sharepoint.com/:v:/r/personal/feng_chenc_northeastern_edu/Documents/Staly_Web_Demo.mov?csf=1&web=1&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=6YbG2K


This project integrates **React**, **Node.js**, **Prisma**, and **Google Maps API** to provide a comprehensive, user-friendly experience. Additional functionalities, such as token-based authentication and responsive design, ensure secure and seamless access across devices. Stayly aims to empower users with reliable data for making better housing decisions in Vancouver.
