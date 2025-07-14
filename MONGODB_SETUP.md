# MongoDB Setup for Aithor

This guide explains how to set up MongoDB for the Aithor application.

## Option 1: Install MongoDB Directly

### 1. Download and Install MongoDB Community Edition

1. Visit the [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Download the MongoDB Community Server for your operating system
3. Follow the installation instructions for your platform

#### Windows Installation Tips

- During installation, you can choose to install MongoDB as a service (recommended)
- Make sure to add MongoDB to your system PATH
- The default data directory is `C:\data\db`

### 2. Start MongoDB Service

If you installed MongoDB as a service, it should start automatically.

To verify MongoDB is running:

```bash
mongosh
```

This should connect to the MongoDB server.

### 3. Configure Environment Variables

Update your `.env` and `.env.local` files to use the MongoDB instance:

```
# In .env and .env.local
NEXT_PUBLIC_USE_MOCK_DATA=false
MONGODB_URI=mongodb://localhost:27017/aithor
```

### 4. Seed the Database

Run the seed script to populate the database with sample data:

```bash
npm run seed
```

This will create sample users, interviews, and chat sessions in the MongoDB database.

### 5. Start the Application

Start the development server:

```bash
npm run dev
```

The application should now be running with MongoDB as the database.

## Option 2: Use MongoDB Atlas (Cloud)

If you prefer not to install MongoDB locally, you can use MongoDB Atlas, a cloud-based MongoDB service.

### 1. Create a MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create an account and follow the setup wizard
3. Create a free tier cluster

### 2. Configure Database Access

1. Create a database user with a username and password
2. Configure network access to allow connections from your IP address

### 3. Get Your Connection String

1. Click on "Connect" for your cluster
2. Choose "Connect your application"
3. Copy the connection string

### 4. Configure Environment Variables

Update your `.env` and `.env.local` files with the Atlas connection string:

```
# In .env and .env.local
NEXT_PUBLIC_USE_MOCK_DATA=false
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/aithor?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, and `<cluster-url>` with your actual values.

### 5. Seed the Database

Run the seed script to populate the database with sample data:

```bash
npm run seed
```

### 6. Start the Application

Start the development server:

```bash
npm run dev
```

## Sample Credentials

After seeding the database, you can log in with the following credentials:

- Admin: admin@example.com / admin123
- User: user@example.com / user123

## Troubleshooting

### Connection Issues

If the application cannot connect to MongoDB, ensure:

1. MongoDB is running: Check services on Windows or use `mongosh` to test connection
2. The connection string in your environment files is correct
3. Network access is properly configured (especially for MongoDB Atlas)

### Data Persistence

For local MongoDB installations, data is stored in the data directory (default: `C:\data\db` on Windows).

### Resetting the Database

To completely reset the database, you can drop the database and run the seed script again:

```bash
mongosh
> use aithor
> db.dropDatabase()
> exit

npm run seed
```