# 🚀 FLES-JS - Coding Fantasy

FLES-JS Stack is a modern and sophisticated development platform specifically designed to accelerate API development using MongoDB and GraphQL/REST. With innovative features, FLES-JS helps you create complex APIs in just seconds! 🚀

---

## 🌟 **Key Features of FLES-JS**

### 1️⃣ **Easy Setup**
- Super fast installation process using a single simple command.
- Automatically generates a clean and organized project structure.

### 2️⃣ **Powerful CLI**
- Create models, schemas, and seeders with just one command.
- Supports frameworks like MongoDB + GraphQL/REST and coming soon for Next.js and TypeScript.

### 3️⃣ **Automatic GraphQL/REST**
- Automatic CRUD operations for created models.
- Full support for GraphQL Playground and Postman.

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
   - MongoDB + Express REST (Ready to use!) 🚀
   - MongoDB + Express + TypeScript (Ready to use!) 🚀
   - MongoDB + Next.js (Coming January 2025) ⏳

2. **Specify MongoDB URI:** *(Default: mongodb://localhost:27017)*
3. **Provide a database name:** *(Default: project_name)*

This process takes only a few seconds, and your project will be ready for development. 🎉

---

### **2️⃣ Master the CLI: Basic FLES-JS Commands**

FLES-JS provides a **CLI (Command Line Interface)** that's powerful to simplify your work. Here's the general format for running CLI commands:

```bash
# Frameworks
MongoDB + Apollo GraphQL        === mongajs
MongoDB + Express REST          === mongoejs
MongoDB + Express + TypeScript  === mongoets

# Basic format
npx fles-js-cli <framework> <model_name> <field_name>:<field_type>

# Example for MongoDB + Apollo GraphQL (mongajs):
# ⚠️ WARNING: If you've already used create-fles-js, init is no longer needed
# ⚠️ WARNING: The init command is only for projects that haven't used create-fles-js
npx fles-js-cli mongajs init

# Generate model
npx fles-js-cli mongajs generate User name:string email:string

# Shorter alias
npx fles-js-cli mongajs g User name:string email:string

# ⚠️ REMEMBER! DON'T USE THE WRONG FRAMEWORK NAME! ⚠️
# For MongoDB + Apollo GraphQL, the framework name is mongajs
npx fles-js-cli mongajs g User name:string email:string

# For MongoDB + Express REST, the framework name is mongoejs
npx fles-js-cli mongoejs g User name:string email:string

# For MongoDB + Express + TypeScript, the framework name is mongoets
npx fles-js-cli mongoets g User name:string email:string

# etc.
```

**Advantages of FLES-JS CLI:**
- **Fast:** Everything is automatic, no manual configuration needed.
- **Flexible:** Supports various frameworks and scenarios.
- **Easy:** Just one command to create models, schema/controller, and seeders.

---

### **3️⃣ Important Project Commands**

Here are some commands you should master:

```bash
npm run dev          # Run the server with hot reload for development
npm run start        # Run the server in production mode
npm run seed         # Reset database and reseed data
npm run seed:up      # Add new data without resetting the database
npm run seed:down    # Remove all data from the database
```

// for mongoets
must use Bun

```bash
bun dev      # Run the server with hot reload for development
bun seed     # Reset database and reseed data
bun start    # Run the server in production mode
```

to use Bun, first install Bun

```bash
npm install -g bun
```

for packages

```bash
bun install
bun add bcryptjs jsonwebtoken
bun remove bcryptjs jsonwebtoken

# etc.
```

---

### **4️⃣ Creating Models & Schemas**

The main feature of FLES-JS is the ability to create models and schemas with one simple command. For example:

```bash
# Full format
npx fles-js-cli mongajs generate User name:string age:number

# Short format
npx fles-js-cli mongajs g User name:string age:number

# For MongoDB + Express REST, the framework name is mongoejs
npx fles-js-cli mongoejs g User name:string age:number

# For MongoDB + Express + TypeScript, the framework name is mongoets
npx fles-js-cli mongoets g User name:string age:number
```

**Supported data types:**

**For MongoDB + Apollo GraphQL (mongajs) & MongoDB + Express REST (mongoejs):**
- `string` -> String
- `number` -> Float
- `integer` -> Int
- `boolean` -> Boolean
- `date` -> Date
- `id` -> ID
- `float` -> Float
- `json` -> JSON
- `[string]` -> [String]
- `[number]` -> [Float]
- `[integer]` -> [Int]
- `[boolean]` -> [Boolean]
- `[date]` -> [Date]
- `[id]` -> [ID]
- `[float]` -> [Float]
- `[json]` -> [JSON]

**For MongoDB + Express + TypeScript (mongoets):**
- `string` -> String (z.string())
- `number` -> Number (z.number()) 
- `boolean` -> Boolean (z.boolean())
- `date` -> Date (z.date())
- `array` -> Array of strings (z.array(z.string()))
- `object` -> Object with string values (z.record(z.string()))
- `email` -> Email string (z.string().email())
- `url` -> URL string (z.string().url()) 
- `uuid` -> UUID string (z.string().uuid())
- `enum` -> Enum of values (z.enum([values]))
- `json` -> JSON object (z.record(z.unknown()))

---

### **5️⃣ Seeding Data to Database**

Seeding process is very easy with FLES-JS. Follow these steps:

1. Edit the JSON file in the `data/[model].json` folder. Example:
```json
[
    {
        "_id": "000000000000000000000001",
        "name": "Rafles Yohanes",
        "email": "rfflsy16@gmail.com",
        "age": 19
    }
]
```

---

### **6️⃣ Using GraphQL Playground**

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

### **7️⃣ Testing REST APIs**

For REST API testing with MongoDB + Express REST (mongoejs) or MongoDB + Express + TypeScript (mongoets), you can use Postman or any other REST API client:

1. Run the server:
```bash
npm run dev
```

2. Access your API endpoints, for example:
```
GET    http://localhost:4000/api/users      # Get all users
GET    http://localhost:4000/api/users/:id  # Get user by ID
POST   http://localhost:4000/api/users      # Create user
PUT    http://localhost:4000/api/users/:id  # Update user
DELETE http://localhost:4000/api/users/:id  # Delete user
```

---

### **8️⃣ Tips and Tricks for Development**

Here are some tips to maximize the use of FLES-JS:

1. **Ideal Workflow:**
```bash
# 1. Create a new project
npx create-fles-js my-app

# 2. Create models
npx fles-js-cli mongajs generate User name:string
npx fles-js-cli mongajs generate Product name:string

# Or if using MongoDB + Express REST
npx fles-js-cli mongoejs generate User name:string email:string age:number
npx fles-js-cli mongoejs generate Product name:string price:number

# Or if using MongoDB + Express + TypeScript
npx fles-js-cli mongoets generate User name:string email:string age:number
npx fles-js-cli mongoets generate Product name:string price:number

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

> _"Think out of the box"_ - Rafles Yohanes


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

## 📚 **Q&A**

### 1. Can FLES-JS Stack be used for large projects?

Actually, FLES-JS Stack can already be used for large and complex projects, but we're still in the development and testing phase. We will soon release a stable version for large and complex projects.

### 2. Can FLES-JS Stack be used for small projects?

FLES-JS Stack is designed for small and simple projects. With innovative features, FLES-JS helps you create complex APIs in just seconds! ONLY WITH FLES-JS CLI 🚀

### 3. Is FLES-JS Stack paid?

FLES-JS Stack is a free and open source platform. We will not charge any fees for the use of FLES-JS Stack.

### 4. How fast is FLES-JS Stack performance?

FLES-JS Stack is very fast and sophisticated, you only need to prepare the required data.json, and fles-js will create your backend quickly and sophisticatedly with simple, easy to understand, and efficient code.

---

FLES-JS: The fastest and most sophisticated API development solution for the modern era. Start your project now and feel the difference!

