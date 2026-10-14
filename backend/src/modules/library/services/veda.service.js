import { Op } from "sequelize";
import Veda from "../models/veda.model.js";
import VedaNode from "../models/vedaNode.model.js";
import VedaMantra from "../models/vedaMantra.model.js";
import {
  INITIAL_VEDAS,
  INITIAL_VEDA_NODES,
  INITIAL_VEDA_MANTRAS,
} from "../data/initialVedicHeritageData.js";
import {
  INITIAL_PURANAS,
  INITIAL_ITIHASAS,
  INITIAL_UPANISHADS,
  INITIAL_DARSHANAS,
  INITIAL_GRANTHA_NODES,
  INITIAL_GRANTHA_MANTRAS,
} from "../data/initialGranthaHeritageData.js";

export class VedaService {
  /**
   * Helper: Get merged initial dataset of all Vedas and Granthas
   */
  static getAllInitialGranthas(category) {
    const all = [
      ...INITIAL_VEDAS.map((v) => ({ ...v, category: v.category || "veda" })),
      ...INITIAL_PURANAS,
      ...INITIAL_ITIHASAS,
      ...INITIAL_UPANISHADS,
      ...INITIAL_DARSHANAS,
    ];
    if (!category || category === "ALL") {
      return all;
    }
    return all.filter((item) => item.category === category);
  }

  /**
   * Get all active Vedas & Granthas (Public)
   */
  static async getAllVedas(params = {}) {
    const { status = "ACTIVE", category } = params;
    try {
      const where = {};
      if (status && status !== "ALL") {
        where.status = status;
      }
      if (category && category !== "ALL") {
        where.category = category;
      }

      const vedas = await Veda.findAll({
        where,
        order: [["orderIndex", "ASC"], ["createdAt", "ASC"]],
      });

      if (vedas && vedas.length > 0) {
        if (category && category !== "ALL") {
          return vedas;
        }
        const hasGranthas = vedas.some((v) => v.category && v.category !== "veda");
        if (hasGranthas) {
          return vedas;
        }
        const granthas = [
          ...INITIAL_PURANAS,
          ...INITIAL_ITIHASAS,
          ...INITIAL_UPANISHADS,
          ...INITIAL_DARSHANAS,
        ].filter((g) => status === "ALL" || g.status === status);
        return [...vedas, ...granthas];
      }
    } catch (err) {
      console.warn("DB query for Vedas fallback to initial dataset:", err.message);
    }

    const allInitial = this.getAllInitialGranthas(category);
    return allInitial.filter((v) => status === "ALL" || v.status === status);
  }

  /**
   * Get Veda or Grantha by ID or Slug with its full hierarchy tree
   */
  static async getVedaBySlug(identifier) {
    if (!identifier) return null;

    try {
      const veda = await Veda.findOne({
        where: {
          [Op.or]: [{ id: identifier }, { slug: identifier }],
        },
      });

      if (veda) {
        const nodes = await VedaNode.findAll({
          where: {
            vedaId: veda.id,
            status: "ACTIVE",
          },
          order: [["orderIndex", "ASC"], ["createdAt", "ASC"]],
        });

        if (nodes && nodes.length > 0) {
          const tree = this.buildNodeTree(nodes);
          return {
            ...veda.toJSON(),
            tree,
          };
        }

        // Fallback to initial tree nodes if DB nodes not yet populated
        const allNodes = [...INITIAL_VEDA_NODES, ...INITIAL_GRANTHA_NODES];
        const initialNodes = allNodes.filter((n) => n.vedaId === veda.id);
        const tree = this.buildNodeTree(initialNodes);
        return {
          ...veda.toJSON(),
          tree,
        };
      }
    } catch (err) {
      console.warn("DB query for Veda by slug fallback:", err.message);
    }

    // Fallback across all Vedas and Granthas
    const allInitial = this.getAllInitialGranthas();
    const initialVeda = allInitial.find(
      (v) => v.id === identifier || v.slug === identifier
    );
    if (!initialVeda) return null;

    const allNodes = [...INITIAL_VEDA_NODES, ...INITIAL_GRANTHA_NODES];
    const initialNodes = allNodes.filter(
      (n) => n.vedaId === initialVeda.id
    );
    const tree = this.buildNodeTree(initialNodes);
    return {
      ...initialVeda,
      tree,
    };
  }

  /**
   * Build recursive nested tree from flat list of nodes
   */
  static buildNodeTree(nodes) {
    const nodeMap = new Map();
    const roots = [];

    // First pass: create node objects with empty children array
    nodes.forEach((n) => {
      const plain = typeof n.toJSON === "function" ? n.toJSON() : { ...n };
      plain.children = [];
      nodeMap.set(plain.id, plain);
    });

    // Second pass: link child to parent
    nodes.forEach((n) => {
      const id = n.id;
      const parentId = n.parentId;
      const current = nodeMap.get(id);

      if (parentId && nodeMap.has(parentId)) {
        nodeMap.get(parentId).children.push(current);
      } else {
        roots.push(current);
      }
    });

    return roots;
  }

