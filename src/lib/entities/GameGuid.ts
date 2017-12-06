
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BaseOrmEntity, shardTable } from 'sasdn-database';

@Entity('game_guid')
@shardTable(5)
export class GameGuid extends BaseOrmEntity {
  @PrimaryColumn({ type: 'bigint', name: 'guid' })
  guid: number;

  @Column({ type: 'bigint', name: 'game_id' })
  gameId: number;

  @Column({ type: 'tinyint', name: 'is_binging' })
  isBinding: number;

  @Column({ type: 'varchar', name: 'session_id', length: 255})
  sessionId: string;

  @Column({ type: 'bigint', name: 'create_time' })
  createTime: number;

  @Column({ type: 'bigint', name: 'session_expire_time' })
  sessionExpireTime: number;
}