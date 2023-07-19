// @ts-nocheck
import {Query, Resolver} from 'type-graphql';

import {roadman} from '.';

@Resolver()
class ExampleResolver {
    @Query(() => [String], {nullable: true})
    async apps(): Promise<string[]> {
        // fake async in this example
        return ['Apps', 'one', 'two'];
    }
}

roadman({resolvers: [ExampleResolver]})
    .then(() => {
        console.log('roadman started');
    })
    .catch((error) => {
        console.error(error);
    });
