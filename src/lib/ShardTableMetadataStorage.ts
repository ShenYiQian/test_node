import ShardTableMetadataArgs from "./ShardTableMetadataArgs";

function getGlobal(): any {
  return global;
}

export function shardTableMetadataStorage(): Array<ShardTableMetadataArgs> {
  const globalSpace = getGlobal();
  if (!globalSpace.shardTableMetadataStorage) {
    globalSpace.shardTableMetadataStorage = [];
  }
  return globalSpace.shardTableMetadataStorage;
}