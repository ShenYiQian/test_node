import { Entity, Column, PrimaryColumn, Index, Generated, BaseEntity } from 'typeorm';
import { BaseShardEntity } from '../typeorm/BaseShardEntity';

@Entity('game2rd_bind')
//@shardTable(__filename, 3)
@Index(['gameId', 'thirdPartyId', 'accountType'], { unique: true })
export class Game2RDBind extends BaseShardEntity {
  @PrimaryColumn({ type: 'bigint', name: 'id' })
  @Generated()
  id: number;

  @Index()
  @Column({ type: 'bigint', name: 'guid' })
  guid: number;

  @Column({ type: 'bigint', name: 'game_id' })
  gameId: number;

  @Column({ type: 'varchar', name: 'third_party_id', length: 64 })
  thirdPartyId: string;

  @Column({ type: 'tinyint', name: 'account_type' })
  accountType: number;

  @Column({ type: 'varchar', name: 'third_party_nickname', length: 64 })
  thirdPartyNickname: string;

  @Column('varchar', { length: 4096, name: 'extra' })
  extra: string;

  @Column({ type:'bigint', name: 'bind_time' })
  bindTime: number;

  @Column({ type: 'bigint', name: 'update_time' })
  updateTime: number;
}