export function createTypeInterface(moduleName: string, fields: Array<{ name: string; type: string }>): string {
    let interfaceContent = `import { BaseEntity } from "@/types/index.js";\n\n`;
    interfaceContent += `export interface ${moduleName} extends BaseEntity {\n`;

    fields.forEach(field => {
        if (field.name !== 'id') { // Skip id since it's in BaseEntity
            interfaceContent += `  ${field.name}: ${field.type};\n`;
        }
    });

    interfaceContent += `}\n`;
    return interfaceContent;
}

export function createRepository(moduleName: string, moduleNameLower: string, fields: Array<{ name: string; type: string }>): string {
    return `import { v4 as uuidv4 } from "uuid";
import { BaseRepository } from "@/types/index.js";
import { ${moduleName} } from "./${moduleNameLower}.types.js";

/**
 * Repository for ${moduleName} entity
 * Handles data access and storage operations
 */
class ${moduleName}Repository implements BaseRepository<${moduleName}> {
  // In-memory storage (replace with actual database in production)
  private ${moduleNameLower}s: ${moduleName}[] = [];

  constructor() {
    // Initialize with sample data
    this.${moduleNameLower}s = this.generateSampleData();
  }

  /**
   * Find all ${moduleNameLower}s
   */
  async findAll(): Promise<${moduleName}[]> {
    return this.${moduleNameLower}s;
  }

  /**
   * Find a ${moduleNameLower} by ID
   */
  async findById(id: string): Promise<${moduleName} | null> {
    const ${moduleNameLower} = this.${moduleNameLower}s.find(item => item.id === id);
    return ${moduleNameLower} || null;
  }

  /**
   * Create a new ${moduleNameLower}
   */
  async create(data: Omit<${moduleName}, 'id' | 'createdAt' | 'updatedAt'>): Promise<${moduleName}> {
    const now = new Date();
    const new${moduleName}: ${moduleName} = { 
      ...data, 
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    this.${moduleNameLower}s.push(new${moduleName});
    return new${moduleName};
  }

  /**
   * Update an existing ${moduleNameLower}
   */
  async update(id: string, data: Partial<${moduleName}>): Promise<${moduleName} | null> {
    const index = this.${moduleNameLower}s.findIndex(item => item.id === id);
    if (index === -1) return null;

    const updated${moduleName}: ${moduleName} = { 
      ...this.${moduleNameLower}s[index], 
      ...data,
      updatedAt: new Date()
    };
    
    this.${moduleNameLower}s[index] = updated${moduleName};
    return updated${moduleName};
  }

  /**
   * Delete a ${moduleNameLower} by ID
   */
  async delete(id: string): Promise<boolean> {
    const initialLength = this.${moduleNameLower}s.length;
    this.${moduleNameLower}s = this.${moduleNameLower}s.filter(item => item.id !== id);
    return initialLength > this.${moduleNameLower}s.length;
  }

  /**
   * Generate sample data for development
   */
  private generateSampleData(): ${moduleName}[] {
    return [
      this.createSampleItem(1),
      this.createSampleItem(2)
    ];
  }

  /**
   * Create a sample ${moduleNameLower} item
   */
  private createSampleItem(idx: number): ${moduleName} {
    // Generate object data fields
    const fieldsData: Record<string, unknown> = {};
    
    fields.filter(f => f.name !== 'id').forEach(field => {
      const fieldName = field.name;
      
      switch (field.type) {
        case 'string':
          fieldsData[fieldName] = \`Sample \${ fieldName } \${ idx } \`;
          break;
        case 'number':
          fieldsData[fieldName] = idx * 10;
          break;
        case 'boolean':
          fieldsData[fieldName] = true;
          break;
        case 'Date':
          fieldsData[fieldName] = new Date();
          break;
        default:
          fieldsData[fieldName] = \`Sample \${ fieldName } \${ idx } \`;
      }
    });
    
    return {
      id: uuidv4(),
      ...fieldsData,
      createdAt: new Date(),
      updatedAt: new Date()
    } as ${moduleName};
  }
}

export default ${moduleName}Repository;
`;
}

