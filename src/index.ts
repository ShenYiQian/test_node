import { DatabaseOptions, DatabaseFactory } from 'sasdn-database';
import * as LibPath from 'path';

let databaseOptions: DatabaseOptions = {
  name: 'mysql',
  type: 'mysql',
  shardingStrategies: [
    {
      connctionName: 'test_shard_0',
      entities: [
        'Game2RDBind',
        'GameGuid_2',
      ],
    },
    {
      connctionName: 'test_shard_1',
      entities: [
        'GameGuid_0',
        'GameGuid_3',
      ],
    },
    {
      connctionName: 'test_shard_2',
      entities: [
        'GameGuid_1',
        'GameGuid_4',
      ],
    },
  ],
  optionList: [
    {
      name: 'test_shard_0',
      type: 'mysql',
      host: '172.16.0.180',
      port: 3306,
      username: 'root',
      password: 'shinezone244',
      database: 'test_shard_0',
      synchronize: false,
      logging: ["schema", "info", "log", ],
      entities: [LibPath.join(__dirname, 'lib/entities/*.js')]
    },
    {
      name: 'test_shard_1',
      type: 'mysql',
      host: '172.16.0.180',
      port: 3306,
      username: 'root',
      password: 'shinezone244',
      database: 'test_shard_1',
      synchronize: false,
      entities: [LibPath.join(__dirname, 'lib/entities/*.js')]
    },
    {
      name: 'test_shard_2',
      type: 'mysql',
      host: '172.16.0.180',
      port: 3306,
      username: 'root',
      password: 'shinezone244',
      database: 'test_shard_2',
      synchronize: false,
      entities: [LibPath.join(__dirname, 'lib/entities/*.js')]
    }
  ]
}

interface aaa {
  aa: string;
  bb?: string;
}

async function main() {
  try {
    await DatabaseFactory.instance.initialize(databaseOptions, __dirname);

    let success:number = 0;
    let fail:number = 0;
    for (let i = 0; i < 10000; i++) {
      const shardKey = 1000000+i;
      const md = DatabaseFactory.instance.getEntity('GameGuid', shardKey);
      // let b = new md(shardKey);
      // b.guid = shardKey;
      // b.gameId = 123;
      // b.isBinding = 123;
      // b.sessionId = '123123';
      // b.sessionExpireTime = Date.now();
      try {
        let result = await md.findOne({guid:shardKey});
        //console.log('result = ', result);
        //let result = await b.save();
        success ++;
        //console.log('get result = ', result);
      } catch (error) {
        fail ++;
        console.log('on save caught error = ', error);
      }
    }
    console.log('success = ', success, '| fail = ', fail);
  } catch (error) {
    console.log('error = ', error);
  }
}

main().then(_ => _);

