import ShardTableMetadataArgs from './lib/ShardTableMetadataArgs';
import { ConnectionOptions, createConnection } from 'typeorm';
import { shardTableMetadataStorage } from './lib/ShardTableMetadataStorage';
import * as LibFs from 'mz/fs';
import * as LibPath from 'path';
import { GameGuid } from './lib/entities/GameGuid';
import { ClusterOptions } from './lib/typeorm/ClusterOptions';
import { DatabaseFactory } from './lib/DatabaseFactory';

interface errorHandler {
  (error?: Error, funcName?: string): void
};

function errorCatcher(handler: errorHandler): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const func = descriptor.value
    return {
      get() {
        return (...args: any[]) => {
          return Promise.resolve(func.apply(target, args)).catch(error => {
            handler && handler(error, propertyKey)
          })
        }
      },
      set(newValue: any) {
        return newValue
      }
    }
  }
}

const classDecorator = (target: any) => {
  const keys = Object.getOwnPropertyNames(target.prototype);
  /*keys.map(key => {
    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
    console.log('funName = ', target.name);
    console.log('descriptor = ', descriptor);
  })*/

  console.log('get class prototype names = ', keys, target);
}

function errorHandler(error?: Error, funName?: string) {
  console.log(`${funName} get error: ${error}`);
}

class TestDecorator {
  private successFun() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('aaaa');
      })
    })
  }

  private failFun() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('bbbb');
      })
    })
  }

  @errorCatcher(errorHandler)
  public async test1(): Promise<any> {
    let result = await this.successFun();
    console.log(result);
  }

  @errorCatcher(errorHandler)
  public async test2(): Promise<any> {
    let result = await this.failFun();
    console.log(result);
  }

  @errorCatcher(errorHandler)
  public async test3(): Promise<any> {
    let result = await this.successFun();
    console.log(result);
    try {
      let result2 = await this.failFun();
      console.log(result2);
    } catch (error) {
      console.log('self catch error = ' + error);
    }
  }
}

let clusterOptions: ClusterOptions = {
  name: 'mysql',
  type: 'mysql',
  cluster: [
    {
      name: 'test_shard_0',
      type: 'mysql',
      host: '172.16.0.180',
      port: 3306,
      username: 'root',
      password: 'shinezone244',
      database: 'test_shard_0',
      synchronize: true,
      entities: [LibPath.join(__dirname, 'lib/entities/*.js')]
    },
    {
      name: 'test_shard_0',
      type: 'mysql',
      host: '172.16.0.180',
      port: 3306,
      username: 'root',
      password: 'shinezone244',
      database: 'test_shard_1',
      synchronize: true,
      entities: [LibPath.join(__dirname, 'lib/entities/*.js')]
    },
    {
      name: 'test_shard_0',
      type: 'mysql',
      host: '172.16.0.180',
      port: 3306,
      username: 'root',
      password: 'shinezone244',
      database: 'test_shard_2',
      synchronize: true,
      entities: [LibPath.join(__dirname, 'lib/entities/*.js')]
    }
  ]
}

async function main(entityPath: string) {
  try {
    const tablePath = LibPath.join(entityPath, `/shardTables`);
    let files = await LibFs.readdirSync(entityPath);
    for(const file of files) {
      if(file.indexOf('.js') >= 0) {
        const context = await LibFs.readFileSync(`${entityPath}/${file}`, 'utf-8');
        console.log('context = ', context);
      }
    }
    console.log(files);
    //await DatabaseFactory.instance.createClusterConnections([clusterOptions]);
    /*console.log('create connection finish');
    let gameguid = new GameGuid('123123123');
    gameguid.guid = 123123123;
    gameguid.gameId = 123123;
    gameguid.isBinding = 1;
    gameguid.sessionId = '123123';
    gameguid.sessionExpireTime = Date.now();
    gameguid.save();*/
    
    for (let table of shardTableMetadataStorage()) {
      console.log(table, entityPath);
      const splitArr: Array<string> = table.tablePath.split('\\');
      let fileName = splitArr[splitArr.length - 1];
      fileName = fileName.substr(0, fileName.length - 3);
      console.log('this table file name = ' + fileName);
      for (let i = 0; i < table.shardCount; i++) {

        try {
          const newFilePath = `${tablePath}/${fileName}_${i}.js`;
          await LibFs.copyFileSync(table.tablePath, newFilePath);
          const readFile = await LibFs.readFileSync(table.tablePath, 'utf-8');
          const newClassName = `${table.className}_${i}`
          await LibFs.writeFile(newFilePath, readFile.replace(new RegExp(table.className, 'gm'), newClassName));
        } catch (error) {
          console.log('caught error = ', error);
        }
        //console.log('readFile = ', readFile);
        //
        //if(LibFs.exists(LibPath.join(__dirname, 'lib/entities')))
      }
    }
    
  } catch (error) {
    console.log('caught error = ', error);
  }
}

main(LibPath.join(__dirname, 'lib/entities'));