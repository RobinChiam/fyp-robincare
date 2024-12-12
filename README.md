# **Welcome to my Final Year Project - RobinCare**

## **Web Stack**

### MERN Stack

- MongoDB Atlas ||  Database
- Express.js    ||  Middleware & Routing
- React.js      ||  Frontend Library
- Node.js       ||  Backend Language

---

React setup using Vite, running on localhost:5173, Uses Axios for sending requests to Express.
Using Redux for State Management
Express running on localhost:5000

### Additional Technologies

- Chakra UI (For React.js)

### Modules

- Access Control Module (Login / Register / Password Reset)
(For Register, there are 4 Steps in the registration form, Step 1 and 2 let's the user enter their information and
in Step 3 a Verification PIN is created and sent to the user's email which they can enter and proceed to Step 4,
In Step 4, the account is created and the user can upload their Profile Picture (Optional).)
(For Password Reset, an email is sent to the user's email address where they can click on the Password Reset link
and reset their password in the page loaded from the link)
- CRUD Module for Health Records, Appointments, Doctors and Patients
- Billing Module
- Insurance Claim Module

### User Roles

- Doctor 
- Patient
- Admin

### Routes in React 
/ - HomePage
/terms-and-privacy - Terms and Privacy Page
/contact-us - Contact Us Page (Nodemailer will send an email to jqchiamrobin@gmail.com with the message the user
entered in the Contact Us Page
/about-us - About Us Page
/blog - Blog Page

/dashboard/patient - Patient Dashboard 
(User will see their upcoming appointments and access other pages.)
/dashboard/admin   - Admin Dashboard 
(Admin will see some summary data as well as access to other pages)
/dashboard/doctor  - Doctor Dashboard
(Doctors can view their total appointments and access other pages here)

### Routes in Express

/api - For Generic Routes that don't fit into the categories below
	/api/users/me - Takes the req.session.user object and finds a match in the database.
	/api/appointments/my-appointments - returns a list of appointments.
	/api/contact - Uses nodemailer to send email with data passed in the req.body and responds with a success 
	message.
/auth - For Authentication Module such as login, register and password reset
	/auth/login - Takes user login data passed in the req.body and checks it with the User Object. 
	/auth/register - Creates a verification object and sends the PIN number passed in the req.body to the user's
	email.
	/auth/verify-pin - Takes the PIN from the req.body and checks if it's valid and then creates the User Object
	using the data from verification object and deletes the Verification Object.
	/auth/forget-passowrd - Takes Email from req.body and checks if User exists, if true then creates a password
	reset token and sends it as an email.
	/auth/reset-password/:token - Takes the token from req.params and then updates the User Object's Password 
	with the password from req.body
	/auth/logout - Destroys the session stored in MongoDB
	
/appointments - GET / POST requests for CRUD of Appointment Object
	/appointments/create - Creates the Appointment Object
	/appointments/my-appointments - returns a list of appointments from the Appointments Collection
	/appointments/update-status - Updates the status property of the Appointment Object
	/appointments/cancel - Updates the status property of the Appointment Object to Cancelled
	/appointments/doctor-today - Returns a list of appointments for the doctor that made the request.
/billing - GET / POST requests for CRUD of Invoice Object
	/billing/my-invoices - Returns a list of Invoices for the user that made the request.
	/billing/pay - Updates the isPaid property for the Invoice Object to true.
	/billing/summary - Returns the total number of Invoices, unpaid Invoices and paid invoices.
/patient - GET / POST requests for CRUD of Patient Object
	/patient/profile - Gets the Patient Profile and returns it as a response.
	/patient/profile/update - Updates any information in the Patient Profile
/doctor  - GET / POST requests for CRUD of Doctor Object
	/doctor/profile - Gets the Doctor Profile and returns it as a response.
	/doctor/profile/update - Updates the Doctor profile
	/doctor/list - Returns a list of Doctors as a response.
/admin   - GET / POST requests for CRUD of Admin  Object
	/admin/users - Returns a list of users as a response.
	/admin/doctor/update-info - Updates the Doctor Object.
/medical-records - GET / POST requests for Health Records Object
	/medical-records/add - Creates a new Health Record Object
	/medical-records/my-records - Returns a list of Health Records from the HealthRecord collection.
/insurance-claims - GET / POST requests for Claims Object
	/insurance-claims/add - Creates a insuranceclaim Object
	/insurance-claims/my-records - Returns a list of Insurance Claims from the insuranceclaim Collection.


Models

Appointments-model.js - Mongoose Schema for Appointments
doctor-model.js - Mongoose Schema for Doctor
health-records-model.js - Mongoose Schema for Health Records
insuranceclaims-model.js - Mongoose Schema for Insurance Claims
invoice-model.js - Mongoose Schema for Invoices
patient-model.js - Mongoose Schema for Patients
user-model.js - Mongoose Schema for Users
verification-model.js - Mongoose Schema for Verfications




---

