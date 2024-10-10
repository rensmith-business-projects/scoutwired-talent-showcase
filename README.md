# ScoutWired Talent Showcase

This project consists of a React frontend and an Express backend for showcasing talent submissions.

## Setting Up the Project

### Frontend Setup

1. Navigate to the project root directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```
   VITE_API_URL=http://localhost:3001
   VITE_AZURE_CLIENT_ID=your_azure_client_id
   VITE_AZURE_TENANT_ID=your_azure_tenant_id
   VITE_REDIRECT_URI=http://localhost:5173/auth-redirect
   ```
   Replace `your_azure_client_id` and `your_azure_tenant_id` with your actual Azure AD application (client) ID and tenant ID.
4. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup

1. Navigate to the project root directory.
2. Create a `server` folder:
   ```
   mkdir server
   cd server
   ```
3. Initialize a new Node.js project:
   ```
   npm init -y
   ```
4. Install required dependencies:
   ```
   npm install express cors pg multer @azure/identity @microsoft/microsoft-graph-client dotenv
   ```
5. Create a `.env` file in the `server` directory and add the following:
   ```
   PORT=3001
   DATABASE_URL=your_postgres_database_url
   TENANT_ID=your_azure_tenant_id
   CLIENT_ID=your_azure_client_id
   CLIENT_SECRET=your_azure_client_secret
   SHAREPOINT_SITE_ID=your_sharepoint_site_id
   SHAREPOINT_DRIVE_ID=your_sharepoint_drive_id
   ```
   Replace the placeholder values with your actual configuration:
   - `DATABASE_URL`: Your PostgreSQL connection string (e.g., `postgresql://username:password@localhost:5432/database_name`)
   - `TENANT_ID`: Your Azure AD tenant ID
   - `CLIENT_ID`: Your Azure AD application (client) ID
   - `CLIENT_SECRET`: Your Azure AD client secret
   - `SHAREPOINT_SITE_ID`: The ID of your SharePoint site
   - `SHAREPOINT_DRIVE_ID`: The ID of the SharePoint drive where files will be stored

6. Create a `server.js` file in the `server` directory and copy the contents from the existing `server.js` file in the project root.
7. Start the server:
   ```
   node server.js
   ```

## Running the Application

1. Start the backend server:
   ```
   cd server
   node server.js
   ```
2. In a new terminal, start the frontend development server:
   ```
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and will communicate with the backend at `http://localhost:3001`.

## Environment Variables

### Frontend (.env in project root)
- `VITE_API_URL`: URL of the backend API (e.g., http://localhost:3001)
- `VITE_AZURE_CLIENT_ID`: Your Azure AD application (client) ID
- `VITE_AZURE_TENANT_ID`: Your Azure AD tenant ID
- `VITE_REDIRECT_URI`: The redirect URI for authentication (e.g., http://localhost:5173/auth-redirect)

### Backend (.env in server directory)
- `PORT`: Port for the backend server (default 3001)
- `DATABASE_URL`: PostgreSQL database connection string
- `TENANT_ID`: Azure AD tenant ID
- `CLIENT_ID`: Azure AD client ID
- `CLIENT_SECRET`: Azure AD client secret
- `SHAREPOINT_SITE_ID`: SharePoint site ID
- `SHAREPOINT_DRIVE_ID`: SharePoint drive ID

Ensure all environment variables are properly set before running the application. Do not commit your `.env` files to version control to keep your sensitive information secure.