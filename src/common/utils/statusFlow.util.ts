/**
 * Valida una transición de estado según un flujo permitido.
 * @param current Estado actual
 * @param next Estado siguiente
 * @param flowConfig Objeto que define las transiciones válidas
 * @returns boolean
 */
export function validateStatusFlow<T extends string>(
  current: T,
  next: T,
  flowConfig: Record<T, T[]>,
): boolean {
  const allowed = flowConfig[current] || [];
  return allowed.includes(next);
}
