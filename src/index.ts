import { ClusterOptions } from './lib/typeorm/ClusterOptions';
import { DatabaseFactory } from './lib/DatabaseFactory';
import * as LibPath from 'path';

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
      entities: [LibPath.join(__dirname, 'lib/entities/**/*.js')]
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
      entities: [LibPath.join(__dirname, 'lib/entities/**/*.js')]
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
      entities: [LibPath.join(__dirname, 'lib/entities/**/*.js')]
    }
  ]
}

async function main() {
  try {
    await DatabaseFactory.instance.createClusterConnections([clusterOptions]);
    const shardKey:string = '23345678';
    let module = DatabaseFactory.instance.getShardEntity('GameGuid', shardKey);
    let b = new module(shardKey);
    b.guid = parseInt(shardKey);
    b.gameId = 123;
    b.isBinding = 123;
    b.sessionId = '123123';
    b.sessionExpireTime = Date.now();
    b.save().then(result => {
      console.log('onSaveSuccess :',result);
    });

    //let cc = await module.findOne({guid:parseInt(shardKey)}, shardKey);
    //console.log('findOne result = ', cc);
    //console.log(e);
    //let g1 = new gg(guid);
    //console.log(gg, GameGuid);
    //g1.gameId = 123;
    //g1.isBinding = 123;
    //g1.sessionId = '123123';
    //g1.sessionExpireTime = Date.now();
    //gameGuid.save();
    //g1.save(guid.toString());
  } catch (error) {
  console.log('error = ', error);
}
}

main().then(_ => _);

