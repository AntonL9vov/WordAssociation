export type StorageType = 'memory' | 'postgres';

export interface StorageConfig {
  type: StorageType;
}

export const getStorageConfig = (): StorageConfig => {
  const storageType = (process.env.STORAGE_TYPE as StorageType) || 'memory';
  
  if (!['memory', 'postgres'].includes(storageType)) {
    throw new Error(`Invalid storage type: ${storageType}. Must be 'memory' or 'postgres'`);
  }
  
  return {
    type: storageType,
  };
};