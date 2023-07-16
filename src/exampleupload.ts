// @ts-nocheck
import {roadman} from '.';
import {Resolver, Query, Arg} from 'type-graphql';

@Resolver()
class ExampleResolver {
    @Query(() => [String], {nullable: true})
    async stringUpload(
        @Arg('fileStr', () => String, {nullable: false}) file: string
    ): Promise<string[]> {
        console.log('file str', file);
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