export function createService(moduleName: string, moduleNameLower: string, fields: Array<{ name: string; type: string }>): string {
    return `import { BaseService } from "@/types/index.js";
import ${moduleName}Repository from "./${moduleNameLower}.repository.js";
import { ${moduleName} } from "./${moduleNameLower}.types.js";

/**
 * Service for ${moduleName} entity
 * Handles business logic operations
 */
class ${moduleName}Service implements BaseService<${moduleName}> {
  private ${moduleNameLower}Repository: ${moduleName}Repository;

  constructor() {
    this.${moduleNameLower}Repository = new ${moduleName}Repository();
  }

  /**
   * Get all ${moduleNameLower}s
   */
  async getAll(): Promise<${moduleName}[]> {
    return this.${moduleNameLower}Repository.findAll();
  }

  /**
   * Get ${moduleNameLower} by ID
   */
  async getById(id: string): Promise<${moduleName} | null> {
    return this.${moduleNameLower}Repository.findById(id);
  }

  /**
   * Create a new ${moduleNameLower}
   */
  async create(data: Omit<${moduleName}, 'id' | 'createdAt' | 'updatedAt'>): Promise<${moduleName}> {
    // Add validation logic here
    this.validate(data);
    return this.${moduleNameLower}Repository.create(data);
  }

  /**
   * Update an existing ${moduleNameLower}
   */
  async update(id: string, data: Partial<${moduleName}>): Promise<${moduleName} | null> {
    // Add validation logic here
    this.validate(data, true);
    return this.${moduleNameLower}Repository.update(id, data);
  }

  /**
   * Delete a ${moduleNameLower}
   */
  async delete(id: string): Promise<boolean> {
    return this.${moduleNameLower}Repository.delete(id);
  }

  /**
   * Validate ${moduleNameLower} data
   */
  private validate(data: Partial<${moduleName}>, isUpdate = false): void {
    // Add custom validation logic here
    // Throw errors for validation failures
    // Example:
    // if (!data.name) {
    //   throw new Error('Name is required');
    // }
  }
}

export default ${moduleName}Service;
`;
}

export function createRoutes(moduleName: string, moduleNameLower: string, fields: Array<{ name: string; type: string }>): string {
    return `import { Router } from "fles-js";
import type { FlesRequest, FlesResponse } from "fles-js";
import { Controller } from "@/types/index.js";
import { ${moduleName} } from "./${moduleNameLower}.types.js";
import ${moduleName}Service from "./${moduleNameLower}.service.js";

// Create router instance
const router = Router();

// Create an instance of the service
const ${moduleNameLower}Service = new ${moduleName}Service();

/**
 * Handler to get all ${moduleNameLower}s
 */
const getAll${moduleName}s: Controller = async (req: FlesRequest, res: FlesResponse) => {
  try {
    const ${moduleNameLower}s = await ${moduleNameLower}Service.getAll();
    res.json(${moduleNameLower}s);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: \`Failed to get ${moduleNameLower}s: \${errorMessage}\` });
  }
};

/**
 * Handler to get a ${moduleNameLower} by ID
 */
const get${moduleName}ById: Controller = async (req: FlesRequest, res: FlesResponse) => {
  try {
    const id = req.params.id;
    const ${moduleNameLower} = await ${moduleNameLower}Service.getById(id);
    
    if (!${moduleNameLower}) {
      return res.status(404).json({ error: "${moduleName} not found" });
    }
    
    res.json(${moduleNameLower});
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: \`Failed to get ${moduleNameLower}: \${errorMessage}\` });
  }
};

/**
 * Handler to create a new ${moduleNameLower}
 */
const create${moduleName}: Controller = async (req: FlesRequest, res: FlesResponse) => {
  try {
    // Proper type assertion for request body
    const data = req.body as Omit<${moduleName}, 'id' | 'createdAt' | 'updatedAt'>;
    const new${moduleName} = await ${moduleNameLower}Service.create(data);
    res.status(201).json(new${moduleName});
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: \`Failed to create ${moduleNameLower}: \${errorMessage}\` });
  }
};

/**
 * Handler to update a ${moduleNameLower}
 */
const update${moduleName}: Controller = async (req: FlesRequest, res: FlesResponse) => {
  try {
    const id = req.params.id;
    // Proper type assertion for request body
    const data = req.body as Partial<${moduleName}>;
    const updated${moduleName} = await ${moduleNameLower}Service.update(id, data);
    
    if (!updated${moduleName}) {
      return res.status(404).json({ error: "${moduleName} not found" });
    }
    
    res.json(updated${moduleName});
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: \`Failed to update ${moduleNameLower}: \${errorMessage}\` });
  }
};

/**
 * Handler to delete a ${moduleNameLower}
 */
const delete${moduleName}: Controller = async (req: FlesRequest, res: FlesResponse) => {
  try {
    const id = req.params.id;
    const success = await ${moduleNameLower}Service.delete(id);
    
    if (!success) {
      return res.status(404).json({ error: "${moduleName} not found" });
    }
    
    res.status(204).json({});
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: \`Failed to delete ${moduleNameLower}: \${errorMessage}\` });
  }
};

// Register API routes for ${moduleNameLower} module
router.get("/", getAll${moduleName}s);
router.get("/:id", get${moduleName}ById);
router.post("/", create${moduleName});
router.put("/:id", update${moduleName});
router.delete("/:id", delete${moduleName});

export default router;
`;
}

