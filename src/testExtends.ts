import { Entity } from 'typeorm';

@Entity('A')
export default class testClass {
  public test() {
    console.log('test');
  }
}