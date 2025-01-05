# Key Account Manager (KAM) Lead Management System

The **Key Account Manager (KAM) Lead Management System** is a comprehensive solution designed for managing relationships with large restaurant accounts on Udaan, a B2B e-commerce platform. This system empowers KAMs to effectively track leads, schedule interactions, and monitor account performance, ensuring improved operational efficiency and better client satisfaction.
The application serves as a centralized platform for handling restaurant accounts, contact details, interaction history, and call schedules. It also provides insights into account performance, enabling data-driven decision-making and fostering stronger relationships with key clients.

---

## Core Features

### 1. Lead Management  
- Add and update restaurant leads.  
- Maintain essential restaurant details, including name, address, and status.  
- Organize and Store basic Lead information

### 2. Contact Management  
- Add multiple Points of Contact (POCs) for each restaurant.  
- Store details such as name, role, email, and phone number.  
- Associate specific roles with POCs for better clarity.

### 3. Interaction Tracking  
- Log details of calls and meetings with leads.  
- Record interaction dates and outcomes.  
- Track the frequency and nature of interactions to identify trends.

### 4. Call Planning  
- Automatically generate a list of restaurants requiring calls based on predefined schedules.  
- Keep track of the last call made and ensure timely follow-ups.  
- Allow KAMs to update call outcomes directly in the system.

### 5. Performance Tracking  
- Monitor ordering patterns and frequency to assess account performance.  
- Identify well-performing accounts to strengthen relationships.  
- Flag underperforming accounts for targeted strategies.

---
### Technologies Used

- **Backend**: Java, Spring Boot
- **Frontend**: React, HTML, CSS, Bootstrap
- **Database**: MySQL
- **Tools**: Eclipse IDE (for Spring Boot), VS Code (for React), MySQL Workbench, Axios

---
## System Requirements
To run this project, ensure you have the following installed:

- **Backend**:
  - Java (JDK 17 or above)
  - Eclipse IDE (2023-06 or later)
  - MySQL Server (8.0 or above)
  - MySQL Workbench (8.0 or above)
  - Maven (3.8.6 or above)
- **Frontend**:
  - Node.js (v18.16.0 or above)
  - VS Code (1.81 or above)
- **Additional Tools**:
  - npm (9.5 or above)

---

## Dependencies Used
**Backend**:
- spring-boot-starter-data-jpa
- spring-boot-starter-web
- spring-boot-devtools
- mysql-connector-java
- Lombok

**Frontend**:
```json
{
  "axios": "1.3.4",
  "react": "18.2.0",
  "react-dom": "18.2.0",
  "bootstrap": "5.2.3"
}
```

---

## Installation Instructions

