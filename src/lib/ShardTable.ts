import ShardTableMetadataArgs from './ShardTableMetadataArgs';
import { shardTableMetadataStorage } from './ShardTableMetadataStorage';

export function shardTable(tablePath:string, shardCount: number): Function {
  return (target: any) => {
    const args:ShardTableMetadataArgs = {
      tablePath: tablePath,
      className: target.name,
      shardCount: shardCount
    }
    console.log('push to storage');
    shardTableMetadataStorage().push(args);
  }
}