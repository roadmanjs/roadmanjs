
<p align="center">
  <h1 align="center"> RoadmanJS - build backend services</h1>
</p>


<div align="center">

<img width="500px" src="./docs/roadman_dance.gif"></img>


<div style="display: flex;justify-content:center;">

<img alt="NPM" src="https://img.shields.io/npm/dt/roadman.svg"></img>
 

</div>

</div>


An efficient, and flexible NodeJS library for building backend services.


### Roadman Features


| Feature            | Progress |
| ----------------- | -------- |
| CORE: expressjs, rest/graphql api, redis, queue, subscriptions | ✅        |
| [Couchbase](https://github.com/roadmanjs/couchset) - couchset orm   | ✅        |
| [Auth & User](https://github.com/roadmanjs/auth) - phone login, create user resolvers   | ✅        |
| [Firebase](https://github.com/roadmanjs/firebase-admin) - auth, storage, e.t.c   | ✅        |
## 1. Install
```bash
npm i roadman --save
```

## 2. Basic example
```ts
import {roadman} from 'roadman';
import {Resolver, Query} from 'couchset';

// Create a demo GraphQL resolver
@Resolver()
class ExampleResolver {
    @Query(() => [String], {nullable: true})
    async apps(): Promise<string[]> {

        return ['Apps', 'one', 'two'];
    }
}

// run roadman
await roadman({resolvers: [ExampleResolver]});

```


## 3. With model automation
 [example file here](./src/app.example.ts)

```ts
import {roadman} from 'roadman';
import {Model, ObjectType, InputType, Field} from 'couchset';

@InputType('PersonInput')
@ObjectType()
class Person {
    @Field(() => String, {nullable: true})
    id?: string = '';

    @Field(() => String, {nullable: true})
    firstname?: string = '';

    @Field(() => String, {nullable: true})
    lastname?: string = '';

    @Field(() => Number, {nullable: true})
    phone?: number = 0;
}

const PersonModel = new Model('Person', {graphqlType: Person});
const {resolver} = PersonModel.automate({
    getById: {public: true},
    createUpdate: {public: true},
    pagination: {public: true},
});

await roadman({resolvers: [resolver]});

```


## 3. With auth/user resolvers

```ts
import { couchsetRoadman } from '@roadmanjs/couchset';
import { firebaseRoadman } from '@roadmanjs/firebase-admin';
import { getAuthResolvers } from '@roadmanjs/auth';
import { roadman } from "roadman";

const resolvers = [...getAuthResolvers()];

const run = async () => {
  await roadman({
    roadmen: [firebaseRoadman, couchsetRoadman],
    resolvers,
  })
}

run();
```