### 1. Install Prerequisites
1. Download and install Java JDK from [Oracle](https://www.oracle.com/java/technologies/javase-downloads.html).
2. Install MySQL Workbench from [MySQL](https://dev.mysql.com/downloads/workbench/).
3. Install Eclipse IDE from [Eclipse](https://www.eclipse.org/downloads/).
4. Download and install Node.js from [Node.js](https://nodejs.org/). //if you want to run javascript
5. Install Visual Studio Code from [VS Code](https://code.visualstudio.com/).

### 2. Using the ZIP File

#### Backend Setup:
1. Create a folder in your workspace and extract the ZIP file provided.
2. Open **Eclipse IDE** and navigate to: `File -> Import -> Existing Maven Projects`.
3. Select the backend folder and click `Finish`.
4. Open **MySQL Workbench** and create a database:
   ```sql
   CREATE DATABASE kam_lead_management;
   ```
5. Update `application.properties` in `src/main/resources` with your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/kam_lead_management?useSSL=false&serverTimezone=UTC
   spring.datasource.username=<your-username>
   spring.datasource.password=<your-password>
   ```
6. Right-click the project in Eclipse, go to `Maven -> Update Project` to resolve any errors.
7. Run `KamLeadManagementApplication.java` in the `com.sb.kam` package to start the backend server.

#### Frontend Setup:
1. Open the frontend folder in **VS Code**.
2. Run the following commands:
   ```bash
   npm install
   npm start
   ```
3. This will start the frontend server at `http://localhost:3000`.

---

## API Documentation

### Restaurant Page
#### GET: Retrieve All Restaurants
```bash
http://localhost:8080/restaurants
```
Response Example:
```json
[
  {
    "id": 6,
    "restaurantName": "The vvv Kitchen",
    "address": "112 vvv Street",
    "contactNumber": "222",
    "currentStatus": "ACTIVE",
    "assignedKam": "vvv Op",
    "callFrequency": "BIWEEKLY",
    "lastCallDate": "2024-12-30",
    "contacts": [],
    "interactions": []
  }
]
```

#### POST: Add a New Restaurant
```bash
http://localhost:8080/restaurants
```
Request Body Example:
```json
{
  "restaurantName": "The vvv Kitchen",
  "address": "112 vvv Street",
  "contactNumber": "222",
  "currentStatus": "NEW",
  "assignedKam": "vvv Op",
  "callFrequency":"WEEKLY",
  "lastCallDate": "2024-12-30"
}
```

#### PUT: Update Restaurant
```bash
http://localhost:8080/restaurants/{restaurantId}
```
Request Body Example:
```json
{
  "id": 6,
  "restaurantName": "The vvv Kitchen",
  "address": "112 vvv Street",
  "contactNumber": "222",
  "currentStatus": "NEW",
  "assignedKam": "vvv Op",
  "callFrequency": "BIWEEKLY",
  "lastCallDate": "2024-12-30"
}
```

#### DELETE: Delete Restaurant
```bash
http://localhost:8080/restaurants/{restaurantId}
```
Response Code:
```bash
204 No Content
```

---
### Additional Endpoints for Restaurant Page

- **GET Restaurant by ID**
  ```bash
  http://localhost:8080/restaurants/{restaurantId}
  ```

- **GET All Status Options**
  ```bash
  http://localhost:8080/restaurants/allstatus
  ```

- **GET Restaurants Requiring Calls Today**
  ```bash
  http://localhost:8080/restaurants/requiringCalls
  ```

- **GET Well-Performing Restaurants**
  ```bash
  http://localhost:8080/restaurants/wellPerforming
  ```

- **GET Underperforming Restaurants**
  ```bash
  http://localhost:8080/restaurants/underPerforming
  ```

- **GET Restaurants with Pending Follow-Ups**
  ```bash
  http://localhost:8080/restaurants/pendingFollowUps
  ```

- **GET Count of Restaurants, Contacts, Interactions, and Orders**
  ```bash
  http://localhost:8080/restaurants/statusCounts
  ```

- **PUT Update Restaurant Status**
  ```bash
  http://localhost:8080/restaurants/{id}/currentStatus
  ```

- **PUT Update Call Frequency**
  ```bash
  http://localhost:8080/restaurants/{id}/callFrequency
  ```

- **PUT Update Call Details**
  ```bash
  http://localhost:8080/restaurants/{id}/callDetails
  ```

---
## Contact Page

### GET: Retrieve All Contacts

```bash
GET http://localhost:8080/contacts
```
Response Example:
```json
[
  {
    "id": 1,
    "name": "GokuGodOp",
    "role": "OWNER",
    "phoneNumber": "23432523522342",
    "email": "mas@gmail.com",
    "restaurantId": 17,
    "restaurantName": "Carnivore"
  }
]
```

### POST: Create Contact

```bash
http://localhost:8080/contacts
```
Request Body Example:
```json
{
  "name": "Vegeta Op",
  "role": "CHEF",
  "phoneNumber": "2222",
  "email": "kkkks@kitchen.com",
  "restaurant": {
    "id": 17
  }
}
```

### PUT: Update Contact

```bash
http://localhost:8080/contacts/{contactId}
```
Request Body Example:
```json
{
  "name": "Vegeta Op",
  "role": "CHEF",
  "phoneNumber": "99999",
  "email": "kkkks@kitchen.com",
  "restaurant": {
    "id": 17
  }
}
```

### DELETE: Delete Contact

```bash
http://localhost:8080/contacts/{contactId}
```
Response: `204 No Content`

### Additional Endpoints for Contact Page

- **GET Contact by ID**
  ```bash
  http://localhost:8080/contacts/{id}
  ```

- **GET Contacts by Restaurant ID**
  ```bash
  http://localhost:8080/contacts/restaurant/{restaurantId}
  ```

- **GET All Roles**
  ```bash
  http://localhost:8080/contacts/roles
  ```

- **PUT Update Role**
  ```bash
  http://localhost:8080/contacts/{id}/role
  ```

- **PUT Update Contact**
  ```bash
  http://localhost:8080/contacts/{contactId}
  ```

---

## Interaction Page

### GET: Retrieve All Interactions

```bash
http://localhost:8080/interactions
```
Response Example:
```json
[
  {
    "id": 1,
    "dateOfInteraction": "2024-12-18",
    "interactionType": "VISIT",
    "notes": "aasaa",
    "followUpRequired": true,
    "loggedBy": "22",
    "restaurantId": 6,
    "restaurantName": "The vvv Kitchen"
  }
]
```

### POST: Create Interaction

```bash
http://localhost:8080/interactions
```
Request Body Example:
```json
{
  "restaurant": {
    "id": 17
  },
  "dateOfInteraction": "2025-01-01",
  "followUpRequired": true,
  "interactionType": "CALL",
  "notes": "adawds",
  "loggedBy": "dd doe"
}
```

### PUT: Update Interaction

```bash
http://localhost:8080/interactions/{interactionId}
```
Request Body Example:
```json
{
  "restaurant": {
    "id": 6
  },
  "dateOfInteraction": "2024-12-18",
  "interactionType": "VISIT",
  "notes": "aasaaaaa",
  "followUpRequired": true,
  "loggedBy": "22"
}
```

### DELETE: Delete Interaction

```bash
http://localhost:8080/interactions/{interactionId}
```
Response: `204 No Content`

### Additional Endpoints for Interaction Page

- **GET Interaction by ID**
  ```bash
  http://localhost:8080/interactions/{id}
  ```

- **GET Interactions by Restaurant ID**
  ```bash
  http://localhost:8080/interactions/restaurant/{restaurantId}
  ```

- **GET All Interaction Types**
  ```bash
  http://localhost:8080/interactions/interactionTypes
  ```

- **PUT Update Interaction Type**
  ```bash
  http://localhost:8080/interactions/{interactionId}/interactionType
  ```

- **PUT Update Follow-Up Required**
  ```bash
  http://localhost:8080/interactions/{interactionId}/follow-up
  ```

---