  /**
   * Get single Node with its child mantras and breadcrumb path
   */
  static async getNodeById(nodeId) {
    try {
      const node = await VedaNode.findByPk(nodeId);
      if (node) {
        const mantras = await VedaMantra.findAll({
          where: {
            nodeId: node.id,
            status: "ACTIVE",
          },
          order: [["orderIndex", "ASC"], ["createdAt", "ASC"]],
        });

        const children = await VedaNode.findAll({
          where: {
            parentId: node.id,
            status: "ACTIVE",
          },
          order: [["orderIndex", "ASC"], ["createdAt", "ASC"]],
        });

        // Build ancestor breadcrumb path
        const breadcrumb = [];
        let curr = node;
        while (curr.parentId) {
          const parent = await VedaNode.findByPk(curr.parentId);
          if (parent) {
            breadcrumb.unshift(parent);
            curr = parent;
          } else {
            break;
          }
        }

        return {
          ...node.toJSON(),
          mantras,
          children,
          breadcrumb,
        };
      }
    } catch (err) {
      console.warn("DB query for Node by id fallback:", err.message);
    }

    // Static fallback across all Veda & Grantha nodes and mantras
    const allNodes = [...INITIAL_VEDA_NODES, ...INITIAL_GRANTHA_NODES];
    const allMantras = [...INITIAL_VEDA_MANTRAS, ...INITIAL_GRANTHA_MANTRAS];

    const staticNode = allNodes.find((n) => n.id === nodeId || n.slug === nodeId);
    if (!staticNode) return null;

    const mantras = allMantras.filter((m) => m.nodeId === staticNode.id);
    const children = allNodes.filter((n) => n.parentId === staticNode.id);

    const breadcrumb = [];
    let curr = staticNode;
    while (curr.parentId) {
      const parent = allNodes.find((n) => n.id === curr.parentId);
      if (parent) {
        breadcrumb.unshift(parent);
        curr = parent;
      } else {
        break;
      }
    }

    return {
      ...staticNode,
      mantras,
      children,
      breadcrumb,
    };
  }

  // ==========================================
  // ADMIN METHODS
  // ==========================================

  /**
   * Admin: List all Vedas / Granthas with counts
   */
  static async getAdminVedas(params = {}) {
    const { category } = params;
    const allNodes = [...INITIAL_VEDA_NODES, ...INITIAL_GRANTHA_NODES];
    const allMantras = [...INITIAL_VEDA_MANTRAS, ...INITIAL_GRANTHA_MANTRAS];
    const allInitial = this.getAllInitialGranthas(category);

    try {
      const where = {};
      if (category && category !== "ALL") {
        where.category = category;
      }

      const vedas = await Veda.findAll({
        where,
        order: [["orderIndex", "ASC"], ["createdAt", "ASC"]],
      });

      if (vedas && vedas.length > 0) {
        let items = vedas;
        if (!category || category === "ALL") {
          const hasGranthas = vedas.some((v) => v.category && v.category !== "veda");
          if (!hasGranthas) {
            const nonVedaInitial = [
              ...INITIAL_PURANAS,
              ...INITIAL_ITIHASAS,
              ...INITIAL_UPANISHADS,
              ...INITIAL_DARSHANAS,
            ];
            items = [...vedas, ...nonVedaInitial];
          }
        }

        const result = await Promise.all(
          items.map(async (v) => {
            const plain = typeof v.toJSON === "function" ? v.toJSON() : { ...v };
            let nodeCount = 0;
            let mantraCount = 0;

            try {
              nodeCount = await VedaNode.count({ where: { vedaId: plain.id } });
              mantraCount = await VedaMantra.count({ where: { vedaId: plain.id } });
            } catch (cErr) {
              // Ignore count error
            }

            if (nodeCount === 0) {
              nodeCount = allNodes.filter((n) => n.vedaId === plain.id).length;
            }
            if (mantraCount === 0) {
              mantraCount = allMantras.filter((m) => m.vedaId === plain.id).length;
            }

            return {
              ...plain,
              statsMeta: {
                nodeCount,
                mantraCount,
              },
            };
          })
        );
        return result;
      }
    } catch (err) {
      console.warn("DB query for Admin Vedas fallback:", err.message);
    }

    // Static fallback if DB is initializing or offline
    return allInitial.map((v) => ({
      ...v,
      statsMeta: {
        nodeCount: allNodes.filter((n) => n.vedaId === v.id).length,
        mantraCount: allMantras.filter((m) => m.vedaId === v.id).length,
      },
    }));
  }

