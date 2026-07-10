/**
 * Network Normalizer
 * Sanitizes and validates network data from the API
 */

import { z } from 'zod';

const NetworkSchema = z.object({
  distribuidor_id: z.number(),
  distribuidor_codigo: z.string(),
  total_downlines: z.number().min(0),
  active_downlines: z.number().min(0),
  depth: z.number().min(0),
  left_volume: z.number().min(0),
  right_volume: z.number().min(0),
  left_leg_count: z.number().min(0),
  right_leg_count: z.number().min(0),
});

const NetworkNodeSchema = z.object({
  id: z.number(),
  distribuidor_id: z.number(),
  distribuidor_codigo: z.string(),
  distribuidor_nome: z.string(),
  parent_id: z.number().optional(),
  leg: z.enum(['LEFT', 'RIGHT']).optional(),
  position: z.number().min(0),
  depth: z.number().min(0),
  left_volume: z.number().min(0),
  right_volume: z.number().min(0),
  active_downlines: z.number().min(0),
  total_downlines: z.number().min(0),
});

export class NetworkNormalizer {
  static normalize(data: any): any {
    try {
      const sanitized = this.sanitize(data);
      const validated = NetworkSchema.parse(sanitized);
      return this.enrich(validated);
    } catch (error) {
      throw new Error(`Invalid network data: ${error.message}`);
    }
  }

  static normalizeNode(data: any): any {
    try {
      const sanitized = this.sanitizeNode(data);
      const validated = NetworkNodeSchema.parse(sanitized);
      return this.enrichNode(validated);
    } catch (error) {
      throw new Error(`Invalid network node data: ${error.message}`);
    }
  }

  private static sanitize(data: any): any {
    return {
      distribuidor_id: Number(data.distribuidor_id),
      distribuidor_codigo: String(data.distribuidor_codigo || '').trim(),
      total_downlines: Number(data.total_downlines || 0),
      active_downlines: Number(data.active_downlines || 0),
      depth: Number(data.depth || 0),
      left_volume: Number(data.left_volume || 0),
      right_volume: Number(data.right_volume || 0),
      left_leg_count: Number(data.left_leg_count || 0),
      right_leg_count: Number(data.right_leg_count || 0),
    };
  }

  private static sanitizeNode(data: any): any {
    return {
      id: Number(data.id),
      distribuidor_id: Number(data.distribuidor_id),
      distribuidor_codigo: String(data.distribuidor_codigo || '').trim(),
      distribuidor_nome: String(data.distribuidor_nome || '').trim(),
      parent_id: data.parent_id ? Number(data.parent_id) : undefined,
      leg: data.leg ? String(data.leg).toUpperCase() : undefined,
      position: Number(data.position || 0),
      depth: Number(data.depth || 0),
      left_volume: Number(data.left_volume || 0),
      right_volume: Number(data.right_volume || 0),
      active_downlines: Number(data.active_downlines || 0),
      total_downlines: Number(data.total_downlines || 0),
    };
  }

  private static enrich(data: any): any {
    // Add computed fields
    const activationRate = data.total_downlines > 0
      ? (data.active_downlines / data.total_downlines) * 100
      : 0;
    const volumeBalance = Math.abs(data.left_volume - data.right_volume);
    const strongerLeg = data.left_volume > data.right_volume ? 'LEFT' : 'RIGHT';
    const totalVolume = data.left_volume + data.right_volume;

    return {
      ...data,
      activationRate: Math.round(activationRate * 100) / 100,
      volumeBalance,
      strongerLeg,
      totalVolume,
      isBalanced: volumeBalance < (totalVolume * 0.1), // Within 10% balance
    };
  }

  private static enrichNode(data: any): any {
    // Add computed fields
    const activationRate = data.total_downlines > 0
      ? (data.active_downlines / data.total_downlines) * 100
      : 0;
    const volumeBalance = Math.abs(data.left_volume - data.right_volume);
    const strongerLeg = data.left_volume > data.right_volume ? 'LEFT' : 'RIGHT';

    return {
      ...data,
      activationRate: Math.round(activationRate * 100) / 100,
      volumeBalance,
      strongerLeg,
      hasChildren: data.total_downlines > 0,
      isRoot: data.depth === 0,
    };
  }
}