export function createMigration(moduleName: string, moduleNameLower: string, fields: Array<{ name: string; type: string }>): string {
    // Map TypeScript types to SQL types
    const sqlTypeMap: Record<string, string> = {
        'string': 'VARCHAR(255)',
        'number': 'INTEGER',
        'boolean': 'BOOLEAN',
        'Date': 'TIMESTAMP',
    };

    let tableColumns = fields
        .filter(field => field.name !== 'id') // Skip id since we add it specifically
        .map(field => {
            const sqlType = sqlTypeMap[field.type] || 'VARCHAR(255)';
            return `    ${field.name} ${sqlType} NOT NULL`;
        }).join(',\n');

    return `/**
 * Migration for ${moduleName} entity
 */
export default {
  up: \`
    CREATE TABLE IF NOT EXISTS ${moduleNameLower}s (
      id UUID PRIMARY KEY,
${tableColumns},
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  \`,
  down: \`DROP TABLE IF EXISTS ${moduleNameLower}s\`
};
`;
}

export function createSeed(moduleName: string, moduleNameLower: string, fields: Array<{ name: string; type: string }>): string {
    // Generate sample seed data
    const fieldNames = fields
        .filter(field => field.name !== 'id') // Skip id since we generate it
        .map(field => field.name);

    const seedColumns = ['id', ...fieldNames, 'created_at', 'updated_at'].join(', ');

    let seedRows = '';
    for (let i = 1; i <= 3; i++) {
        const values = [
            `'11111111-1111-1111-1111-11111111111${i}'`, // UUID
            ...fields
                .filter(field => field.name !== 'id')
                .map(field => {
                    switch (field.type) {
                        case 'string':
                            return `'Sample ${field.name} ${i}'`;
                        case 'number':
                            return i * 10;
                        case 'boolean':
                            return 'true';
                        case 'Date':
                            return 'NOW()';
                        default:
                            return `'Sample ${field.name} ${i}'`;
                    }
                }),
            'NOW()', // created_at
            'NOW()'  // updated_at
        ].join(', ');

        seedRows += `      (${values})${i < 3 ? ',\n' : ''}`;
    }

    return `/**
 * Seed data for ${moduleName} entity
 */
export default {
  seed: \`
    INSERT INTO ${moduleNameLower}s (${seedColumns})
    VALUES 
${seedRows}
  \`
};
`;
}