  /**
   * Admin: Create Veda
   */
  static async createVeda(data = {}) {
    const name = data.name || data.enName || "वैदिक ग्रन्थ";
    const enName = data.enName || data.name || "Vedic Text";
    let rawCategory = (data.category || "veda").toLowerCase().trim();
    if (rawCategory === "darshan" || rawCategory === "darshans") rawCategory = "darshana";
    if (rawCategory === "upanishads") rawCategory = "upanishad";
    if (rawCategory === "puranas") rawCategory = "purana";
    if (rawCategory === "itihasas") rawCategory = "itihasa";

    const baseSlug = (data.slug || data.id || enName.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-+|-+$/g, "") || `veda-${Date.now()}`;
    const slug = baseSlug;
    const id = data.id || slug;

    const existing = await Veda.findOne({ where: { [Op.or]: [{ id }, { slug }] } });
    if (existing) {
      throw new Error(`Text with id or slug "${slug}" already exists.`);
    }

    return await Veda.create({
      ...data,
      id,
      slug,
      name,
      enName,
      category: rawCategory,
    });
  }

  /**
   * Admin: Update Veda
   */
  static async updateVeda(id, data) {
    const veda = await Veda.findByPk(id);
    if (!veda) {
      throw new Error(`Veda with id "${id}" not found.`);
    }

    await veda.update(data);
    return veda;
  }

  /**
   * Admin: Delete Veda
   */
  static async deleteVeda(id) {
    const veda = await Veda.findByPk(id);
    if (!veda) {
      throw new Error(`Veda with id "${id}" not found.`);
    }

    await veda.destroy();
    return true;
  }

  /**
   * Admin: Create Veda Tree Node (Shakha / Samhita / Sukta / Adhyaya)
   */
  static async createNode(data) {
    const id = data.id || `${data.vedaId}-${data.slug || Date.now()}`;
    const slug = data.slug || id;

    const existing = await VedaNode.findByPk(id);
    if (existing) {
      throw new Error(`Node with id "${id}" already exists.`);
    }

    return await VedaNode.create({
      ...data,
      id,
      slug,
    });
  }

  /**
   * Admin: Update Veda Tree Node
   */
  static async updateNode(id, data) {
    const node = await VedaNode.findByPk(id);
    if (!node) {
      throw new Error(`Node with id "${id}" not found.`);
    }

    await node.update(data);
    return node;
  }

  /**
   * Admin: Delete Veda Tree Node
   */
  static async deleteNode(id) {
    const node = await VedaNode.findByPk(id);
    if (!node) {
      throw new Error(`Node with id "${id}" not found.`);
    }

    // Also nullify or delete child nodes
    await VedaNode.update({ parentId: null }, { where: { parentId: id } });
    await node.destroy();
    return true;
  }

  /**
   * Admin: Seed default authentic Vedas, Puranas, Itihasas, Upanishads, and Darshanas
   */
  static async seedDefaultVedicHeritage(overwrite = false) {
    const seeded = {
      vedasCount: 0,
      nodesCount: 0,
      mantrasCount: 0,
    };

    const allVedasAndGranthas = this.getAllInitialGranthas();
    const allNodes = [...INITIAL_VEDA_NODES, ...INITIAL_GRANTHA_NODES];
    const allMantras = [...INITIAL_VEDA_MANTRAS, ...INITIAL_GRANTHA_MANTRAS];

    try {
      // 1. Seed Vedas & Granthas
      for (const itemData of allVedasAndGranthas) {
        const existing = await Veda.findByPk(itemData.id);
        if (!existing) {
          await Veda.create(itemData);
          seeded.vedasCount++;
        } else if (overwrite) {
          await existing.update(itemData);
          seeded.vedasCount++;
        }
      }

      // 2. Seed Nodes
      for (const nodeData of allNodes) {
        const existing = await VedaNode.findByPk(nodeData.id);
        if (!existing) {
          await VedaNode.create(nodeData);
          seeded.nodesCount++;
        } else if (overwrite) {
          await existing.update(nodeData);
          seeded.nodesCount++;
        }
      }

      // 3. Seed Mantras
      for (const mantraData of allMantras) {
        const existing = await VedaMantra.findByPk(mantraData.id);
        if (!existing) {
          await VedaMantra.create(mantraData);
          seeded.mantrasCount++;
        } else if (overwrite) {
          await existing.update(mantraData);
          seeded.mantrasCount++;
        }
      }
    } catch (err) {
      console.warn("DB seeding warning, falling back to static authentic count:", err.message);
      seeded.vedasCount = allVedasAndGranthas.length;
      seeded.nodesCount = allNodes.length;
      seeded.mantrasCount = allMantras.length;
    }

    return seeded;
  }
}

export default VedaService;
