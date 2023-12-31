# Ecommerce Project

## Description

This Ecommerce Project is a comprehensive solution with authentication features, catering to both admin and regular user functionalities. The project encompasses features such as product management (add, update, and delete) for admins and a seamless shopping experience for regular users.

## Technologies Used

- **Token Authentication**: JWT (JSON Web Tokens) for secure and efficient user authentication.
- **Image Handling**: Utilizes Multer for image upload and Cloudinary for cloud-based image storage.
- **Database**: MongoDB is employed as the database for efficient data storage.
- **Frontend**: Developed using React with libraries including React Router, Redux Toolkit, Shadcn UI, and Dev UI for modular and responsive user interfaces.
- **Backend Framework**: Express.js is chosen for the backend framework to handle server-side operations.
- **Testing**: Postman is used for testing API routes, ensuring the reliability of the backend.

## Features

- **Theme**: Basic dark and light theme implementation.
- **Different Views**: Implements different views for admins and normal users.
- **User Authentication**: Ensures a secure authentication process using JWT tokens.
- **Admin Functionality**: Admins can seamlessly add, update, and delete products.
- **Product Management**: Efficiently manage product details, including images, for an enhanced user experience.
- **AddCart** : Add to cart features available
- **Comments**: Contains comments section for the product 
- **Responsive UI**: Utilizes Shadcn UI and Dev UI for creating a visually appealing and responsive frontend.
- **Database Integration**: MongoDB integration ensures efficient storage and retrieval of data.
- **State Management**: Implements Redux Toolkit for effective state management in the frontend.

## Improvements and Missing Features

- **Quantity in add to cart**: Quantity parameter in cart section
- **Slug: Slug can be used instead of the actual product id.The schema contains the slug . But i used id for fetching the product.
- **Mobile Optimization**: The mobile responsiveness of the UI can be improved. Ensure a seamless user experience on various devices by optimizing the layout for smaller screens.

*Note:* I am still working this missing features If any suggestions or any improvements in the project please let me know about it. You can reach me by the email link below in the contact section


## Security

- **Secured Routes**: After login, the login and signup routes are not accessible, ensuring the security of user authentication.

- **Admin-Only Routes**: Normal users cannot access the "Add Product" route and update/delete functionalities, ensuring that only authorized admins can perform these actions.

## About Me

I'm passionate about full-stack development with a focus on backend technologies. While my expertise lies in backend development, I'm actively working to enhance my frontend skills to become a well-rounded developer. This project is a testament to my dedication to continuous learning and improvement.

## How to Use

- Download the code, run the command `npm install`, and then start the server. For the backend, run the command `npm run start`, and for the frontend, run the command `npm run dev`.
- For a normal user, just register a user and then log in using the email or username with the correct password.
- For an admin user, manually set the role of the user to ADMIN in the database. Make sure that you spell it right.

### Prerequisites

- Node.js installed
- MongoDB database setup
- Cloudinary account for image storage

### Installation

1. Clone the repository: `git clone https://github.com/yourusername/ecommerce-project.git`
2. Navigate to the project directory: `cd ecommerce-project`
3. Install dependencies for both frontend and backend: `npm install`
4. Configure environment variables for MongoDB and Cloudinary.
5. Start the backend server: `npm run start`
6. Start the frontend development server: `npm run dev`

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

## Testing

- Postman Collection: [Link to Postman Collection](https://www.postman.com/spacecraft-cosmonaut-577274/workspace/ecommerce-project/collection/28346677-c73c2b82-4fcb-476e-b3aa-a35bf00a916f?action=share&creator=28346677&active-environment=28346677-43feaf50-e1be-472c-b816-984c6497eca8)

1. Download the code and fill the env variables with your database URL and the Cloudinary configuration.
2. Use this Postman collection for testing the routes after successfully connecting with your database and after login with a Cloudinary account.

## Frontend Images

Images for the frontend are available in the images folder

## Contact

For inquiries or feedback, please contact [Vaibhav Inamdar](mailto:inamdarvaibhav758@gmail.com).

# Ecommerce-Project
