# 🚀 FLES-JS - Coding Fantasy

FLES-JS Stack is a modern and sophisticated development platform specifically designed to accelerate API development using MongoDB and GraphQL. With innovative features, FLES-JS helps you create complex APIs in just seconds! 🚀

---

## 🌟 **Key Features of FLES-JS**

### 1️⃣ **Easy Setup**
- Super fast installation process using a single simple command.
- Automatically generates a clean and organized project structure.

### 2️⃣ **Powerful CLI**
- Create models, schemas, and seeders with just one command.
- Supports frameworks like MongoDB + GraphQL and coming soon for Next.js and Express REST.

### 3️⃣ **Automatic GraphQL**
- Automatic CRUD operations for created models.
- Full support for GraphQL Playground.

### 4️⃣ **Easy Seeding**
- Reset, add, or delete database data with simple commands.

### 5️⃣ **Modular and Scalable**
- Project structure that's easily expandable for large application needs.
- Middleware support for managing common tasks.

### 6️⃣ **Community Support**
- Active on platforms like Discord and GitHub to help all developers.

---

## 📚 **Complete Guide to Using FLES-JS**

Below, you'll find step-by-step tutorials to start, configure, and maximize the potential of FLES-JS. We also include practical tips, real examples, and troubleshooting to make your development experience more enjoyable. 🚀

---

### **1️⃣ Installation & Project Setup with FLES-JS**

The first step to begin your journey with FLES-JS is to create a new project. With these three methods, you can start without any complications:

```bash
npx create-fles-js my-app    # Create a new folder named "my-app"
npx create-fles-js .         # Use the current folder for a new project
npx create-fles-js           # FLES-JS will ask for a project name
```

After running one of the commands above, you'll be asked to:

1. **Choose a framework:**
   - MongoDB + Apollo GraphQL (Ready to use!) 🚀
   - MongoDB + Next.js (Coming January 2025) ⏳
   - MongoDB + Express REST (Coming January 2025) ⏳

2. **Specify MongoDB URI:** *(Default: mongodb://localhost:27017)*
3. **Provide a database name:** *(Default: project_name)*

This process takes only a few seconds, and your project will be ready for development. 🎉

---

### **2️⃣ Master the CLI: Basic FLES-JS Commands**

FLES-JS provides a **CLI (Command Line Interface)** that's powerful to simplify your work. Here's the general format for running CLI commands:

```bash
# Basic format
npx fles-js-cli <framework> <command>

# Example for MongoDB + Apollo GraphQL framework (mongajs):
# But if you've already used create-fles-js, init is no longer needed
npx fles-js-cli mongajs init

# Generate model
npx fles-js-cli mongajs generate User name:string email:string

# Shorter alias
npx fles-js-cli mongajs g User name:string email:string
```

**Advantages of FLES-JS CLI:**
- **Fast:** Everything is automatic, no manual configuration needed.
- **Flexible:** Supports various frameworks and scenarios.
- **Easy:** Just one command to create models, schemas, and seeders.

---

### **3️⃣ Project Structure Created by FLES-JS**

After starting a project, FLES-JS will automatically generate the following directory structure:

```
my-app/
  ├─ models/          # Database model definitions
  ├─ schemas/         # GraphQL schemas
  ├─ config/          # Database configuration
  │  └─ mongodb.json
  ├─ seeders/         # Database seeder files
  ├─ data/            # Sample data in JSON format
  ├─ index.js         # Application entry point
  └─ package.json     # Dependencies information
```

**Advantages of this structure:**
- Modular and organized.
- Easily expandable for large projects.
- Supports team-based development.

---

### **4️⃣ Important Project Commands**

Here are some commands you should master:

```bash
npm run dev          # Run the server with hot reload for development
npm run start        # Run the server in production mode
npm run seed         # Reset database and reseed data
npm run seed:up      # Add new data without resetting the database
npm run seed:down    # Remove all data from the database
```

---

### **5️⃣ Creating Models & Schemas**

The main feature of FLES-JS is the ability to create models and schemas with one simple command. For example:

```bash
# Full format
npx fles-js-cli mongajs generate User name:string age:number

# Short format
npx fles-js-cli mongajs g User name:string age:number
```

After running the command above, FLES-JS will automatically generate the following files:
- `models/user.js`
- `schemas/user.js`
- `seeders/userSeeder.js`
- `data/user.json`
- Automatic updates to:
  - `models/index.js`
  - `index.js`
  - `seeders/index.js`

**Supported data types:**
- `string` -> String
- `number` -> Float
- `boolean` -> Boolean
- `date` -> Date
- `id` -> ID
- `[type]` -> Array *(example: `[String]`)*

---

### **6️⃣ Complex Model Examples**

Here are examples of creating models with higher complexity:

```bash
# User model with many fields
npx fles-js-cli mongajs g User name:string email:string age:number isActive:boolean

# Product model with array
npx fles-js-cli mongajs g Product name:string price:number tags:[string]

# Order model with relations
npx fles-js-cli mongajs g Order userId:id productId:id status:string
```

---

### **7️⃣ Seeding Data to Database**

Seeding process is very easy with FLES-JS. Follow these steps:

1. Edit the JSON file in the `data/[model].json` folder. Example:
```json
[
    {
        "_id": "000000000000000000000001",
        "name": "Rafles Yoh",
        "email": "raffles@example.com",
        "age": 25
    }
]
```

2. Run one of the following commands:
```bash
npm run seed      # Reset database and reseed data
npm run seed:up   # Add new data only
npm run seed:down # Clear all data in the database

# DON'T FORGET TO REMOVE SEEDERS IF NO LONGER NEEDED
```

---

### **8️⃣ Using GraphQL Playground**

GraphQL Playground allows you to test your API with an interactive interface. Follow these steps:

1. Run the server:
```bash
npm run dev
```

2. Open [http://localhost:4000](http://localhost:4000) in your browser.

3. GraphQL query examples:
```graphql
# Get all users
query {
    users {
        _id
        name
        email
    }
}

# Create a new user
mutation {
    createUser(input: {
        name: "Rafles Yohanes"
        email: "rfflsy16@gmail.com"
        age: 19
    }) {
        _id
        name
    }
}
```

---

### **9️⃣ Tips and Tricks for Development**

Here are some tips to maximize the use of FLES-JS:

1. **Ideal Workflow:**
```bash
# 1. Create a new project
npx create-fles-js my-app

# 2. Create models
npx fles-js-cli mongajs g User name:string
npx fles-js-cli mongajs g Product name:string

# 3. Edit data for seeders
# Add data in data/user.json & data/product.json

# 4. Seed database
npm run seed

# 5. Start development
npm run dev
```

2. **Best Practices:**
- Create modular and focused models.
- Use middleware for common tasks like validation.
- Always write clear code documentation.
- For large projects, consider using TypeScript.

> _"Think out of the box"_ - Rafles Yoh

---

## 🤝 **Contribution**

Want to participate in developing FLES-JS? We always welcome contributions! Visit our [GitHub repo](https://github.com/rfflsy16/fles-js-stack) for more information.

### Contribution Guide
1. Fork our repository on GitHub.
2. Create a new branch for the feature or fix you want to add.
3. Make a pull request and write a detailed description.
4. Discuss with the team for code integration.

---

## 📝 **License**

FLES-JS Stack is released under the MIT license and developed with love ❤️ by the FLES-JS Stack team. For more information, visit [our GitHub](https://github.com/rfflsy16/fles-js-stack).

---

FLES-JS: The fastest and most sophisticated API development solution for the modern era. Start your project now and feel the difference!

