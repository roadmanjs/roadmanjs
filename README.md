
<p align="center">
  <h1 align="center"> RoadmanJS - build backend services</h1>
</p>


<div align="center">

<img width="200px" src="./docs/roadman.png"></img>

<div style="display: flex;justify-content:center;">

<img alt="NPM" src="https://img.shields.io/npm/dt/roadman.svg"></img>
 

</div>

</div>


An efficient, and flexible NodeJS library for building backend services.


## 1. Install
```bash
npm i roadman --save
```

## 2. Start Roadman
```ts
import {roadman} from 'roadman';
import {Resolver, Query} from 'type-graphql';

// Create a demo GraphQL resolver
@Resolver()
class ExampleResolver {
    @Query(() => [String], {nullable: true})
    async apps(): Promise<string[]> {

        return ['Apps', 'one', 'two'];
    }
}

// run roadman
const run = await roadman({resolvers: [ExampleResolver]});

```
